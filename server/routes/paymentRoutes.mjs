import express from 'express';
import paymentController from '../controllers/paymentController.mjs';
import auth from "../middleware/authMiddleware.mjs";
const router = express.Router();

router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);
router.get('/verify-payment/:paymentIntentId',auth, paymentController.verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }),auth, paymentController.stripeWebhook);
router.post('/refund',auth, paymentController.refundPayment);

export default router;