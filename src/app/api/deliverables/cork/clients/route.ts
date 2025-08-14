import { NextRequest, NextResponse } from 'next/server';

interface CorkClient {
  uuid: string;
  name: string;
  status: string;
  created_at: string;
}

interface CorkClientsResponse {
  items: CorkClient[];
  total: number;
  page: number;
  page_size: number;
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.CORK_API_KEY;
    const baseUrl = process.env.CORK_BASE_URL || 'https://api.cork.dev';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Cork API key not configured' },
        { status: 500 }
      );
    }

    // Fetch clients from Cork API
    const response = await fetch(`${baseUrl}/api/v1/clients`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Cork API error: ${response.status}`);
    }

    const data: CorkClientsResponse = await response.json();

    // Transform the data for our frontend
    const clients = data.items.map(client => ({
      uuid: client.uuid,
      name: client.name,
      status: client.status,
      created_at: client.created_at,
    }));

    return NextResponse.json({
      clients,
      total: data.total,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching Cork clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients from Cork API' },
      { status: 500 }
    );
  }
}
