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



export default {
    createElection
}