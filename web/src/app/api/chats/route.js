import { NextResponse } from 'next/server';
import { saveConversation, listConversations, getUserIdFromAuthHeader } from '../../lib/controllers/conversationController';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const skip = parseInt(url.searchParams.get('skip') || '0', 10);

    // Get userId from auth header if provided
    const authHeader = request.headers.get('authorization') || request.headers.get('cookie') || '';
    const userId = getUserIdFromAuthHeader(authHeader);

    const conversations = await listConversations(userId, limit, skip);
    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error('GET /api/chats error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization') || request.headers.get('cookie') || '';
    const userIdFromToken = getUserIdFromAuthHeader(authHeader);
    const userId = body.userId || userIdFromToken || null;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const result = await saveConversation({ messages, userId, title: body.title, tags: body.tags });
    return NextResponse.json({ success: true, conversation: result.conversation });
  } catch (error) {
    console.error('POST /api/chats error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
