import models from "../models/index.mjs";

const fetchUserData = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await models.user.findByPk(userId, {
            attributes: ['id', 'email', 'firstName', 'lastName', 'publicKey', 'address']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('fetchUserData error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const checkEligibility = async (req, res) => {
    try {
        const { electionId } = req.params;
        const userId = req.user.userId;

        const election = await models.Election.findByPk(electionId);
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

        const voter = await models.VoterRegistration.findOne({
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


export default { fetchUserData, checkEligibility };
