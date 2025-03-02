import authController from "../controllers/authController.mjs";
import express from 'express'

const router = express.Router()

router.post('/login', authController.login)
router.post('/register', authController.register)

export default router;