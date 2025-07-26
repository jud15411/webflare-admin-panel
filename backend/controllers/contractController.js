import Contract from '../models/Contract.js';
import fs from 'fs';
import Counter from '../models/Counter.js';

// A helper function to get the next sequence number
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // `new` returns the updated doc, `upsert` creates it if it doesn't exist
  );
  return sequenceDocument.sequence_value;
}

// @desc    Get all contracts
// @route   GET /api/contracts
export const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find({}).populate('client', 'name');
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Upload a new contract
export const createContract = async (req, res) => {
    // "title" is no longer needed from the request body
    const { client } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }
    
    try {
        const sequenceNumber = await getNextSequenceValue('contractId');
        // Format the title with leading zeros
        const title = `WB-C${sequenceNumber.toString().padStart(5, '0')}`;
        
        const fileUrl = `/uploads/${req.file.filename}`;

        const contract = new Contract({
            title, // Use the auto-generated title
            client,
            fileUrl,
        });
        const createdContract = await contract.save();
        res.status(201).json(createdContract);

    } catch (error) {
        res.status(400).json({ message: 'Invalid contract data', error: error.message });
    }
};

// @desc    Delete a contract
// @route   DELETE /api/contracts/:id
export const deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (contract) {
            // Construct the file path
            const __dirname = path.resolve();
            const filePath = path.join(__dirname, contract.fileUrl);

            // Delete the file from the 'uploads' folder
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete file from server:', err);
                    // Still proceed to delete from DB, but log the error
                }
            });

            await contract.deleteOne();
            res.json({ message: 'Contract removed successfully.' });
        } else {
            res.status(404).json({ message: 'Contract not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};