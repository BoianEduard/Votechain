import models from "../models/index.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saveImage = (imageData, candidateName) => {
  if (!imageData) return null;
  try {
    if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
      const matches = imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return null;

      const imageType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'candidates');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `candidate_${Date.now()}_${candidateName.replace(/\s+/g, '_')}.${imageType}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, imageBuffer);

      return `/uploads/candidates/${filename}`;
    }

    return null;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
};

const createCandidates = async (req, res, next) => {
  try {
    console.log("Creating candidates with data:", JSON.stringify(req.body, null, 2));
    const { electionId, candidates } = req.body;

    if (!Array.isArray(candidates) || candidates.length < 2) {
      return res.status(400).json({
        message: "At least two candidates are required"
      });
    }

    const candidateFields = Object.keys(models.Candidate.rawAttributes);
    console.log("Available candidate fields:", candidateFields);

    const candidatePromises = candidates.map(candidate => {
      let name, image;

      if (typeof candidate === 'object' && candidate !== null) {
        name = candidate.name;
        image = candidate.image;
      } else {
        name = candidate;
        image = null;
      }

      const imageUrl = image ? saveImage(image, name) : null;
      console.log(`Processing candidate: ${name}, imageUrl: ${imageUrl}`);

      const candidateData = {
        name: name,
        electionId: electionId,
        position: null,
        description: null
      };

      if (candidateFields.includes('imageUrl')) {
        candidateData.imageUrl = imageUrl;
      } else if (candidateFields.includes('image_url')) {
        candidateData.image_url = imageUrl;
      } else {
        console.warn("No imageUrl field found in candidate model!");
      }

      console.log("Creating candidate with data:", candidateData);
      return models.Candidate.create(candidateData);
    });

    const createdCandidates = await Promise.all(candidatePromises);
    console.log("Created candidates:", createdCandidates.map(c => c.toJSON()));

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
};