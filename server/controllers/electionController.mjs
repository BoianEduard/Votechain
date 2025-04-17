import models from "../models/index.mjs";

const createElection = async(req, res, next) => {
    try {
        const election = await models.Election.create({
            ...req.body
        });

        return res.status(201).json({
            message: "Election created successfully!",
            id: election.id,
            ...election.toJSON()
        });
    } catch(error) {
        console.log(error)
        res.status(500).json({error: error})
    }
};

const getAllElections = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        console.log(userId);
        const elections = await models.Election.findAll({
            include: [
                {
                    model: models.VoterRegistration,
                    where: { userId: userId },
                    required: true,
                },
                {
                    model: models.Candidate,
                    as: 'candidates',
                }
            ]
        });

        return res.status(200).json(elections);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    createElection,
    getAllElections
}