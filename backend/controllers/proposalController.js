import Proposal from '../models/Proposal.js';
import Counter from '../models/Counter.js'; // Import the counter model

// Helper function to get the next sequence number
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}

// @desc    Get all proposals
export const getProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({}).populate('client', 'name').sort({ createdAt: -1 });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new proposal
export const createProposal = async (req, res) => {
    try {
        const sequenceNumber = await getNextSequenceValue('proposalId');
        const proposalNumber = `PROP-${sequenceNumber.toString().padStart(5, '0')}`;
        
        const newProposal = { ...req.body, proposalNumber };
        const proposal = new Proposal(newProposal);
        
        const createdProposal = await proposal.save();
        res.status(201).json(createdProposal);
    } catch (error) {
        res.status(400).json({ message: 'Invalid proposal data', error: error.message });
    }
};

// @desc    Update a proposal
export const updateProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
        if (proposal) {
            Object.assign(proposal, req.body);
            const updatedProposal = await proposal.save();
            res.json(updatedProposal);
        } else {
            res.status(404).json({ message: 'Proposal not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Delete a proposal
export const deleteProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);
        if (proposal) {
            await proposal.remove();
            res.json({ message: 'Proposal removed' });
        } else {
            res.status(404).json({ message: 'Proposal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};