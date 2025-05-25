import electionController from "../controllers/electionController.mjs";
import candidateController from "../controllers/candidateController.mjs";
import voterRegistrationController from "../controllers/voterRegistrationController.mjs";
import auth from "../middleware/authMiddleware.mjs";
import express from 'express'

const router = express.Router()

router.post('/create-election', auth, electionController.createElection)
router.get('/elections', auth, electionController.getAllElections)
router.get("/elections/:id", auth, electionController.getElectionById);
router.get('/dashboard-stats', auth, electionController.getDashboardStats);
router.get('/:electionId/turnout', electionController.getTurnout);

router.post('/set-candidates', auth, candidateController.createCandidates);

router.post('/set-whitelist', auth, voterRegistrationController.addWhitelist);
router.post('/set-whitelist-all',auth, voterRegistrationController.addAll)
router.post('/set-domain-whitelist', auth, voterRegistrationController.addDomainWhitelist);


router.delete('/:electionId/delete-election', auth,electionController.deleteElection);

export default router