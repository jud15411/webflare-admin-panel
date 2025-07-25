import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password'); // Exclude passwords from the result
    res.json(users);
};

// @desc    Create a new user
// @route   POST /api/users
export const createUser = async (req, res) => {
    const { name, email, password, role, hourlyRate } = req.body;

    // --- Business Logic: Check for unique CEO/CTO ---
    if (role === 'ceo' || role === 'cto') {
        const roleExists = await User.findOne({ role });
        if (roleExists) {
            return res.status(400).json({ message: `A ${role.toUpperCase()} already exists.` });
        }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role, hourlyRate });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, hourlyRate: user.hourlyRate });
};

// @desc    Update a user's role
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
    const { role, hourlyRate } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // --- Business Logic: Check for unique CEO/CTO ---
    if (role === 'ceo' || role === 'cto') {
        const roleExists = await User.findOne({ role });
        // Allow update if the user already has that role or if no one else has it
        if (roleExists && roleExists._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: `A ${role.toUpperCase()} already exists.` });
        }
    }

    user.role = role || user.role;
    user.hourlyRate = hourlyRate !== undefined ? hourlyRate : user.hourlyRate;
    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, hourlyRate: updatedUser.hourlyRate });
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // --- Business Logic: Prevent CEO deletion ---
    if (user.role === 'ceo') {
        return res.status(400).json({ message: 'Cannot delete the CEO account.' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully.' });
};

// @route   POST /api/users/verify-password
export const verifyPassword = async (req, res) => {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({ message: 'Password verified successfully' });
    } else {
        res.status(401).json({ message: 'Invalid password' });
    }
};

// @desc    Transfer CEO ownership to another user
// @route   PUT /api/users/transfer-ownership
export const transferOwnership = async (req, res) => {
    const { newCeoId } = req.body;
    const currentCeo = await User.findById(req.user.id);
    const newCeo = await User.findById(newCeoId);

    if (!newCeo) {
        return res.status(404).json({ message: 'New CEO user not found.' });
    }

    // Demote current CEO to developer
    currentCeo.role = 'developer';
    await currentCeo.save();

    // Promote new user to CEO
    newCeo.role = 'ceo';
    await newCeo.save();

    res.status(200).json({ message: 'Ownership transferred successfully.' });
};

// @desc    Wipe a specific user's data (anonymize and delete)
// @route   DELETE /api/users/:id/wipe-data
export const wipeUserData = async (req, res) => {
    const userIdToDelete = req.params.id;
    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
        return res.status(404).json({ message: 'User not found.' });
    }
    if (userToDelete.role === 'ceo') {
        return res.status(400).json({ message: 'Cannot wipe the CEO account.' });
    }
    try {
        await TimeLog.updateMany({ user: userIdToDelete }, { $set: { user: null } });
        await Project.updateMany({ managedBy: userIdToDelete }, { $set: { managedBy: null } });
        await userToDelete.deleteOne();
        res.status(200).json({ message: `Data for user ${userToDelete.name} has been wiped.` });
    } catch (error) {
        res.status(500).json({ message: 'User data wipe failed.', error: error.message });
    }
};