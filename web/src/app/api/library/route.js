import { NextResponse } from 'next/server';
import { verifyAdmin, verifyUser } from '../../lib/middleware/adminAuth';

const AI_URL = process.env.AI_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${AI_URL}/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Service error:', errorText);
      return NextResponse.json(
        { success: false, error: `Failed to fetch files from AI service: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Map files with proper structure
    const filesWithDetails = (data.files || []).map((file) => {
      if (typeof file === 'string') {
        // Old format - just filename
        return {
          name: file,
          size: 0,
          type: 'application/octet-stream',
          url: `/api/library/${encodeURIComponent(file)}`,
        };
      } else {
        // New format - object with details
        return {
          name: file.name,
          size: file.size || 0,
          modified: file.modified,
          type: 'application/octet-stream',
          url: `/api/library/${encodeURIComponent(file.name)}`,
        };
      }
    });

    return NextResponse.json({
      success: true,
      files: filesWithDetails,
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to connect to AI service' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // Verify admin access
  const { isAdmin, error, user } = await verifyAdmin(request);
  console.log('Admin verification:', { isAdmin, error, user });
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: error || 'Access denied. Admin privileges required.' },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const uploadResponse = await fetch(`${AI_URL}/files`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      return NextResponse.json(
        { success: false, error: errorText || 'Failed to upload file' },
        { status: uploadResponse.status }
      );
    }

    const data = await uploadResponse.json();
    return NextResponse.json({ success: true, file: data.file, message: data.detail || 'Uploaded' });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  // Verify admin access
  const { isAdmin, error, user } = await verifyAdmin(request);
  
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: error || 'Access denied. Admin privileges required.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${AI_URL}/files/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { success: false, error: data.detail || 'Failed to delete file' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: data.detail || 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
