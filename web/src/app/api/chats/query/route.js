

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const authHeader =
      request.headers.get('authorization') || request.headers.get('cookie') || '';

    // Expecting body to contain { query: string, ... }
    const payload = typeof body === 'object' ? body : { query: String(body) };

    const baseUrl = process.env.AI_URL || 'http://localhost:8000';
    
    let res;
    try {
      res = await fetch(`${baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch (fetchError) {
      console.error('Failed to connect to AI service:', fetchError);
      return NextResponse.json({ 
        success: false, 
        error: 'Service AI temporairement indisponible. Veuillez réessayer dans quelques instants.',
        text: 'Le service AI est en cours de démarrage. Veuillez patienter quelques secondes et réessayer.'
      }, { status: 503 });
    }

    // Handle non-OK responses from AI service
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`AI service error (${res.status}):`, errorText);
      
      return NextResponse.json({ 
        success: false,
        error: `Erreur du service AI (${res.status})`,
        text: 'Le service AI rencontre actuellement des difficultés. Veuillez réessayer dans quelques instants.'
      }, { status: 503 });
    }

    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await res.json()
      : { text: await res.text() };

    // Handle null or undefined data
    if (!data) {
      return NextResponse.json({ 
        text: 'Aucune réponse trouvée. Veuillez ajouter des documents à la bibliothèque.',
        sources: null
      }, { status: 200 });
    }

    // Format response to include sources if context_files are present
    const formattedData = {
      text: data.text || data.answer || data.response || 'Aucune réponse disponible',
      sources: (data.context_files && Array.isArray(data.context_files)) 
        ? data.context_files.map((file, index) => ({
            title: file,
            excerpt: `Source ${index + 1}`
          })) 
        : null,
      ...data
    };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error('POST /api/chats/query error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      text: 'Une erreur est survenue lors du traitement de votre requête.'
    }, { status: 500 });
  }
}