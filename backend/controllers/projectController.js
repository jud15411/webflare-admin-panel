import Project from '../models/Project.js'; // You'll need to create this model

// @desc    Get all projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
    const projects = await Project.find({}).populate('client', 'name'); // In a real app, you might filter by user
    res.json(projects);
};

// @desc    Create a project
// @route   POST /api/projects
export const createProject = async (req, res) => {
    const { name, client, description } = req.body;
    const project = new Project({ name, client, description, status: 'Not Started' });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
};

// @desc    Update a project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
    const { name, client, description, status } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
        project.name = name || project.name;
        project.client = client || project.client;
        project.description = description || project.description;
        project.status = status || project.status;
        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).send('Project not found');
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project) {
        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } else {
        res.status(404).send('Project not found');
    }
};