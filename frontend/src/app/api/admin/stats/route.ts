import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            type: 'authentication',
            message: 'Authorization token required',
            statusCode: 401
          }
        },
        { status: 401 }
      );
    }

    // For now, return mock data since we don't have a unified admin stats endpoint
    // In a real implementation, you would aggregate data from multiple backend endpoints
    const mockStats = {
      totalUsers: 1250,
      activeUsers: 890,
      totalProducts: 3400,
      pendingProducts: 45,
      totalOrders: 2100,
      pendingOrders: 23,
      totalRevenue: 125000,
      monthlyRevenue: 15000,
      activePromotions: 8,
      pendingModerations: 12,
      resolvedModerations: 156,
      systemHealth: 98
    };

    return NextResponse.json({
      success: true,
      data: mockStats
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { 
        success: false,
        error: {
          type: 'server_error',
          message: 'Failed to fetch admin statistics',
          statusCode: 500
        }
      },
      { status: 500 }
    );
  }
}
