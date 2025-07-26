import Service from '../models/Service.js';

// --- ADMIN CONTROLLERS (Protected) ---

// @desc    Get all services for the admin panel
// @route   GET /api/services
export const getServices = async (req, res) => {
    const services = await Service.find({});
    res.json(services);
};

// @desc    Create a new service
// @route   POST /api/services
export const createService = async (req, res) => {
    const { name, description, price, features, isActive } = req.body;
    const service = new Service({ name, description, price, features, isActive });
    const createdService = await service.save();
    res.status(201).json(createdService);
};

// @desc    Update a service
// @route   PUT /api/services/:id
export const updateService = async (req, res) => {
    const { name, description, price, features, isActive } = req.body;
    const service = await Service.findById(req.params.id);

    if (service) {
        service.name = name;
        service.description = description;
        service.price = price;
        service.features = features;
        service.isActive = isActive;
        const updatedService = await service.save();
        res.json(updatedService);
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
export const deleteService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (service) {
        await service.deleteOne();
        res.json({ message: 'Service removed' });
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
};


// --- PUBLIC CONTROLLER ---

// @desc    Get all *active* services for the public-facing website
// @route   GET /api/public/services
export const getPublicServices = async (req, res) => {
    const services = await Service.find({ isActive: true });
    res.json(services);
};