import mongoose from 'mongoose';

const businessSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'main_settings' },
  businessName: { type: String, default: 'Webflare Design Co.' },
  logoUrl: { type: String },
  // --- NEW FIELDS ---
  stripeSecretKey: { type: String },
  stripePublishableKey: { type: String },
  defaultInvoiceTerms: { type: String, default: 'Payment due within 30 days.' }
});

const BusinessSettings = mongoose.model('BusinessSettings', businessSettingsSchema);
export default BusinessSettings;