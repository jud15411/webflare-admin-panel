import Stripe from 'stripe';
import Invoice from '../models/Invoice.js';
import BusinessSettings from '../models/BusinessSettings.js'; // <-- Import settings model

// @desc    Create a Stripe Checkout Session for an invoice
export const createCheckoutSession = async (req, res) => {
    try {
        // --- NEW: Fetch settings from DB ---
        const settings = await BusinessSettings.findById('main_settings');
        if (!settings || !settings.stripeSecretKey) {
            return res.status(500).json({ message: 'Stripe is not configured. Please add API keys in settings.' });
        }
        
        // Initialize Stripe with the key from the database
        const stripe = new Stripe(settings.stripeSecretKey);

        const { invoiceId } = req.body;
        const invoice = await Invoice.findById(invoiceId).populate('client');

        if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
        
        // ... The rest of the function remains the same ...
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: invoice.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: { name: item.description },
                    unit_amount: item.amount * 100,
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/invoices`,
            customer_email: invoice.client.email,
            metadata: { invoice_id: invoice._id.toString() }
        });

        res.json({ id: session.id, url: session.url });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};