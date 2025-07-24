import Subscription from '../models/Subscription.js';

// @desc    Get all subscriptions
export const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({}).populate('client', 'name').sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new subscription
export const createSubscription = async (req, res) => {
    try {
        const subscription = new Subscription({ ...req.body });
        const createdSubscription = await subscription.save();
        res.status(201).json(createdSubscription);
    } catch (error) {
        res.status(400).json({ message: 'Invalid subscription data', error: error.message });
    }
};

// @desc    Update a subscription
export const updateSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (subscription) {
            Object.assign(subscription, req.body);
            const updatedSubscription = await subscription.save();
            res.json(updatedSubscription);
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    } catch (error) { res.status(400).json({ message: 'Update failed' }); }
};

// @desc    Delete a subscription
export const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (subscription) {
            await subscription.remove();
            res.json({ message: 'Subscription removed' });
        } else {
            res.status(404).json({ message: 'Subscription not found' });
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};