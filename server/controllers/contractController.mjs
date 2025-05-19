import models from "../models/index.mjs";
import {deployContract} from "../deploy/deploy.mjs";

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
            attributes: ['id', 'publicKey']
        });

        const eligibleVoters = users.map(user => ({
            publicKey: user.publicKey,
        }));

        console.log("Eligible Voters:", eligibleVoters);

        const contractAddress = await deployContract({ eligibleVoters });
        console.log("Contract address:", contractAddress);

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

export default {
    deployElectionContract
}