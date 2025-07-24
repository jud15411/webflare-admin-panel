import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Invoice from '../models/Invoice.js';
import Contract from '../models/Contract.js';
// Import any other related models like Proposal, Subscription, etc.
import fs from 'fs';
import path from 'path';

// @desc    Get all clients
// @route   GET /api/clients
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find({}).populate('managedBy', 'name');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new client
// @route   POST /api/clients
export const createClient = async (req, res) => {
    const { name, contactPerson, email, phone, status } = req.body;
    try {
        const client = new Client({
            name,
            contactPerson,
            email,
            phone,
            status,
            managedBy: req.user._id, // Assign the logged-in user
        });
        const createdClient = await client.save();
        res.status(201).json(createdClient);
    } catch (error) {
        res.status(400).json({ message: 'Invalid client data', error: error.message });
    }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
export const updateClient = async (req, res) => {
    const { name, contactPerson, email, phone, status } = req.body;
    try {
        const client = await Client.findById(req.params.id);
        if (client) {
            client.name = name || client.name;
            client.contactPerson = contactPerson || client.contactPerson;
            client.email = email || client.email;
            client.phone = phone || client.phone;
            client.status = status || client.status;
            const updatedClient = await client.save();
            res.json(updatedClient);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

// @desc    Delete a client and all associated data
// @route   DELETE /api/clients/:id
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        const clientId = req.params.id;

        if (client) {
            // 1. Find all associated contracts to delete their files
            const contractsToDelete = await Contract.find({ client: clientId });
            for (const contract of contractsToDelete) {
                const __dirname = path.resolve();
                const filePath = path.join(__dirname, contract.fileUrl);
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Failed to delete file ${filePath}:`, err);
                });
            }

            // 2. Mark Invoices and Contracts as 'Terminated'
            await Invoice.updateMany({ client: clientId }, { $set: { status: 'Terminated' } });
            await Contract.updateMany({ client: clientId }, { $set: { status: 'Terminated' } });
            // You would add similar updateMany calls for Proposals, Subscriptions, etc.

            // 3. Delete all associated Projects
            await Project.deleteMany({ client: clientId });
            // Note: You might also want to delete TimeLogs associated with these projects

            // 4. Finally, delete the client itself
            await client.remove();

            res.json({ message: 'Client and all associated data have been handled.' });
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};