import mongoose from 'mongoose';

const softwareAssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  renewalDate: { type: Date },
  cost: { type: Number, required: true },
  licenseKey: { type: String },
}, { timestamps: true });

const SoftwareAsset = mongoose.model('SoftwareAsset', softwareAssetSchema);
export default SoftwareAsset;