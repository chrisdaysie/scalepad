import { NextResponse } from 'next/server';

interface ITGlueClient {
  id: string;
  type: string;
  attributes: {
    name: string;
    organization_id: number;
  };
}

interface ITGlueClientsResponse {
  data: ITGlueClient[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

export async function GET() {
  try {
    const apiKey = process.env.ITGLUE_API_KEY;
    const baseUrl = process.env.ITGLUE_BASE_URL || 'https://api.itglue.com';

    if (!apiKey) {
      console.error('IT Glue API key not configured');
      return NextResponse.json(
        { error: 'IT Glue API key not configured' },
        { status: 500 }
      );
    }

    console.log('Fetching IT Glue clients...');

    const headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/vnd.api+json',
    };

    // Fetch clients from IT Glue API
    const response = await fetch(
      `${baseUrl}/organizations?page[size]=100`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`IT Glue API error: ${response.status} - ${response.statusText}`);
    }

    let clientsData: ITGlueClientsResponse;
    try {
      clientsData = await response.json();
      console.log('IT Glue API response structure:', JSON.stringify(clientsData, null, 2));
    } catch (error) {
      console.error('Failed to parse IT Glue clients JSON:', error);
      const responseText = await response.text();
      console.error('Response text:', responseText);
      throw new Error(`Invalid JSON response from IT Glue API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Transform IT Glue response to match our expected format
    const clients = clientsData.data.map((client: ITGlueClient) => ({
      uuid: client.id,
      name: client.attributes.name,
      organization_id: client.attributes.organization_id
    }));

    console.log(`Found ${clients.length} IT Glue clients`);

    return NextResponse.json({
      success: true,
      clients: clients,
      message: 'IT Glue clients fetched successfully',
    });

  } catch (error) {
    console.error('Error fetching IT Glue clients:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: `Failed to fetch IT Glue clients: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
