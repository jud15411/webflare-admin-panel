import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  fileUrl: { type: String, required: true }, // URL to the uploaded file
  status: { 
    type: String,
    enum: ['Active', 'Terminated'],
    default: 'Active',
  },
}, { timestamps: true });

const Contract = mongoose.model('Contract', contractSchema);
export default Contract;