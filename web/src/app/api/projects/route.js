import { NextResponse } from 'next/server';
import connectDB from '../../lib/utils/database';
import Project from '../../lib/models/Projects';
import { verifyUser } from '../../lib/middleware/adminAuth';

export async function GET(request) {
  try {
    const { isAuthenticated, user, error } = await verifyUser(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: error || 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const items = await Project.find({ user: user._id }).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, projects: items });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { isAuthenticated, user, error } = await verifyUser(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: error || 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const name = (body?.name || '').trim();
    const type = body?.type || 'general';
    if (!name) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 });
    await connectDB();
    const item = await Project.create({ name, type, user: user._id });
    return NextResponse.json({ success: true, project: item });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { isAuthenticated, user, error } = await verifyUser(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: error || 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    await connectDB();
    const res = await Project.deleteOne({ _id: id, user: user._id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
