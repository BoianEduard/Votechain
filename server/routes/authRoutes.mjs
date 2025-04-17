import authController from "../controllers/authController.mjs";
import express from 'express'

const router = express.Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.logout);

export default router;