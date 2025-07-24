import TimeLog from '../models/TimeLog.js';
import mongoose from 'mongoose';

// @desc    Generate a payroll report for a given date range
// @route   GET /api/payroll
export const generatePayrollReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide a start and end date.' });
        }

        const payrollData = await TimeLog.aggregate([
            // 1. Filter logs within the date range
            {
                $match: {
                    date: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            // 2. Join with the users collection to get user details
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            // 3. Group by user to sum hours and get their details
            {
                $group: {
                    _id: '$user',
                    name: { $first: '$userDetails.name' },
                    hourlyRate: { $first: '$userDetails.hourlyRate' },
                    totalHours: { $sum: '$hours' }
                }
            },
            // 4. Calculate the total pay
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    name: { $arrayElemAt: ['$name', 0] }, // Unwind the array
                    hourlyRate: { $arrayElemAt: ['$hourlyRate', 0] },
                    totalHours: '$totalHours',
                    totalPay: { $multiply: ['$totalHours', { $arrayElemAt: ['$hourlyRate', 0] }] }
                }
            }
        ]);
        
        res.json(payrollData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};