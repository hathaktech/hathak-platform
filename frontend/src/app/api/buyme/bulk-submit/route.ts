import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    // For bulk submit, we'll create multiple requests individually
    // since the unified API doesn't have a bulk endpoint
    const results = [];
    
    for (const requestData of body.requests || []) {
      const response = await fetch(`${backendUrl}/api/user/buyforme-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': token }),
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        results.push({ error: errorData, request: requestData });
      } else {
        const data = await response.json();
        results.push({ success: data, request: requestData });
      }
    }
    
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error submitting multiple BuyMe requests:', error);
    return NextResponse.json(
      { error: 'Failed to submit BuyMe requests' },
      { status: 500 }
    );
  }
}
