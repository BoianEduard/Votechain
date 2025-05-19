import contractController from "../controllers/contractController.mjs";
import auth from "../middleware/authMiddleware.mjs";
import express from 'express';

const router = express.Router();

router.post('/deploy', auth, contractController.deployElectionContract);

export default router;