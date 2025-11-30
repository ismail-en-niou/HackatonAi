

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const authHeader =
      request.headers.get('authorization') || request.headers.get('cookie') || '';

    // Expecting body to contain { query: string, ... }
    const payload = typeof body === 'object' ? body : { query: String(body) };

    const baseUrl = process.env.AI_URL || 'http://localhost:8000';
    const res = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await res.json()
      : { text: await res.text() };

    // Format response to include sources if context_files are present
    const formattedData = {
      ...data,
      sources: data.context_files?.map((file, index) => ({
        title: file,
        excerpt: `Source ${index + 1}`
      })) || null
    };

    return NextResponse.json(formattedData, { status: res.status });
  } catch (error) {
    console.error('POST /api/chats error', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}