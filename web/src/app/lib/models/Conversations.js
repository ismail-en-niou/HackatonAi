import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], default: 'user' },
  content: { type: String, required: true },
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, default: '' },
  messages: { type: [messageSchema], default: [] },
  tags: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
