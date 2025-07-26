import TimeLog from '../models/TimeLog.js';

// @desc    Create a new time log entry
// @route   POST /api/timelogs
export const createTimeLog = async (req, res) => {
    const { project, hours, date, description } = req.body;
    try {
        const timeLog = new TimeLog({
            user: req.user._id, // The user ID comes from the 'protect' middleware
            project,
            hours,
            date,
            description,
        });
        const createdLog = await timeLog.save();
        res.status(201).json(createdLog);
    } catch (error) {
        res.status(400).json({ message: 'Invalid time log data', error: error.message });
    }
};

// @desc    Get time logs for the logged-in user
// @route   GET /api/timelogs/mylogs
export const getMyTimeLogs = async (req, res) => {
    try {
        const logs = await TimeLog.find({ user: req.user._id })
            .populate('project', 'name')
            .sort({ date: -1 }); // Show most recent first
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Get all time logs (for admins), with optional date filtering
// @route   GET /api/timelogs
export const getAllTimeLogs = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const filter = {};

        // If startDate and endDate are provided, add them to the filter
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const logs = await TimeLog.find(filter) // Apply the filter here
            .populate('user', 'name')
            .populate('project', 'name')
            .sort({ date: -1 });
            
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteTimeLog = async (req, res) => {
    try {
        const timeLog = await TimeLog.findById(req.params.id);

        if (timeLog) {
            await timeLog.deleteOne(); // <-- This is the corrected line
            res.json({ message: 'Time log removed' });
        } else {
            res.status(404).json({ message: 'Time log not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};