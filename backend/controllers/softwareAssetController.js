import SoftwareAsset from '../models/SoftwareAsset.js';

export const getSoftwareAssets = async (req, res) => {
    try {
        const assets = await SoftwareAsset.find({}).sort({ renewalDate: 1 });
        res.json(assets);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

export const createSoftwareAsset = async (req, res) => {
    try {
        const asset = new SoftwareAsset({ ...req.body });
        const createdAsset = await asset.save();
        res.status(201).json(createdAsset);
    } catch (error) { res.status(400).json({ message: 'Invalid asset data' }); }
};

// @desc    Update a software asset
export const updateSoftwareAsset = async (req, res) => {
    try {
        const asset = await SoftwareAsset.findById(req.params.id);
        if (asset) {
            Object.assign(asset, req.body);
            const updatedAsset = await asset.save();
            res.json(updatedAsset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) { res.status(400).json({ message: 'Update failed' }); }
};

// @desc    Delete a software asset
export const deleteSoftwareAsset = async (req, res) => {
    try {
        const asset = await SoftwareAsset.findById(req.params.id);
        if (asset) {
            await asset.deleteOne();
            res.json({ message: 'Asset removed' });
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};