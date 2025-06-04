import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://stok-takip-hipd.vercel.app/api';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching raporlar from', `${API_BASE_URL}/raporlar`);
    
    // Fetch data from Vercel API
    const response = await fetch(`${API_BASE_URL}/raporlar`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const raporlar = await response.json();
    return NextResponse.json(raporlar);
  } catch (error: any) {
    console.error('Raporları getirme hatası:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 