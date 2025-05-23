import authController from "../controllers/authController.mjs";
import express from 'express'

const router = express.Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.logout);
router.post('/check-email', authController.checkEmail);
router.get('/verify', authController.verifyAuth);


export default router;