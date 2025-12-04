// src/app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/middleware/adminAuth';
import { getAllUsers, createUser, getUserStats } from '@/app/lib/services/userService';

/**
 * GET /api/admin/users - List all users
 */
export async function GET(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    // Get users and stats
    const [usersData, stats] = await Promise.all([
      getAllUsers({ search, page, limit, role, status }),
      getUserStats(),
    ]);

    return NextResponse.json({
      success: true,
      ...usersData,
      stats,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users - Create new user
 */
export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(body);

    return NextResponse.json({
      success: true,
      user,
      message: 'User created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
