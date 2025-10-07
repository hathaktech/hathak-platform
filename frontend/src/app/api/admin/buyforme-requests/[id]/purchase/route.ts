import { NextRequest, NextResponse } from 'next/server';
import { handleApiResponseError } from '@/utils/apiErrorHandler';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    console.log('📦 Next.js API Route - Mark as purchased:', {
      id: params.id,
      backendUrl,
      hasToken: !!token,
      bodyKeys: Object.keys(body),
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    });
    
    const backendResponse = await fetch(`${backendUrl}/api/admin/buyforme-requests/${params.id}/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });
    
    console.log('📦 Backend response status:', backendResponse.status, backendResponse.statusText);
    console.log('📦 Backend response headers:', Object.fromEntries(backendResponse.headers.entries()));
    
    // Get the response body as text first to see what we're dealing with
    const responseText = await backendResponse.text();
    console.log('📦 Backend response body length:', responseText.length);
    console.log('📦 Backend response body:', responseText);
    
    if (!backendResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = {
          success: false,
          message: `Backend error: ${backendResponse.status} ${backendResponse.statusText}`,
          error: responseText || 'Unknown error'
        };
      }
      console.error('❌ Backend error:', errorData);
      return NextResponse.json(errorData, { status: backendResponse.status });
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse backend response as JSON:', parseError);
      data = {
        success: false,
        message: 'Invalid response from backend',
        error: responseText
      };
    }
    
    console.log('✅ Success response:', { success: data.success, message: data.message });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error in purchase API route:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to mark as purchased',
        error: error.message || 'Network error',
      },
      { status: 500 }
    );
  }
}

