import electionController from "../controllers/electionController.mjs";
import candidateController from "../controllers/candidateController.mjs";
import voterRegistrationController from "../controllers/voterRegistrationController.mjs";
import voteController from '../controllers/voteController.mjs';
import auth from "../middleware/authMiddleware.mjs";
import express from 'express'

const router = express.Router()

router.post('/create-election', auth, electionController.createElection)
router.get('/elections', auth, electionController.getAllElections)
router.get("/elections/:id", auth, electionController.getElectionById);

router.post('/set-candidates', auth, candidateController.createCandidates);

router.post('/set-whitelist', auth, voterRegistrationController.addWhitelist);
router.post('/set-whitelist-all',auth, voterRegistrationController.addAll)

router.post('/:electionId/vote', voteController.castVote);
router.get('/:electionId/eligibility', voteController.checkEligibility);

router.delete('/:electionId/delete-election', electionController.deleteElection);

export default router