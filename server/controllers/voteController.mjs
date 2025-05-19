import Election from '../models/Election.mjs';
import VoterRegistration from '../models/voterRegistration.mjs'; // numele modelului real
import { ethers } from 'ethers';


export const castVote = async (req, res) => {
    try {
        const { encryptedVote, signature, messageHash, voterAddress, timestamp } = req.body;
        const { electionId } = req.params;

        const election = await Election.findByPk(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        const now = new Date();
        if (now < new Date(election.start_date) || now > new Date(election.end_date)) {
            return res.status(403).json({ message: 'Election is not active' });
        }

        // Verificăm dacă utilizatorul este eligibil (înregistrat)
        const voter = await VoterRegistration.findOne({
            where: {
                electionId,
                userId: req.user.id // presupunem că ești autentificat și user.id este disponibil
            }
        });

        if (!voter) {
            return res.status(403).json({ message: 'You are not registered for this election' });
        }

        if (voter.status === 'voted') {
            return res.status(409).json({ message: 'You have already voted in this election' });
        }

        const recoveredAddress = ethers.utils.verifyMessage(
            ethers.utils.arrayify(messageHash),
            signature
        );

        if (recoveredAddress.toLowerCase() !== voterAddress.toLowerCase()) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        await Vote.create({
            electionId,
            encryptedVote,
            timestamp,
            messageHash,
            signature
        });

        await voter.update({ status: 'voted' });

        return res.status(201).json({
            message: 'Vote cast successfully',
            receipt: {
                electionId,
                voterAddress: voterAddress.toLowerCase(),
                timestamp,
                messageHash
            }
        });

    } catch (error) {
        console.error('Error casting vote:', error);
        return res.status(500).json({ message: error.message || 'Error processing vote' });
    }
};

/**
 * Check if a voter is eligible to vote
 */
export const checkEligibility = async (req, res) => {
    try {
        const { electionId } = req.params;
        const userId = req.user.id;

        const election = await Election.findByPk(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found' });

        const now = new Date();
        if (now < new Date(election.start_date)) {
            return res.status(403).json({
                message: 'Election has not started yet',
                isEligible: false,
                hasVoted: false,
                electionStatus: 'pending'
            });
        }

        if (now > new Date(election.end_date)) {
            return res.status(403).json({
                message: 'Election has ended',
                isEligible: false,
                hasVoted: false,
                electionStatus: 'ended'
            });
        }

        const voter = await VoterRegistration.findOne({
            where: { electionId, userId }
        });

        if (!voter) {
            return res.status(200).json({
                isEligible: false,
                hasVoted: false,
                message: 'You are not registered to vote in this election',
                electionStatus: 'active'
            });
        }

        return res.status(200).json({
            isEligible: true,
            hasVoted: voter.status === 'voted',
            electionStatus: 'active',
            message: voter.status === 'voted'
                ? 'You have already voted in this election'
                : 'You are eligible to vote'
        });

    } catch (error) {
        console.error('Error checking eligibility:', error);
        return res.status(500).json({ message: error.message || 'Error checking eligibility' });
    }
};

export default {
    castVote,
    checkEligibility
};