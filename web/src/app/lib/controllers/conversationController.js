import Conversation from '../models/Conversations';
import connectDB from '../utils/database';
import jwt from 'jsonwebtoken';

function generateTitleFromMessages(messages) {
  if (!messages || messages.length === 0) return `Chat ${new Date().toLocaleString()}`;

  // Try to pick the first user message as title
  const firstUserMessage = messages.find((m) => (m.role === 'user' || !m.role));
  const raw = (firstUserMessage && firstUserMessage.content) || messages[0].content || '';
  // Keep first 6 words
  const words = raw.trim().split(/\s+/).slice(0, 6).join(' ').replace(/[^\w\s?!,.-]/g, '');
  return words.length ? `${words}${raw.length > words.length ? '...' : ''}` : `Chat ${new Date().toLocaleDateString()}`;
}

async function generateTitleWithAI(messages) {
  try {
    const firstUserMessage = messages.find((m) => (m.role === 'user' || !m.role));
    const query = (firstUserMessage && firstUserMessage.content) || messages[0]?.content || '';
    
    if (!query) return generateTitleFromMessages(messages);

    const AI_URL = process.env.AI_URL || 'http://localhost:8000';
    const response = await fetch(`${AI_URL}/namechat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && (data.name || data.title)) {
        return data.name || data.title;
      }
    }
    
    // Fallback to simple title generation
    return generateTitleFromMessages(messages);
  } catch (error) {
    console.error('Failed to generate AI title, using fallback:', error);
    return generateTitleFromMessages(messages);
  }
}

export async function saveConversation({ messages = [], userId = null, title = null, tags } = {}) {
  await connectDB();

  try {
    const generatedTitle = title || await generateTitleWithAI(messages);
    const conversation = new Conversation({ user: userId, title: generatedTitle, messages, tags });
    await conversation.save();
    return { success: true, conversation };
  } catch (error) {
    console.error('Error saving conversation:', error.message || error);
    throw new Error('Failed to save conversation');
  }
}

export async function listConversations(userId = null, limit = 20, skip = 0) {
  await connectDB();
  const filter = { isActive: true };
  if (userId) filter.user = userId;
  // Include user so frontend can mark which conversations belong to the current user
  const conversations = await Conversation.find(filter).sort({ updatedAt: -1 }).limit(limit).skip(skip).select('title messages createdAt updatedAt user');
  return conversations;
}

export async function getConversationById(id) {
  await connectDB();
  return await Conversation.findById(id);
}

export async function appendMessagesToConversation(id, messages = [], userId = null) {
  await connectDB();
  const conversation = await Conversation.findById(id);
  if (!conversation) throw new Error('Conversation not found');
  // If conversation has an owner, verify the userId
  if (conversation.user) {
    if (!userId) throw new Error('Unauthorized to append messages');
    if (conversation.user.toString() !== userId.toString()) throw new Error('Unauthorized to append messages');
  }
  const normalized = messages.map((m) => ({ role: m.role || (m.sender === 'bot' ? 'assistant' : 'user'), content: m.content || m.text || '' }));
  conversation.messages = conversation.messages.concat(normalized);
  await conversation.save();
  return conversation;
}

export async function deleteConversationById(id, userId = null) {
  await connectDB();
  const conversation = await Conversation.findById(id);
  if (!conversation) throw new Error('Conversation not found');

  // If the conversation has an owner, ensure provided userId matches
  if (conversation.user) {
    if (!userId) {
      throw new Error('Unauthorized to delete this conversation');
    }
    if (conversation.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized to delete this conversation');
    }
  }

  // Soft delete
  conversation.isActive = false;
  await conversation.save();
  return conversation;
}

// Helper to get userId from an Authorization header, returns null if invalid
export function getUserIdFromAuthHeader(authHeaderOrCookieHeader) {
  if (!authHeaderOrCookieHeader) return null;
  let token = null;
  const authHeader = String(authHeaderOrCookieHeader);
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (authHeader.includes('token=')) {
    // cookie header format: "token=abc; other=..."
    const match = authHeader.match(/(?:^|; )token=([^;]+)/);
    if (match) token = match[1];
  } else {
    token = authHeader;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.userId || null;
  } catch (e) {
    return null;
  }
}
