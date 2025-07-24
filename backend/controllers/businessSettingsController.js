import BusinessSettings from '../models/BusinessSettings.js';
import fs from 'fs';
import path from 'path';

// @desc    Get the business settings
export const getSettings = async (req, res) => {
    try {
        const settings = await BusinessSettings.findById('main_settings');
        if (settings) {
            res.json(settings);
        } else {
            // If no settings exist, create the default one
            const defaultSettings = await BusinessSettings.create({});
            res.json(defaultSettings);
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Update the business settings
export const updateSettings = async (req, res) => {
    try {
        const { businessName } = req.body;
        const updateData = { businessName };

        // If a new logo is uploaded, update the path
        if (req.file) {
            updateData.logoUrl = `/uploads/logos/${req.file.filename}`;
        }

        // Use findByIdAndUpdate with upsert:true to create the doc if it doesn't exist
        const updatedSettings = await BusinessSettings.findByIdAndUpdate(
            'main_settings',
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.json(updatedSettings);

    } catch (error) {
        console.error("Error updating business settings:", error);
        res.status(400).json({ message: 'Update failed' });
    }
};