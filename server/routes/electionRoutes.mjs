import electionController from "../controllers/electionController.mjs";
import candidateController from "../controllers/candidateController.mjs";
import voterRegistrationController from "../controllers/voterRegistrationController.mjs";
import express from 'express'

const router = express.Router()

router.post('/create-election', electionController.createElection)


router.post('/set-candidates', candidateController.createCandidates);


router.post('/set-whitelist', voterRegistrationController.addWhitelist);

router.post('/set-whitelist-all', voterRegistrationController.addAll)


export default router