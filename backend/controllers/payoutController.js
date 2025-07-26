import Stripe from 'stripe';
import Payout from '../models/Payout.js';
import BusinessSettings from '../models/BusinessSettings.js'; // <-- Import settings model

// @desc    Request a new payout (by any user)
export const requestPayout = async (req, res) => {
    try {
        const { amount, description } = req.body;
        // Basic validation
        if (!amount || !description) {
            return res.status(400).json({ message: 'Amount and description are required.' });
        }
        
        const payout = new Payout({ 
            amount, 
            description, 
            requestedBy: req.user._id 
        });

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
    try {
        // --- NEW: Fetch settings from DB ---
        const settings = await BusinessSettings.findById('main_settings');
        if (!settings || !settings.stripeSecretKey) {
            return res.status(500).json({ message: 'Stripe is not configured. Please add API keys in settings.' });
        }
        
        // Initialize Stripe with the key from the database
        const stripe = new Stripe(settings.stripeSecretKey);
        
        const payout = await Payout.findById(req.params.id);
        if (!payout) return res.status(404).json({ message: 'Payout not found' });
        if (payout.status !== 'Pending Approval') return res.status(400).json({ message: 'Payout is not pending approval' });

        // NOTE: For a real application, you need to configure Transfer Recipients (Connected Accounts) in Stripe.
        // This example assumes a default setup. You would replace 'default_for_currency'
        // with the actual Stripe Account ID of the destination.
        const transfer = await stripe.transfers.create({
            amount: payout.amount * 100, // Amount in cents
            currency: 'usd',
            destination: 'default_for_currency', 
        });

        payout.status = 'Sent';
        payout.approvedBy = req.user._id;
        payout.stripeTransferId = transfer.id;
        await payout.save();

        res.json(payout);
    } catch (error) {
        // If the Stripe transfer fails, mark the payout as 'Failed'
        await Payout.findByIdAndUpdate(req.params.id, { status: 'Failed' });
        res.status(500).json({ message: 'Stripe transfer failed', error: error.message });
    }
};

// @desc    Get all payouts
export const getPayouts = async (req, res) => {
    try {
        const payouts = await Payout.find({})
            .populate('requestedBy', 'name')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(payouts);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};