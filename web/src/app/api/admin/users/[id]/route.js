// src/app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/middleware/adminAuth';
import { 
  getUserById, 
  updateUser, 
  deleteUser, 
  permanentDeleteUser,
  toggleUserStatus,
  resetUserPassword 
} from '@/app/lib/services/userService';

/**
 * GET /api/admin/users/[id] - Get user by ID
 */
export async function GET(request, { params }) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const user = await getUserById(id);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

/**
 * PUT /api/admin/users/[id] - Update user
 */
export async function PUT(request, { params }) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const user = await updateUser(id, body);

    return NextResponse.json({
      success: true,
      user,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id] - Delete user (soft delete)
 */
export async function DELETE(request, { params }) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';

    let result;
    if (permanent) {
      result = await permanentDeleteUser(id);
    } else {
      result = await deleteUser(id);
    }

    return NextResponse.json({
      success: true,
      message: permanent ? 'User permanently deleted' : 'User deactivated',
      user: result,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id] - Toggle user status or reset password
 */
export async function PATCH(request, { params }) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Toggle status
    if (body.action === 'toggle-status') {
      const user = await toggleUserStatus(id);
      return NextResponse.json({
        success: true,
        user,
        message: `User ${user.isActive ? 'activated' : 'suspended'}`,
      });
    }

    // Reset password
    if (body.action === 'reset-password') {
      if (!body.newPassword) {
        return NextResponse.json(
          { success: false, error: 'New password is required' },
          { status: 400 }
        );
      }

      await resetUserPassword(id, body.newPassword);
      return NextResponse.json({
        success: true,
        message: 'Password reset successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in PATCH operation:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
