import models from "../models/index.mjs";
import {deployContract} from "../deploy/deploy.mjs";
import { ethers } from "ethers";
import ElectionContractABI from '../artifacts/contracts/ElectionContract.sol/ElectionContract.json' assert { type: 'json' };
import { getProvider, getSigner } from "../middleware/ethers.mjs";

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


export default {
    deployElectionContract,
    castVote
}