import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://stok-takip-hipd.vercel.app/api';

interface RouteParams {
  params: {
    id: string;
  }
}

// Tek bir stok getir
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;
    console.log('Fetching stok details from', `${API_BASE_URL}/stoklar/${id}`);
    
    // Fetch data from Vercel API
    const response = await fetch(`${API_BASE_URL}/stoklar/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { message: 'Stok bulunamadı' },
          { status: 404 }
        );
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const stok = await response.json();
    return NextResponse.json(stok);
  } catch (error: any) {
    console.error('Stok getirme hatası:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// Note: PUT and DELETE operations are not supported through the proxy 