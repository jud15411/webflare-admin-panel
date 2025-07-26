import BusinessSettings from '../models/BusinessSettings.js';
import fs from 'fs';
import path from 'path';
import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Contract from '../models/Contract.js';
import TimeLog from '../models/TimeLog.js';
import Proposal from '../models/Proposal.js';
import Expense from '../models/Expense.js'
import Task from '../models/Task.js'
import Subscription from '../models/subscription.js'

// @desc    Get the business settings
export const getSettings = async (req, res) => {
    try {
        const settings = await BusinessSettings.findById('main_settings').select('-stripeSecretKey'); // <-- Hide secret key from regular GET requests
        if (settings) {
            res.json(settings);
        } else {
            const defaultSettings = await BusinessSettings.create({});
            res.json(defaultSettings);
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Update the business settings
export const updateSettings = async (req, res) => {
    try {
        const { businessName, stripeSecretKey, stripePublishableKey, defaultInvoiceTerms } = req.body;
        
        // --- UPDATED LOGIC ---
        // Build the update object dynamically
        const updateData = {};
        if (businessName) updateData.businessName = businessName;
        if (stripeSecretKey) updateData.stripeSecretKey = stripeSecretKey;
        if (stripePublishableKey) updateData.stripePublishableKey = stripePublishableKey;
        if (defaultInvoiceTerms) updateData.defaultInvoiceTerms = defaultInvoiceTerms;

        if (req.file) {
            updateData.logoUrl = `/uploads/logos/${req.file.filename}`;
        }

        const updatedSettings = await BusinessSettings.findByIdAndUpdate(
            'main_settings',
            { $set: updateData },
            { new: true, upsert: true }
        );

        // Don't send the secret key back in the response
        const responseSettings = updatedSettings.toObject();
        delete responseSettings.stripeSecretKey;

        res.json(responseSettings);

    } catch (error) {
        console.error("Error updating business settings:", error);
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Wipe all transactional data from the database
// @route   DELETE /api/settings/wipe-all-data
export const wipeAllData = async (req, res) => {
    try {
        // A list of models to wipe
        const modelsToWipe = [
            Invoice, Project, Client, Contract, TimeLog, Proposal, Expense, Task, Subscription
        ];
        
        for (const model of modelsToWipe) {
            await model.deleteMany({});
        }

        res.status(200).json({ message: 'All transactional data has been wiped successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Data wipe failed.', error: error.message });
    }
};