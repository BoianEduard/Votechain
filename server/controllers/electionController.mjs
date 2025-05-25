import models from "../models/index.mjs";
import { generateKeyPair, encryptPrivateKey } from "../services/cryptoUtils.mjs";
import * as contractUtils from "../services/contractUtils.mjs";

const createElection = async (req, res) => {
    try {
        const electionKeys = generateKeyPair();

        const encryptedPrivateKey = encryptPrivateKey(electionKeys.privateKey);

        const election = await models.Election.create({
            ...req.body,
            publicKey: electionKeys.publicKey,
            privateKey: encryptedPrivateKey,
        });

        const electionData = election.toJSON();
        delete electionData.privateKey;

        return res.status(201).json({
            message: "Election created successfully!",
            ...electionData,
        });
    } catch (error) {
        console.error("Error creating election:", error);
        return res.status(500).json({
            error: error.message || "Failed to create election",
        });
    }
};

const getAllElections = async (req, res) => {
    try {
        const userId = req.user.userId;
        const elections = await models.Election.findAll({
            include: [
                {
                    model: models.VoterRegistration,
                    where: { userId },
                    required: true,
                },
                {
                    model: models.Candidate,
                    as: "candidates",
                },
            ],
            attributes: { exclude: ["privateKey"] },
        });

        return res.status(200).json(elections);
    } catch (error) {
        console.error("Error fetching elections:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getElectionById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const electionId = req.params.id;

        const election = await models.Election.findOne({
            where: { id: electionId },
            include: [
                {
                    model: models.VoterRegistration,
                    where: { userId },
                    required: true,
                },
                {
                    model: models.Candidate,
                    as: "candidates",
                },
            ],
            attributes: { exclude: ["privateKey"] }
        });

        if (!election) {
            return res.status(404).json({ message: "Election not found or not eligible" });
        }

        return res.status(200).json(election);
    } catch (error) {
        console.error("Error fetching election:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const deleteElection = async (req, res) => {
    try {
        const { electionId } = req.params;

        if (!electionId) {
            return res.status(400).json({ error: 'Missing electionId' });
        }

        await models.Candidate.destroy({
            where: { electionId }
        });

        await models.VoterRegistration.destroy({
            where: { electionId }
        });

        const deleted = await models.Election.destroy({
            where: { id: electionId }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Election not found' });
        }

        res.status(200).json({ message: 'Election and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting election:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalVotes = await models.Candidate.sum("votes");

        const activeElectionsCount = await models.VoterRegistration.aggregate("electionId", "count", {
            distinct: true
        });

        const participantCount = await models.VoterRegistration.aggregate("userId", "count", {
            distinct: true
        });

        return res.status(200).json({
            stats: [
                {
                    label: "Active Elections",
                    value: activeElectionsCount,
                    color: "#4361ee",
                },
                {
                    label: "Votes Cast",
                    value: totalVotes || 0,
                    color: "#2ec4b6",
                },
                {
                    label: "Participants",
                    value: participantCount,
                    color: "#e63946",
                },
            ],
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({
            message: "Failed to fetch dashboard stats",
        });
    }
};

const getTurnout = async (req, res) => {
    try {
        const { electionId } = req.params;
        if (!electionId) {
            return res.status(400).json({ message: "Election ID is required" });
        }

        const election = await models.Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        if (!election.contractAddress) {
            return res
                .status(400)
                .json({ message: "Election contract not deployed yet" });
        }

        const contract = contractUtils.getProviderContract(election.contractAddress);
        const { totalEligible, totalCast } = await contractUtils.fetchVotingStats(contract);

        return res.status(200).json({
            totalVoters: totalEligible,
            currentTurnout: totalCast
        });
    } catch (err) {
        console.error("Error fetching voter turnout:", err);
        return res.status(500).json({ message: "Failed to fetch voter turnout" });
    }
};

export default {
    createElection,
    getAllElections,
    getElectionById,
    deleteElection,
    getDashboardStats,
    getTurnout
};