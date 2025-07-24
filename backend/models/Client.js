import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  status: {
    type: String,
    enum: ['Lead', 'Active', 'Inactive'],
    default: 'Lead',
  },
  // This links the client to the user who manages them
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;