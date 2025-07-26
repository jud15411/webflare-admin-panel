import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true }, // Using String to allow for flexible pricing like "$500/mo" or "Starting at $2,500"
    features: [{ type: String }], // A list of features for the service
    isActive: { type: Boolean, default: true } // A toggle to show/hide the service on the public site
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;