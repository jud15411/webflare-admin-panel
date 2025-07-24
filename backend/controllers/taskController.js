import Task from '../models/Task.js';

// Get tasks - developers see their own, CEO/CTO see all for a project
export const getTasks = async (req, res) => {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.user.role === 'developer' || req.user.role === 'sales') {
        filter.assignedTo = req.user._id;
    }
    try {
        const tasks = await Task.find(filter).populate('assignedTo', 'name').populate('project', 'name');
        res.json(tasks);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// Create a task
export const createTask = async (req, res) => {
    // Developers can only create sub-tasks for tasks assigned to them
    if (req.user.role === 'developer' && req.body.parentTask) {
        const parent = await Task.findById(req.body.parentTask);
        if (parent.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add sub-task to this task' });
        }
    } else if (req.user.role === 'developer' && !req.body.parentTask) {
         return res.status(403).json({ message: 'Not authorized to create top-level tasks' });
    }

    try {
        const task = new Task({ ...req.body });
        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) { res.status(400).json({ message: 'Invalid task data' }); }
};

// Update a task's status
export const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Enforce workflow rules
        if (req.user.role === 'developer' && status === 'Done') {
            return res.status(403).json({ message: 'Only CEO or CTO can mark tasks as Done.' });
        }

        task.status = status;
        await task.save();
        res.json(task);
    } catch (error) { res.status(400).json({ message: 'Update failed' }); }
};

// @desc    Update a task's details (title, description, etc.)
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Prevent developers from re-assigning tasks or changing the project
        if (req.user.role === 'developer') {
            if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo.toString()) {
                return res.status(403).json({ message: 'You cannot re-assign tasks.' });
            }
            if (req.body.project && req.body.project !== task.project.toString()) {
                return res.status(403).json({ message: 'You cannot change the project.' });
            }
        }
        
        Object.assign(task, req.body);
        const updatedTask = await task.save();
        res.json(updatedTask);

    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};