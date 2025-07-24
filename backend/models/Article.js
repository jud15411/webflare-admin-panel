import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Will store markdown content
  category: { type: String, required: true, default: 'General' },
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);
export default Article;