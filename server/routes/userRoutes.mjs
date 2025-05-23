import express from 'express';
import userController from '../controllers/userController.mjs';
import auth from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get('/me', auth, userController.fetchUserData);

router.get('/check-eligibility/:electionId', auth, userController.checkEligibility);

export default router;
