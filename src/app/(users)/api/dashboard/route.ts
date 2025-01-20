import { NextResponse } from 'next/server';
import { getProductFromBlockchain } from '@/lib/kaleido';

export async function GET() {
  try {
    // In a real-world scenario, you'd fetch this data from your blockchain or database
    const totalProducts = 100; // Placeholder value
    const verifiedToday = 10; // Placeholder value
    const addedThisWeek = 25; // Placeholder value
    const expiringSoon = 5; // Placeholder value

    // Fetch the latest product for demonstration
    let latestProduct = null;
    try {
      latestProduct = await getProductFromBlockchain("latest"); // Assuming "latest" is a special key to get the most recent product
    } catch (error) {
      console.error('Failed to fetch latest product:', error);
    }

    return NextResponse.json({
      totalProducts,
      verifiedToday,
      addedThisWeek,
      expiringSoon,
      latestProduct
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

