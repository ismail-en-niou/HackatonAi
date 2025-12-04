import { NextResponse } from 'next/server';

const AI_URL = process.env.AI_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const body = await request.json();
    const query = (body?.query || '').trim();
    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const response = await fetch(`${AI_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ success: false, error: text || 'Search failed' }, { status: response.status });
    }

    const data = await response.json();
    // FastAPI returns { files: [...] }
    return NextResponse.json({ success: true, files: data.files || [], results: data.files || [] });
  } catch (error) {
    console.error('Search proxy error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
