import models from "../models/index.mjs";
import { generateKeyPair, encryptPrivateKey } from "../services/cryptoUtils.mjs";
import {
    calculateAndStoreResults,
    getElectionStatus,
    returnCachedResults,
    updateElectionStatus
} from "../services/electionUtils.mjs";
import * as contractUtils from "../services/contractUtils.mjs";

const createElection = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const electionKeys = generateKeyPair();
        const encryptedPrivateKey = encryptPrivateKey(electionKeys.privateKey);

        const today = new Date();
        const startDate = new Date(req.body.startDate);
        const status = startDate >= today ? "active" : "draft";

        const election = await models.Election.create({
            ...req.body,
            publicKey: electionKeys.publicKey,
            privateKey: encryptedPrivateKey,
            creatorId: userId,
            status: status
        });

        const electionData = election.toJSON();
        delete electionData.privateKey;

        return res.status(201).json({
            message: "Election created successfully!",
            ...electionData,
        });
    } catch (error) {
        next(error);
    }
};

const getAllElections = async (req, res, next) => {
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

        const now = new Date();
        const electionsToUpdate = [];

        elections.forEach(election => {
            const currentStatus = getElectionStatus(election);
            if (currentStatus !== election.status) {
                electionsToUpdate.push({
                    id: election.id,
                    newStatus: currentStatus
                });
                election.status = currentStatus; // Actualizează obiectul local
            }
        });

        // bulk update
        if (electionsToUpdate.length > 0) {
            await Promise.all(
                electionsToUpdate.map(({ id, newStatus }) =>
                    models.Election.update({ status: newStatus }, { where: { id } })
                )
            );
        }

        return res.status(200).json(elections);
    } catch (error) {
        next(error);
    }
};

const getElectionById = async (req, res, next) => {
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

        const updatedElection = await updateElectionStatus(election);

        return res.status(200).json(updatedElection);
    } catch (error) {
        next(error);
    }
};

// only be called when there is an issue in deploying the contract, but candidates and voter registration will already
// be populated
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
        next(error);
    }
};

const getDashboardStats = async (req, res, next) => {
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
        next(error);
    }
};


const getTurnout = async (req, res, next) => {
    try {
        const { electionId } = req.params;
        if (!electionId) {
            return res.status(400).json({ message: "Election ID is required" });
        }

        const election = await models.Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        const existingResult = await models.Result.findOne({
            where: { electionId }
        });

        let totalEligible, totalCast;

        if (election.status === "closed" && existingResult) {
            totalCast = existingResult.totalCast;
            totalEligible = Math.round(totalCast / (existingResult.voterTurnout / 100));

        } else {
            const contract = contractUtils.getProviderContract(election.contractAddress);
            const stats = await contractUtils.fetchVotingStats(contract);

            totalEligible = stats.totalEligible;
            totalCast = stats.totalCast;
        }

        return res.status(200).json({
            totalVoters: totalEligible,
            currentTurnout: totalCast
        });
    } catch (error) {
        next(error);
    }
};

const getElectionResults = async (req, res, next) => {
    try {
        const { electionId } = req.params;

        let election = await models.Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }

        // actualizam statusul înainte de orice logica
        election = await updateElectionStatus(election, models);

        if (!election.realTimeResults && election.status !== "closed") {
            return res.status(403).json({
                message: "Election has not ended yet and real-time results are not enabled"
            });
        }

        const existingResult = await models.Result.findOne({ where: { electionId } });
        let response;

        if (election.status === "closed" && existingResult) {
            response = await returnCachedResults(election, existingResult);
        } else {
            const now = new Date();
            const isElectionEnded = now > new Date(election.endDate);
            response = await calculateAndStoreResults(election, isElectionEnded && !existingResult);
        }

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export default {
    createElection,
    getAllElections,
    getElectionById,
    deleteElection,
    getDashboardStats,
    getTurnout,
    getElectionResults
};