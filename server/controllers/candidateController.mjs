import models from "../models/index.mjs";

const createCandidates = async (req, res, next) => {
  try {
    const { electionId, candidates } = req.body;

    if (!Array.isArray(candidates) || candidates.length < 2) {
      return res.status(400).json({
        message: "At least two candidates are required"
      });
    }

    const candidatePromises = candidates.map(candidateName =>
      models.Candidate.create({
        name: candidateName, 
        electionId,
        position: null, 
        description: null
      })
    );

    const createdCandidates = await Promise.all(candidatePromises);

    return res.status(201).json({
      message: "Candidates created successfully!",
      candidates: createdCandidates
    });
  } catch (error) {
    console.error("Error creating candidates:", error);
    next(error);
  }
};


  export default {
    createCandidates
  }
  