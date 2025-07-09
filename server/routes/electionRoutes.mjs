import electionController from "../controllers/electionController.mjs";
import candidateController from "../controllers/candidateController.mjs";
import voterRegistrationController from "../controllers/voterRegistrationController.mjs";
import auth from "../middleware/authMiddleware.mjs";
import express from 'express'
import contractController from "../controllers/contractController.mjs";

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
router.post('/check-whitelist-count', auth, voterRegistrationController.checkWhitelistCount);
router.post('/check-domain-count', auth, voterRegistrationController.checkDomainWhitelistCount);
router.get('/check-all-count', auth, voterRegistrationController.checkAllUsersCount);

router.delete('/:electionId/delete-election', auth,electionController.deleteElection);

router.get("/:electionId/results", auth, electionController.getElectionResults);

export default router