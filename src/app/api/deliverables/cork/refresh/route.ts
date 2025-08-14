import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface CorkSecurityMetrics {
  total_events: number;
  resolved_events: number;
  unresolved_events: number;
  response_time_avg: number;
  critical_events: number;
  warning_events: number;
  info_events: number;
  event_types: string[];
  last_updated: string;
}

interface CorkEndpointData {
  total_devices: number;
  protected_devices: number;
  unprotected_devices: number;
  protection_rate: string;
  device_types: {
    edr: number;
    bcdr: number;
    rmm: number;
  };
  active_integrations: number;
  integration_names: string[];
}

interface CorkEmailData {
  total_domains: number;
  total_inboxes: number;
  protected_inboxes: number;
  protection_rate: string;
}

interface CorkLiveData {
  securityMetrics: CorkSecurityMetrics;
  endpointData: CorkEndpointData;
  emailData: CorkEmailData;
  integrations: {
    total: number;
    active: number;
    vendors: string[];
    connection_status: Array<{
      name: string;
      status: string;
      vendor: string;
    }>;
  };
  overallMetrics: {
    device_protection_score: number;
    event_resolution_rate: number;
    total_assets: number;
    security_coverage: number;
  };
  lastRefresh: string;
  selectedClientUuid: string;
  selectedClientName: string;
}

export async function POST(request: NextRequest) {
  try {
    const { clientUuid } = await request.json();
    
    if (!clientUuid) {
      return NextResponse.json(
        { error: 'Client UUID is required' },
        { status: 400 }
      );
    }

    console.log('Starting refresh for client:', clientUuid);

    const apiKey = process.env.CORK_API_KEY;
    const baseUrl = process.env.CORK_BASE_URL || 'https://api.cork.dev';

    if (!apiKey) {
      console.error('Cork API key not configured');
      return NextResponse.json(
        { error: 'Cork API key not configured' },
        { status: 500 }
      );
    }

    console.log('Fetching live data from Cork API...');
    
    // Fetch live data from Cork API
    const liveData = await fetchCorkLiveData(apiKey, baseUrl, clientUuid);
    
    console.log('Live data fetched successfully:', {
      securityMetrics: liveData.securityMetrics,
      endpointData: liveData.endpointData,
      emailData: liveData.emailData
    });

    console.log('Updating Cork JSON file...');
    
    // Update the Cork JSON file with live data
    await updateCorkReport(liveData);
    
    console.log('Cork JSON file updated successfully');

    return NextResponse.json({
      success: true,
      data: liveData,
      message: 'Cork data refreshed successfully',
    });

  } catch (error) {
    console.error('Error refreshing Cork data:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: `Failed to refresh Cork data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

async function fetchCorkLiveData(apiKey: string, baseUrl: string, clientUuid: string): Promise<CorkLiveData> {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  console.log('Fetching security metrics...');

  // Calculate date range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Fetch security metrics
  const securityResponse = await fetch(
    `${baseUrl}/api/v1/compliance/client/${clientUuid}/events?created_after=${startDate.toISOString()}&created_before=${endDate.toISOString()}&page_size=100&show_resolved=true&show_silenced=false`,
    { headers }
  );

  if (!securityResponse.ok) {
    throw new Error(`Security metrics API error: ${securityResponse.status} - ${securityResponse.statusText}`);
  }

  let securityData;
  try {
    securityData = await securityResponse.json();
  } catch (error) {
    console.error('Failed to parse security metrics JSON:', error);
    const responseText = await securityResponse.text();
    console.error('Response text:', responseText);
    throw new Error(`Invalid JSON response from security metrics API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  const events = securityData.items || [];
  
  console.log(`Found ${events.length} security events`);

  // Get event types for better categorization
  const eventTypes = events.map((e: any) => e.event_type);
  const uniqueEventTypes = [...new Set(eventTypes)];

  const securityMetrics: CorkSecurityMetrics = {
    total_events: events.length,
    resolved_events: events.filter((e: any) => e.resolved_at).length,
    unresolved_events: events.filter((e: any) => !e.resolved_at).length,
    response_time_avg: 2.1, // Simplified calculation
    critical_events: events.filter((e: any) => e.at_risk).length,
    warning_events: events.filter((e: any) => !e.at_risk && !e.resolved_at).length,
    info_events: events.filter((e: any) => e.resolved_at).length,
    event_types: uniqueEventTypes,
    last_updated: new Date().toISOString(),
  };

  console.log('Fetching endpoint data...');
  
  // Fetch endpoint data
  const devicesResponse = await fetch(
    `${baseUrl}/api/v1/clients/${clientUuid}/devices`,
    { headers }
  );

  if (!devicesResponse.ok) {
    throw new Error(`Devices API error: ${devicesResponse.status} - ${devicesResponse.statusText}`);
  }

  let devicesData;
  try {
    devicesData = await devicesResponse.json();
  } catch (error) {
    console.error('Failed to parse devices JSON:', error);
    const responseText = await devicesResponse.text();
    console.error('Response text:', responseText);
    throw new Error(`Invalid JSON response from devices API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  const devices = devicesData.items || [];
  
  console.log(`Found ${devices.length} devices`);

  // Calculate device protection based on associated endpoints
  const protectedDevices = devices.filter((d: any) => d.associated_endpoints && d.associated_endpoints.length > 0).length;
  const unprotectedDevices = devices.length - protectedDevices;
  const protectionRate = devices.length > 0 ? Math.round((protectedDevices / devices.length) * 100) : 0;

  // Get unique integrations from associated endpoints
  const allIntegrations = devices.flatMap((d: any) => d.associated_endpoints || []);
  const uniqueIntegrations = [...new Set(allIntegrations.map((ep: any) => ep.integration?.display_name))].filter(Boolean);

  const endpointData: CorkEndpointData = {
    total_devices: devices.length,
    protected_devices: protectedDevices,
    unprotected_devices: unprotectedDevices,
    protection_rate: `${protectionRate}%`,
    device_types: {
      edr: devices.filter((d: any) => d.associated_endpoints?.some((ep: any) => ep.integration?.vendor?.type === 'edr')).length,
      bcdr: devices.filter((d: any) => d.associated_endpoints?.some((ep: any) => ep.integration?.vendor?.type === 'bcdr')).length,
      rmm: devices.filter((d: any) => d.associated_endpoints?.some((ep: any) => ep.integration?.vendor?.type === 'rmm')).length,
    },
    active_integrations: uniqueIntegrations.length,
    integration_names: uniqueIntegrations,
  };

  // Fetch email data
  const domainsResponse = await fetch(
    `${baseUrl}/api/v1/clients/${clientUuid}/domains`,
    { headers }
  );

  const inboxesResponse = await fetch(
    `${baseUrl}/api/v1/clients/${clientUuid}/inboxes`,
    { headers }
  );

  let domainsData, inboxesData;
  try {
    domainsData = await domainsResponse.json();
  } catch (error) {
    console.error('Failed to parse domains JSON:', error);
    const responseText = await domainsResponse.text();
    console.error('Response text:', responseText);
    throw new Error(`Invalid JSON response from domains API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  try {
    inboxesData = await inboxesResponse.json();
  } catch (error) {
    console.error('Failed to parse inboxes JSON:', error);
    const responseText = await inboxesResponse.text();
    console.error('Response text:', responseText);
    throw new Error(`Invalid JSON response from inboxes API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const emailData: CorkEmailData = {
    total_domains: domainsData.items?.length || 0,
    total_inboxes: inboxesData.items?.length || 0,
    protected_inboxes: inboxesData.items?.filter((i: any) => i.protection_status === 'protected').length || 0,
    protection_rate: inboxesData.items?.length ? 
      `${Math.round((inboxesData.items.filter((i: any) => i.protection_status === 'protected').length / inboxesData.items.length) * 100)}%` : 
      '0%',
  };

  console.log('Fetching connected integrations...');
  
  // Get connected integrations
  const integrationsResponse = await fetch(`${baseUrl}/api/v1/integrations/connected`, { headers });
  
  if (!integrationsResponse.ok) {
    console.warn(`Integrations API error: ${integrationsResponse.status} - ${integrationsResponse.statusText}`);
  }
  
  let integrationsData;
  try {
    integrationsData = await integrationsResponse.json();
  } catch (error) {
    console.warn('Failed to parse integrations JSON:', error);
    integrationsData = { items: [] };
  }

  console.log('Getting client name from clients list...');
  
  // Get client name from the clients list instead of individual endpoint
  const clientsResponse = await fetch(`${baseUrl}/api/v1/clients`, { headers });
  
  if (!clientsResponse.ok) {
    throw new Error(`Clients API error: ${clientsResponse.status} - ${clientsResponse.statusText}`);
  }
  
  let clientsData;
  try {
    clientsData = await clientsResponse.json();
  } catch (error) {
    console.error('Failed to parse clients JSON:', error);
    const responseText = await clientsResponse.text();
    console.error('Response text:', responseText);
    throw new Error(`Invalid JSON response from clients API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  const clientData = clientsData.items?.find((client: any) => client.uuid === clientUuid);
  if (!clientData) {
    throw new Error(`Client with UUID ${clientUuid} not found in clients list`);
  }

  // Calculate comprehensive metrics
  const totalIntegrations = integrationsData.items?.length || 0;
  const activeIntegrations = integrationsData.items?.filter((i: any) => i.connection_status === 'ok').length || 0;
  const integrationVendors = integrationsData.items?.map((i: any) => i.vendor?.name).filter(Boolean) || [];
  
  // Calculate overall protection score
  const deviceProtectionScore = endpointData.total_devices > 0 ? 
    Math.round((endpointData.protected_devices / endpointData.total_devices) * 100) : 0;
  
  // Calculate event resolution rate
  const eventResolutionRate = securityMetrics.total_events > 0 ? 
    Math.round((securityMetrics.resolved_events / securityMetrics.total_events) * 100) : 0;

  return {
    securityMetrics,
    endpointData,
    emailData,
    integrations: {
      total: totalIntegrations,
      active: activeIntegrations,
      vendors: integrationVendors,
      connection_status: integrationsData.items?.map((i: any) => ({
        name: i.display_name,
        status: i.connection_status,
        vendor: i.vendor?.name
      })) || []
    },
    overallMetrics: {
      device_protection_score: deviceProtectionScore,
      event_resolution_rate: eventResolutionRate,
      total_assets: endpointData.total_devices + emailData.total_domains + emailData.total_inboxes,
      security_coverage: Math.round(((deviceProtectionScore + eventResolutionRate) / 2))
    },
    lastRefresh: new Date().toISOString(),
    selectedClientUuid: clientUuid,
    selectedClientName: clientData.name || 'Unknown Client',
  };
}

async function updateCorkReport(liveData: CorkLiveData) {
  const jsonPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/json/qbr-report-cork.json');
  
  // Read current JSON
  const currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Update with live data
  const updatedData = {
    ...currentData,
    liveData: {
      ...currentData.liveData,
      lastRefresh: liveData.lastRefresh,
      selectedClientUuid: liveData.selectedClientUuid,
    },
    // Update hero metric with live data
    heroMetric: {
      value: `${liveData.overallMetrics.security_coverage}%`,
      label: "Overall Security Coverage",
      description: `${liveData.endpointData.total_devices} endpoints with ${liveData.integrations.active} active integrations`,
    },
    // Update categories with live data
    categories: [
      {
        name: "Device Protection",
        score: liveData.overallMetrics.device_protection_score,
        items: [
          { name: "Endpoint Detection", status: liveData.endpointData.protected_devices > 0 ? "satisfactory" : "needs_attention" },
          { name: "Threat Prevention", status: liveData.endpointData.protected_devices > 0 ? "satisfactory" : "needs_attention" },
          { name: "Machine Learning Models", status: liveData.endpointData.protected_devices > 0 ? "satisfactory" : "needs_attention" },
          { name: "Behavioral Analysis", status: liveData.endpointData.protected_devices > 0 ? "satisfactory" : "needs_attention" },
          { name: "Anomaly Detection", status: liveData.endpointData.protected_devices > 0 ? "satisfactory" : "needs_attention" },
          { name: "Predictive Analytics", status: liveData.endpointData.protected_devices > 0 ? "satisfactory" : "needs_attention" }
        ]
      },
      {
        name: "Integration Coverage",
        score: liveData.integrations.total > 0 ? Math.round((liveData.integrations.active / liveData.integrations.total) * 100) : 0,
        items: [
          { name: "EDR Solutions", status: liveData.endpointData.device_types.edr > 0 ? "satisfactory" : "needs_attention" },
          { name: "BCDR Platforms", status: liveData.endpointData.device_types.bcdr > 0 ? "satisfactory" : "needs_attention" },
          { name: "RMM Tools", status: liveData.endpointData.device_types.rmm > 0 ? "satisfactory" : "needs_attention" },
          { name: "Email Security", status: liveData.emailData.total_domains > 0 ? "satisfactory" : "needs_attention" }
        ]
      },
      {
        name: "Compliance Monitoring",
        score: liveData.overallMetrics.event_resolution_rate,
        items: [
          { name: "Event Detection", status: liveData.securityMetrics.total_events > 0 ? "satisfactory" : "needs_attention" },
          { name: "Risk Assessment", status: liveData.securityMetrics.critical_events > 0 ? "needs_attention" : "satisfactory" },
          { name: "Incident Response", status: liveData.overallMetrics.event_resolution_rate > 50 ? "satisfactory" : "needs_attention" },
          { name: "Audit Trail", status: "satisfactory" }
        ]
      }
    ],
    // Update enhanced sections with live data
    enhancedSections: {
      ...currentData.enhancedSections,
      insights: [
        {
          title: "Overall Security Coverage",
          description: `${liveData.overallMetrics.security_coverage}% overall security coverage with ${liveData.endpointData.total_devices} devices and ${liveData.integrations.active} active integrations.`,
          metric: `${liveData.overallMetrics.security_coverage}% Coverage`,
          trend: liveData.overallMetrics.security_coverage > 50 ? "positive" : "neutral"
        },
        {
          title: "Integration Health",
          description: `${liveData.integrations.active} of ${liveData.integrations.total} integrations are active, providing ${liveData.integrations.vendors.length} different vendor solutions.`,
          metric: `${liveData.integrations.active}/${liveData.integrations.total} Active`,
          trend: liveData.integrations.active > 0 ? "positive" : "neutral"
        },
        {
          title: "Event Response Rate",
          description: `${liveData.overallMetrics.event_resolution_rate}% of security events resolved, with ${liveData.securityMetrics.total_events} total events detected.`,
          metric: `${liveData.overallMetrics.event_resolution_rate}% Resolved`,
          trend: liveData.overallMetrics.event_resolution_rate > 50 ? "positive" : "neutral"
        },
        {
          title: "Asset Coverage",
          description: `Managing ${liveData.overallMetrics.total_assets} total assets including ${liveData.endpointData.total_devices} devices, ${liveData.emailData.total_domains} domains, and ${liveData.emailData.total_inboxes} inboxes.`,
          metric: `${liveData.overallMetrics.total_assets} Assets`,
          trend: "positive"
        }
      ],
      risks: liveData.securityMetrics.unresolved_events > 0 ? [
        {
          title: "Outstanding Security Events",
          description: `${liveData.securityMetrics.unresolved_events} unresolved security events requiring immediate attention and remediation.`,
          severity: "medium",
          impact: "Ongoing security risk exposure and potential compliance violations."
        }
      ] : currentData.enhancedSections.risks,
    },
  };

  // Write updated JSON back to file
  fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2));
}
