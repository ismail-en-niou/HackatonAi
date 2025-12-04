// src/app/api/admin/emails/broadcast/route.js
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/middleware/adminAuth';
import { getAllUsers } from '@/app/lib/services/userService';

/**
 * POST /api/admin/emails/broadcast - Send email to multiple users or all users
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
    if (!body.subject || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    let recipientEmails = [];

    // If sendToAll is true, get all active users
    if (body.sendToAll) {
      const usersData = await getAllUsers({ 
        status: 'active', 
        limit: 1000 // Get all users
      });
      recipientEmails = usersData.users.map(u => u.email);
    } 
    // If specific userIds are provided
    else if (body.userIds && Array.isArray(body.userIds)) {
      const usersData = await getAllUsers({ limit: 1000 });
      const selectedUsers = usersData.users.filter(u => body.userIds.includes(u._id.toString()));
      recipientEmails = selectedUsers.map(u => u.email);
    }
    // If specific emails are provided
    else if (body.emails && Array.isArray(body.emails)) {
      recipientEmails = body.emails;
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No recipients specified' },
        { status: 400 }
      );
    }

    // Send emails using the notify API
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const email of recipientEmails) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notify/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: body.subject,
            message: body.message,
            isAiGenerated: false,
          }),
        });

        const emailData = await emailResponse.json();
        
        if (emailData.success) {
          successCount++;
          results.push({ 
            email, 
            success: true, 
            messageId: emailData.messageId,
            previewUrl: emailData.previewUrl 
          });
        } else {
          failureCount++;
          results.push({ 
            email, 
            success: false, 
            error: emailData.error 
          });
        }
      } catch (error) {
        failureCount++;
        results.push({ 
          email, 
          success: false, 
          error: error.message 
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Emails sent: ${successCount} successful, ${failureCount} failed`,
      sent: successCount,
      failed: failureCount,
      total: recipientEmails.length,
      details: results,
    });
  } catch (error) {
    console.error('Error sending broadcast email:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
