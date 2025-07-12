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

        const deploymentInfo = await contractUtils.deployElectionOnChain(eligibleVoters);
        await models.Election.update(
            {
                contractAddress: deploymentInfo.contractAddress,
                deploymentBlock: deploymentInfo.deploymentBlock
            },
            { where: { id: electionId } }
        );

        return res.status(200).json({
            message: "Contract deployed successfully",
            contractAddress: deploymentInfo.contractAddress,
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

export default {
    deployElectionContract,
    castVote
};
