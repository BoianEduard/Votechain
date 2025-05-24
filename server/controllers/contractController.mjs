import models from "../models/index.mjs";
import {deployContract} from "../deploy/deploy.mjs";
import { ethers } from "ethers";
import ElectionContractABI from '../artifacts/contracts/ElectionContract.sol/ElectionContract.json' assert { type: 'json' };
import { getProvider, getSigner } from "../services/ethers.mjs";
import {decryptPrivateKey, decryptVote} from "../services/cryptoUtils.mjs";

const deployElectionContract = async (req, res) => {
    try {
        const { electionId } = req.body;

        if (!electionId) {
            return res.status(400).json({ message: "Election ID is required" });
        }

        const registrations = await models.VoterRegistration.findAll({
            where: { electionId },
        });

        const userIds = registrations.map(r => r.userId);

        const users = await models.User.findAll({
            where: { id: userIds },
            attributes: ['id', 'address']
        });

        const eligibleVoters = users.map(user => user.address);

        const contractAddress = await deployContract({ eligibleVoters });

        await models.Election.update(
            { contractAddress },
            { where: { id: electionId } }
        );

        return res.status(200).json({
            message: "Contract deployed successfully",
            contractAddress,
        });

    } catch (error) {
        console.error("Error deploying election contract:", error);
        return res.status(500).json({ message: "Failed to deploy contract" });
    }
};

const castVote = async (req, res) => {
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

        if (!election.contractAddress) {
            return res.status(400).json({ message: "Election contract was not found for this election" });
        }

        const now = new Date();
        if (now < new Date(election.startDate) || now > new Date(election.endDate)) {
            return res.status(400).json({ message: "Election is not active" });
        }

        const voterRegistration = await models.VoterRegistration.findOne({
            where: {
                electionId,
                userId,
                status: 'registered'
            }
        });

        if (!voterRegistration) {
            return res.status(403).json({ message: "You are not registered for this election" });
        }

        const user = await models.User.findByPk(userId);
        if (!user || !user.publicKey || !user.address) {
            return res.status(400).json({ message: "User public key or address not found" });
        }

        // Verify the address matches
        const address = user.address.toLowerCase();
        if (address !== userAddress.toLowerCase()) {
            return res.status(403).json({ message: "Address mismatch" });
        }

        const provider = getProvider();
        const signer = getSigner();
        const contract = new ethers.Contract(
            election.contractAddress,
            ElectionContractABI.abi,
            signer
        );

        const hasVoted = await contract.hasAlreadyVoted(address);
        if (hasVoted) {
            return res.status(400).json({ message: "You have already voted in this election" });
        }

        // The encryptedVote is already hex-encoded from the frontend
        // The signature is already in the correct format from personal_sign

        // If using ethers v6+
        const tx = await contract.submitVote(
            address,
            encryptedVote, // Already hex-encoded bytes
            signature      // Already a properly formatted signature
        );

        const receipt = await tx.wait();

        if (receipt.status !== 1) {
            throw new Error("Transaction failed");
        }

        return res.status(200).json({
            message: "Vote cast successfully",
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error("Error casting vote:", error);
        return res.status(500).json({ message: "Failed to cast vote", error: error.message });
    }
};

const getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Check if election exists
        const election = await models.Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        // If real-time results are not enabled, check if election has ended
        if (!election.realTimeResults) {
            const now = new Date();
            if (now < new Date(election.endDate)) {
                return res.status(403).json({
                    message: "Election has not ended yet and real-time results are not enabled"
                });
            }
        }

        // Check if contract is deployed
        if (!election.contractAddress) {
            return res.status(400).json({ message: "Election contract not deployed" });
        }

        // Get contract instance
        const provider = getProvider();
        const contract = new ethers.Contract(
            election.contractAddress,
            ElectionContractABI.abi,
            provider
        );

        // Get voting statistics from contract with proper type handling
        const [totalEligibleVoters, totalVotesCast, participationRate] = await contract.getVotingStats();

        // Convert BigNumber values safely
        const eligibleVotersCount = typeof totalEligibleVoters.toNumber === 'function'
            ? totalEligibleVoters.toNumber()
            : Number(totalEligibleVoters);

        const votesCastCount = typeof totalVotesCast.toNumber === 'function'
            ? totalVotesCast.toNumber()
            : Number(totalVotesCast);

        const participationRateValue = typeof participationRate.toNumber === 'function'
            ? participationRate.toNumber()
            : Number(participationRate);

        // Get all votes from blockchain events
        const filter = contract.filters.VoteSubmitted();
        const events = await contract.queryFilter(filter);

        // Get candidates for this election
        const candidates = await models.Candidate.findAll({
            where: { electionId },
            attributes: ['id', 'name', 'position', 'description', 'imageUrl', 'votes']
        });

        if (!candidates.length) {
            return res.status(404).json({ message: "No candidates found for this election" });
        }

        // Initialize vote counts
        const voteCounts = {};
        candidates.forEach(candidate => {
            voteCounts[candidate.id] = 0;
        });

        // Process votes if there are any
        if (events.length > 0) {
            // Get and decrypt the private key
            const privateKey = decryptPrivateKey(election.privateKey);

            // Process each vote
            for (const event of events) {
                try {
                    const encryptedVoteHex = event.args.encryptedVote;

                    // Convert hex to base64 properly
                    const encryptedVoteBuffer = Buffer.from(encryptedVoteHex.slice(2), 'hex'); // Remove '0x' prefix
                    const encryptedVoteBase64 = encryptedVoteBuffer.toString('base64');

                    // Decrypt the vote to get the candidate ID
                    const candidateId = await decryptVote(encryptedVoteBase64, privateKey);

                    // Increment vote count if it's a valid candidate
                    if (voteCounts[candidateId] !== undefined) {
                        voteCounts[candidateId]++;
                    }
                } catch (error) {
                    console.error(`Error processing vote: ${error.message}`);
                    // Continue with other votes even if one fails
                }
            }

            // Update vote counts in database
            for (const candidate of candidates) {
                const voteCount = voteCounts[candidate.id] || 0;
                try {
                    await candidate.update({ votes: voteCount });
                } catch (error) {
                    console.error(`Error updating vote count for candidate ${candidate.id}:`, error);
                }
            }
        }

        // Determine the winner
        let winnerCandidateId = null;
        let maxVotes = -1;

        for (const [candidateId, voteCount] of Object.entries(voteCounts)) {
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                winnerCandidateId = candidateId;
            }
        }

        // Find winner candidate
        const winnerCandidate = candidates.find(c => c.id === winnerCandidateId);

        // Format candidate results
        const candidateResults = candidates.map(candidate => {
            const id = candidate.id;
            const voteCount = voteCounts[id] || 0;
            return {
                id,
                name: candidate.name,
                description: candidate.description,
                imageUrl: candidate.imageUrl,
                voteCount,
                percentage: votesCastCount > 0
                    ? (voteCount / votesCastCount * 100).toFixed(2)
                    : 0
            };
        });

        // Sort by vote count (descending)
        candidateResults.sort((a, b) => b.voteCount - a.voteCount);

        // Store results in database if election has ended
        const now = new Date();
        if (now > new Date(election.endDate) && election.status !== 'closed') {
            // Check if results already exist
            const existingResult = await models.Result.findOne({
                where: { electionId }
            });

            if (!existingResult) {
                // Create result record
                await models.Result.create({
                    electionId,
                    voterTurnout: parseFloat(participationRateValue),
                    electionWinner: winnerCandidate ? winnerCandidate.name : "No winner"
                });

                // Update election status
                await election.update({ status: 'closed' });
            }
        }

        // Return formatted results
        return res.status(200).json({
            electionId,
            title: election.title,
            description: election.description,
            startDate: election.startDate,
            endDate: election.endDate,
            stats: {
                totalEligibleVoters: eligibleVotersCount,
                totalVotesCast: votesCastCount,
                participationRate: parseFloat(participationRateValue)
            },
            candidates: candidateResults,
            winner: winnerCandidateId ? {
                id: winnerCandidateId,
                name: winnerCandidate.name,
                voteCount: voteCounts[winnerCandidateId],
                percentage: votesCastCount > 0
                    ? (voteCounts[winnerCandidateId] / votesCastCount * 100).toFixed(2)
                    : 0
            } : null
        });

    } catch (error) {
        console.error("Error fetching election results:", error);
        return res.status(500).json({
            message: "Failed to fetch election results",
            error: error.message
        });
    }
};

export default {
    deployElectionContract,
    castVote,
    getElectionResults
}