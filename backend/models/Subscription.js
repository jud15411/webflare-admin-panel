import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  billingCycle: {
    type: String,
    enum: ['Monthly', 'Yearly'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Paused', 'Canceled'],
    default: 'Active',
  },
  nextPaymentDate: { type: Date },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;