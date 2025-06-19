import models from "../models/index.mjs";
import * as contractUtils from "../services/contractUtils.mjs";

const deployElectionContract = async (req, res, next) => {
    try {
        const { electionId } = req.body;
        if (!electionId) {
            return res.status(400).json({ message: "Election ID is required" });
        }

        const regs = await models.VoterRegistration.findAll({
            where: { electionId }
        });

        const userIds = regs.map(r => r.userId);
        const users = await models.User.findAll({
            where: { id: userIds },
            attributes: ["address"]
        });
        const eligibleVoters = users.map(u => u.address);

        // folosim namespace‐importul
        const contractAddress = await contractUtils.deployElectionOnChain(eligibleVoters);

        await models.Election.update(
            { contractAddress },
            { where: { id: electionId } }
        );

        return res.status(200).json({
            message: "Contract deployed successfully",
            contractAddress
        });
    } catch (error) {
        next(error);
    }
};

const castVote = async (req, res, next) => {
    try {
        const { electionId, encryptedVote, signature, address: userAddress } = req.body;
        const userId = req.user?.userId;
        if (!electionId || !encryptedVote || !signature) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const election = await models.Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        const now = new Date();
        if (now < new Date(election.startDate) || now > new Date(election.endDate))
        {
            return res.status(400).json({ message: "Election is not active" });
        }

        const voterReg = await models.VoterRegistration.findOne({
            where: { electionId, userId, status: "registered" }
        });

        if (!voterReg) {
            return res
                .status(403)
                .json({ message: "You are not registered for this election" });
        }

        const user = await models.User.findByPk(userId);
        if (!user || !user.address) {
            return res
                .status(400)
                .json({ message: "User public key or address not found" });
        }
        if (user.address.toLowerCase() !== userAddress.toLowerCase()) {
            return res.status(403).json({ message: "Address mismatch" });
        }

        // apelăm helper-ele prin contractUtils
        const contract = contractUtils.getSignableContract(election.contractAddress);
        if (await contractUtils.hasAlreadyVoted(contract, userAddress)) {
            return res
                .status(400)
                .json({ message: "You have already voted in this election" });
        }

        const txHash = await contractUtils.submitVoteToContract(
            contract,
            userAddress,
            encryptedVote,
            signature
        );

        return res.status(200).json({
            message: "Vote cast successfully",
            transactionHash: txHash
        });

    } catch (error) {
        next(error);
    }
};


//ar trebui un refactoring serios aici => resultUtils in progress
const getElectionResults = async (req, res, next) => {
    try {
        const { electionId } = req.params;

        const election = await models.Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        if (!election.realTimeResults && new Date() < new Date(election.endDate)) {
            return res.status(403).json({
                message: "Election has not ended yet and real-time results are not enabled"
            });
        }

        const candidates = await models.Candidate.findAll({
            where: { electionId },
            attributes: ["id", "name", "description", "imageUrl", "votes"]
        });

        if (!candidates.length) {
            return res.status(404).json({ message: "No candidates found for this election" });
        }

        // verifica dacă alegerile sunt inchise si avem rezultate stocate
        const existingResult = await models.Result.findOne({
            where: { electionId }
        });

        let voteCounts;
        let stats;

        if (election.status === "closed" && existingResult) {
            // ALEGERI ÎNCHISE: folosește datele din modelele BD
            console.log("Using stored results for closed election");

            voteCounts = {};
            candidates.forEach(candidate => {
                voteCounts[candidate.id] = candidate.votes;
            });

            stats = {
                totalCast: existingResult.totalCast, // din baza de date
                participationRate: existingResult.voterTurnout
            };

        } else {
            // ALEGERI ÎN CURS sau cu rezultate în timp real: apeleaza contractul
            console.log("Fetching live results from contract");

            const contract = contractUtils.getProviderContract(election.contractAddress);
            stats = await contractUtils.fetchVotingStats(contract);
            const events = await contractUtils.fetchVoteEvents(contract);

            const candidateIds = candidates.map(c => c.id);
            voteCounts = await contractUtils.countVotes(
                events,
                election.privateKey,
                candidateIds
            );

            // actualizeaza voturile în baza de date
            await Promise.all(
                candidates.map(c => c.update({ votes: voteCounts[c.id] || 0 })
                    .catch(err => console.error(`Error updating candidate ${c.id}:`, err))
                )
            );

            // verifica dacă alegerile trebuie închise
            if (new Date() > new Date(election.endDate) && election.status !== "closed") {
                const { winnerId } = contractUtils.determineWinner(voteCounts);

                if (!existingResult) {
                    await models.Result.create({
                        electionId,
                        voterTurnout: stats.participationRate,
                        totalCast: stats.totalCast, // salvează și totalCast
                        electionWinner: winnerId
                            ? candidates.find(c => c.id === winnerId).name
                            : "No winner"
                    });
                    await election.update({ status: "closed" });
                }
            }
        }

        const { winnerId } = contractUtils.determineWinner(voteCounts);
        const totalCast = stats.totalCast;

        const candidateResults = candidates
            .map(c => ({
                id: c.id,
                name: c.name,
                description: c.description,
                imageUrl: c.imageUrl,
                voteCount: voteCounts[c.id] || 0,
                percentage: totalCast > 0
                    ? ((voteCounts[c.id] / totalCast) * 100).toFixed(2)
                    : "0.00"
            }))
            .sort((a, b) => b.voteCount - a.voteCount);

        return res.status(200).json({
            electionId,
            title: election.title,
            description: election.description,
            startDate: election.startDate,
            endDate: election.endDate,
            stats,
            candidates: candidateResults,
            winner: winnerId != null
                ? {
                    id: winnerId,
                    name: candidates.find(c => c.id === winnerId).name,
                    voteCount: voteCounts[winnerId],
                    percentage: totalCast > 0
                        ? ((voteCounts[winnerId] / totalCast) * 100).toFixed(2)
                        : "0.00"
                }
                : null
        });
    } catch (error) {
        next(error);
    }
};

export default {
    deployElectionContract,
    castVote,
    getElectionResults
};
