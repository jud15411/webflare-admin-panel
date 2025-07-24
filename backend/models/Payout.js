import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Sent', 'Failed'],
    default: 'Pending Approval',
  },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stripeTransferId: { type: String }, // To store the ID from Stripe after sending
}, { timestamps: true });

const Payout = mongoose.model('Payout', payoutSchema);
export default Payout;