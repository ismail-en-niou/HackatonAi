import { NextResponse } from 'next/server';
import { getConversationById, appendMessagesToConversation, deleteConversationById, getUserIdFromAuthHeader } from '../../../lib/controllers/conversationController';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const conversation = await getConversationById(id);
    if (!conversation || conversation.isActive === false) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    console.error('GET /api/chats/:id error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) {
      return NextResponse.json({ success: false, error: 'messages array is required' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization') || request.headers.get('cookie') || '';
    const userId = getUserIdFromAuthHeader(authHeader);
    const updated = await appendMessagesToConversation(id, messages, userId);
    return NextResponse.json({ success: true, conversation: updated });
  } catch (error) {
    console.error('PATCH /api/chats/:id error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization') || request.headers.get('cookie') || '';
    const userId = getUserIdFromAuthHeader(authHeader);
    const deleted = await deleteConversationById(id, userId);
    return NextResponse.json({ success: true, conversation: deleted });
  } catch (error) {
    console.error('DELETE /api/chats/:id error', error);
    const status = String(error.message).toLowerCase().includes('unauthorized') ? 401 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
