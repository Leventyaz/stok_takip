import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://stok-takip-hipd.vercel.app/api';

// Proxy requests to the Vercel API
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching hareketler from', `${API_BASE_URL}/hareketler`);
    
    // Fetch data from Vercel API
    const response = await fetch(`${API_BASE_URL}/hareketler`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const hareketler = await response.json();
    return NextResponse.json(hareketler);
  } catch (error: any) {
    console.error('Hareketleri getirme hatası:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 