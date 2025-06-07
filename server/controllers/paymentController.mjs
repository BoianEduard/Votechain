//TODO dummy first version
// IN PROGRESS, will be moved to another branch

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10'
});

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata = {} } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({
                error: 'Invalid amount. Minimum charge is $0.50' // failsafe
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString()
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({
            error: error.message || 'Failed to create payment intent'
        });
    }
};

/**
 * Verify status of a payment
 */
const verifyPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            metadata: paymentIntent.metadata
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            error: 'Failed to verify payment'
        });
    }
};

/**
 * Handle Stripe Webhooks
 */
const stripeWebhook = (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            // Optional: Trigger post-payment logic
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};

/**
 * Process a refund
 */
const refundPayment = async (req, res) => {
    try {
        const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount,
            reason
        });

        res.json({
            refundId: refund.id,
            status: refund.status,
            amount: refund.amount
        });

    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({
            error: 'Failed to process refund'
        });
    }
};

export default {createPaymentIntent, verifyPayment, stripeWebhook, refundPayment}