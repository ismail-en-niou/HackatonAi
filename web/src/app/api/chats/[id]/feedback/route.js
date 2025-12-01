import { NextResponse } from 'next/server';
import { getUserIdFromAuthHeader } from '../../../../lib/controllers/conversationController';
import Conversation from '../../../../lib/models/Conversations';
import connectDB from '../../../../lib/utils/database';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { messageIndex, liked } = body;

    if (typeof messageIndex !== 'number') {
      return NextResponse.json({ success: false, error: 'messageIndex is required' }, { status: 400 });
    }

    await connectDB();
    const conversation = await Conversation.findById(id);
    
    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    // Verify authorization if conversation has an owner
    const authHeader = request.headers.get('authorization') || request.headers.get('cookie') || '';
    const userId = getUserIdFromAuthHeader(authHeader);
    
    if (conversation.user && conversation.user.toString() !== userId?.toString()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Update the liked field for the specific message
    if (messageIndex >= 0 && messageIndex < conversation.messages.length) {
      conversation.messages[messageIndex].liked = liked ?? null;
      await conversation.save();
      return NextResponse.json({ success: true, conversation });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid message index' }, { status: 400 });
    }
  } catch (error) {
    console.error('PATCH /api/chats/:id/feedback error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
