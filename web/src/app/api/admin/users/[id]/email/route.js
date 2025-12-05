// src/app/api/admin/users/[id]/email/route.js
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/middleware/adminAuth';
import { getUserById } from '@/app/lib/services/userService';

/**
 * POST /api/admin/users/[id]/email - Send email to user
 */
export async function POST(request, { params }) {
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

    // Validate required fields
    if (!body.subject || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await getUserById(id);

    // Send email using the notify API
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.email,
        subject: body.subject,
        message: body.message,
        isAiGenerated: false,
      }),
    });

    const emailData = await emailResponse.json();

    if (emailData.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: emailData.messageId,
        previewUrl: emailData.previewUrl,
      });
    } else {
      return NextResponse.json(
        { success: false, error: emailData.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
