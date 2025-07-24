import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'On Hold', 'Done'],
    default: 'To Do',
  },
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;