import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  client: {
    // --- THIS IS THE UPDATED LINE ---
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // This creates a reference to the Client model
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started',
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;