import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import timeLogRoutes from './routes/timeLogRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import softwareAssetRoutes from './routes/softwareAssetRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import businessSettingsRoutes from './routes/businessSettingsRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Middleware
app.use(cors()); // Allow requests from your Netlify frontend
app.use(express.json()); // To accept JSON data in the body

// Simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});




// TODO: Add your API routes here
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/software', softwareAssetRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', businessSettingsRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/stripe', stripeRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));