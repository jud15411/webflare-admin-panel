import mongoose from 'mongoose';

const businessSettingsSchema = new mongoose.Schema({
  // A single, predictable ID for this document
  _id: { type: String, default: 'main_settings' },
  businessName: { type: String, default: 'Webflare Design Co.' },
  logoUrl: { type: String }, // Path to the uploaded logo
});

const BusinessSettings = mongoose.model('BusinessSettings', businessSettingsSchema);
export default BusinessSettings;