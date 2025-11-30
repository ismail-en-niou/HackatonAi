import { NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/app/lib/controllers/authController';
import { getUserIdFromAuthHeader } from '@/app/lib/controllers/conversationController';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('cookie') || '';
    const userId = getUserIdFromAuthHeader(authHeader);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const result = await getUserProfile(userId);
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/auth/profile', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('cookie') || '';
    const userId = getUserIdFromAuthHeader(authHeader);
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const result = await updateUserProfile(userId, body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('PUT /api/auth/profile', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
