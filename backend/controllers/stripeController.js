import Stripe from 'stripe';
import Invoice from '../models/Invoice.js';

// Do NOT initialize Stripe here at the top level.
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe Checkout Session for an invoice
// @route   POST /api/stripe/create-checkout-session
export const createCheckoutSession = async (req, res) => {
    // Initialize Stripe INSIDE the function
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const { invoiceId } = req.body;
        const invoice = await Invoice.findById(invoiceId).populate('client');

        if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: invoice.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.description,
                    },
                    unit_amount: item.amount * 100, // Amount in cents
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/invoices`,
            customer_email: invoice.client.email,
            metadata: {
                invoice_id: invoice._id.toString(),
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};