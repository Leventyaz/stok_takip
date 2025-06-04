import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://stok-takip-hipd.vercel.app/api';

// Proxy all requests to the Vercel API
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching stoklar from', `${API_BASE_URL}/stoklar`);
    
    // Fetch data from Vercel API
    const response = await fetch(`${API_BASE_URL}/stoklar`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const stoklar = await response.json();
    return NextResponse.json(stoklar);
  } catch (error: any) {
    console.error('Stokları getirme hatası:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// Note: POST operations are not supported through the proxy 