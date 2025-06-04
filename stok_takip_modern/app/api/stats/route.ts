import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://stok-takip-hipd.vercel.app/api';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching stats from', `${API_BASE_URL}/stoklar`);
    
    // Fetch stoklar data to calculate stats
    const stokResponse = await fetch(`${API_BASE_URL}/stoklar`);
    if (!stokResponse.ok) {
      throw new Error(`API error: ${stokResponse.status}`);
    }
    
    const stoklar = await stokResponse.json();
    
    // Calculate stats from stoklar data
    const totalProducts = stoklar.length;
    
    // Calculate total inventory value
    const totalValue = stoklar.reduce((sum: number, item: any) => {
      return sum + (item.miktar * item.fiyat);
    }, 0);
    
    // For simplicity, we'll set placeholder values for the other stats
    // since the external API might not provide this information
    const criticalStock = 5; // Placeholder
    const recentEntries = 12; // Placeholder
    
    return NextResponse.json({
      totalProducts,
      totalValue,
      criticalStock,
      recentEntries
    });
  } catch (error: any) {
    console.error('İstatistik verileri getirme hatası:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
} 