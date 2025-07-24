import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

const proposalSchema = new mongoose.Schema({
  proposalNumber: { type: String, required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true },
  lineItems: [lineItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Declined'],
    default: 'Draft',
  },
  validUntil: { type: Date },
}, { timestamps: true });

const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;