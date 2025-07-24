import Stripe from 'stripe';
import Payout from '../models/Payout.js';

// We do NOT initialize Stripe here anymore.

// @desc    Request a new payout (by CEO or CTO)
export const requestPayout = async (req, res) => {
    // Initialize Stripe inside the function
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const { amount } = req.body;
        const payout = new Payout({ amount, requestedBy: req.user._id });

        if (req.user.role === 'ceo') {
            payout.status = 'Approved';
            payout.approvedBy = req.user._id;
        }

        await payout.save();
        res.status(201).json(payout);
    } catch (error) { res.status(400).json({ message: 'Payout request failed' }); }
};

// @desc    Approve a payout (CEO only) and send to Stripe
export const approveAndSendPayout = async (req, res) => {
    // Initialize Stripe inside the function
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const payout = await Payout.findById(req.params.id);
        if (!payout) return res.status(404).json({ message: 'Payout not found' });
        if (payout.status !== 'Pending Approval') return res.status(400).json({ message: 'Payout is not pending approval' });

        const transfer = await stripe.transfers.create({
            amount: payout.amount * 100,
            currency: 'usd',
            destination: 'default_for_currency',
        });

        payout.status = 'Sent';
        payout.approvedBy = req.user._id;
        payout.stripeTransferId = transfer.id;
        await payout.save();

        res.json(payout);
    } catch (error) {
        await Payout.findByIdAndUpdate(req.params.id, { status: 'Failed' });
        res.status(500).json({ message: 'Stripe transfer failed', error: error.message });
    }
};

// @desc    Get all payouts
export const getPayouts = async (req, res) => {
    // No Stripe needed here, so no change
    try {
        const payouts = await Payout.find({})
            .populate('requestedBy', 'name')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(payouts);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};