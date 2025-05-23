import models from "../models/index.mjs";

const fetchUserData = async (req, res) => {
    try {
        const userId = req.user.id;
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

const checkEligibility = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { electionId } = req.params;

        if (!electionId) {
            return res.status(400).json({ message: "electionId is required" });
        }

        const registration = await models.VoterRegistration.findOne({
            where: {
                userId,
                electionId
            }
        });

        if (registration) {
            return res.json({ eligible: true });
        } else {
            return res.json({ eligible: false });
        }
    } catch (error) {
        console.error('checkEligibility error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default { fetchUserData, checkEligibility };
