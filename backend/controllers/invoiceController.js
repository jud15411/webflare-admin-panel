import Invoice from '../models/Invoice.js';
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

// @desc    Get all invoices
export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({}).populate('client', 'name').sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// @desc    Create a new invoice
export const createInvoice = async (req, res) => {
    try {
        const sequenceNumber = await getNextSequenceValue('invoiceId');
        const invoiceNumber = `INV-${sequenceNumber.toString().padStart(5, '0')}`;
        
        const newInvoice = new Invoice({ ...req.body, invoiceNumber });
        const createdInvoice = await newInvoice.save();
        res.status(201).json(createdInvoice);
    } catch (error) { res.status(400).json({ message: 'Invalid invoice data' }); }
};

// @desc    Update an invoice
export const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            Object.assign(invoice, req.body);
            const updatedInvoice = await invoice.save();
            res.json(updatedInvoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) { res.status(400).json({ message: 'Update failed' }); }
};

// @desc    Delete an invoice
export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            await invoice.deleteOne();
            res.json({ message: 'Invoice removed' });
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};