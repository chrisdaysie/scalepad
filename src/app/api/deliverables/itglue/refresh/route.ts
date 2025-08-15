import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// TypeScript interfaces for IT Glue API responses
interface ITGlueAsset {
  id: string;
  type: string;
  attributes: {
    name?: string;
    asset_type_id?: number;
    organization_id?: number;
    created_at?: string;
    updated_at?: string;
    archived?: boolean;
  };
}

interface ITGlueDomain {
  id: string;
  type: string;
  attributes: {
    name?: string;
    expires_at?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
  };
}

interface ITGluePassword {
  id: string;
  type: string;
  attributes: {
    name?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
  };
}

interface ITGlueSSLCertificate {
  id: string;
  type: string;
  attributes: {
    name?: string;
    expires_at?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
  };
}



interface ITGlueConfigurationType {
  id: string;
  type: string;
  attributes: {
    name?: string;
    [key: string]: unknown;
  };
}

interface ITGlueFlexibleAssetType {
  id: string;
  type: string;
  attributes: {
    name?: string;
    [key: string]: unknown;
  };
}

interface ITGlueFlexibleAsset {
  id: string;
  type: string;
  attributes: {
    name?: string;
    flexible_asset_type_id?: number;
    organization_id?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
  };
}

interface ITGlueUser {
  id: string;
  type: string;
  attributes: {
    name?: string;
    email?: string;
    last_sign_in_at?: string;
    created_at?: string;
  };
}

interface ITGlueActivity {
  id: string;
  type: string;
  attributes: {
    action?: string;
    resource_type?: string;
    resource_id?: string;
    user_id?: string;
    created_at?: string;
  };
}



interface ITGlueAssetData {
  total_assets: number;
  documented_assets: number;
  undocumented_assets: number;
  managed_assets: number;
  hardware_assets: number;
  software_assets: number;
  network_assets: number;
  cloud_assets: number;
  asset_types: {
    hardware: number;
    software: number;
    network: number;
    cloud: number;
  };
}

interface ITGlueProcessData {
  total_processes: number;
  documented_processes: number;
  outdated_processes: number;
  compliance_score: number;
  process_types: string[];
  recent_updates: number;
}

interface ITGlueUserData {
  total_users: number;
  active_users: number;
  active_user_percentage: number;
  top_contributors: string[];
}

interface ITGlueActivityData {
  recent_updates: number;
  avg_documentation_age: number;
  update_frequency: number;
}

interface ITGlueComplianceData {
  compliance_score: number;
  compliance_items: number;
  compliant_items: number;
  non_compliant_items: number;
  categories: string[];
  last_audit: string;
}

interface ITGlueLiveData {
  assetData: ITGlueAssetData;
  processData: ITGlueProcessData;
  userData: ITGlueUserData;
  activityData: ITGlueActivityData;
  complianceData: ITGlueComplianceData;
  documentationSummary: {
    configurations: {
      total: number;
      byType: { [key: string]: number };
      byExpiration: { [key: string]: number };
    };
      domains: {
    total: number;
    list: Array<{
      name: string;
      expiryDate: string;
      registrar: string;
      displayText: string;
    }>;
  };

    passwords: {
      total: number;
      fresh: number;
      stale: number;
    };

      sslCertificates: {
    total: number;
    expiringSoon: number;
    list: Array<{
      name: string;
      issuer: string;
      expiryDate: string;
      algorithm: string;
      displayText: string;
    }>;
  };
    flexibleAssets: {
      byType: { [key: string]: number };
      detailed: { [key: string]: { count: number; examples: string[] } };
    };
  };
  overallMetrics: {
    documentation_completeness: number;
    asset_management_score: number;
    process_compliance_score: number;
    user_engagement_score: number;
  };
  lastRefresh: string;
  selectedClientUuid: string;
  selectedClientName: string;
  debug?: {
    configurationsByType: Record<string, number>;
    configTypeMap: Record<string, string>;
    sampleAssets: Array<{
      name?: string;
      typeId: string | number | undefined;
      allAttributes: string[];
    }>;
  };
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

    console.log('Starting IT Glue refresh for client:', clientUuid);

    const apiKey = process.env.ITGLUE_API_KEY;
    const baseUrl = process.env.ITGLUE_BASE_URL || 'https://api.itglue.com';

    if (!apiKey) {
      console.error('IT Glue API key not configured');
      return NextResponse.json(
        { error: 'IT Glue API key not configured' },
        { status: 500 }
      );
    }

    console.log('Fetching live data from IT Glue API...');
    
    // Fetch live data from IT Glue API
    const liveData = await fetchITGlueLiveData(apiKey, baseUrl, clientUuid);
    
    console.log('Live data fetched successfully:', {
      assetData: liveData.assetData,
      processData: liveData.processData,
      userData: liveData.userData
    });

    console.log('Processing IT Glue QBR template...');
    
    // Process the IT Glue QBR template with live data
    const result = await updateITGlueReport(liveData);
    
    console.log('IT Glue QBR template processed successfully');

    return NextResponse.json({
      success: true,
      data: result.data,
      liveData: liveData,
      message: 'IT Glue data refreshed successfully',
    });

  } catch (error) {
    console.error('Error refreshing IT Glue data:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: `Failed to refresh IT Glue data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

async function fetchITGlueLiveData(apiKey: string, baseUrl: string, clientUuid: string): Promise<ITGlueLiveData> {
  const headers = {
    'x-api-key': apiKey,
    'Content-Type': 'application/vnd.api+json',
  };

  console.log('Fetching asset data...');

  // Fetch all configurations (assets) from IT Glue API with pagination
  let allAssets: ITGlueAsset[] = [];
  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    const assetsResponse = await fetch(
      `${baseUrl}/configurations?filter[organization_id]=${clientUuid}&filter[archived]=false&page[size]=1000&page[number]=${currentPage}`,
      { headers }
    );

    console.log(`Assets response status for page ${currentPage}:`, assetsResponse.status);

    if (!assetsResponse.ok) {
      // Log the actual error response for debugging
      const errorText = await assetsResponse.text();
      console.error('IT Glue assets API error response:', errorText);
      throw new Error(`IT Glue assets API error: ${assetsResponse.status} - ${assetsResponse.statusText}`);
    }

    let assetsData;
    try {
      assetsData = await assetsResponse.json();
      console.log(`Page ${currentPage} meta info:`, assetsData.meta);
    } catch (error) {
      console.error('Failed to parse IT Glue assets JSON:', error);
      const responseText = await assetsResponse.text();
      console.error('Response text:', responseText);
      throw new Error(`Invalid JSON response from IT Glue assets API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    const pageAssets = assetsData.data || [];
    allAssets = allAssets.concat(pageAssets);
    
    console.log(`Found ${pageAssets.length} assets on page ${currentPage}`);
    
    // Check if there are more pages
    const totalPages = assetsData.meta?.total_pages || 1;
    const currentPageNumber = assetsData.meta?.current_page || currentPage;
    const totalCount = assetsData.meta?.total_count || 0;
    console.log(`Page ${currentPageNumber} of ${totalPages} total pages, total count: ${totalCount}`);
    hasMorePages = currentPageNumber < totalPages && allAssets.length < totalCount;
    currentPage++;
  }
  
  console.log(`Total active assets found: ${allAssets.length}`);
  
  const assets = allAssets;

  // Calculate asset metrics
  const documentedAssets = assets.filter((asset: ITGlueAsset) => 
    asset.attributes.name && asset.attributes.name.trim() !== ''
  ).length;
  
  const undocumentedAssets = assets.length - documentedAssets;
  const managedAssets = assets.filter((asset: ITGlueAsset) => 
    asset.attributes.asset_type_id && asset.attributes.asset_type_id > 0
  ).length;

  // Categorize assets by type (simplified - in real implementation, you'd use asset_type_id mapping)
  const hardwareAssets = assets.filter((asset: ITGlueAsset) => 
    asset.attributes.name?.toLowerCase().includes('server') ||
    asset.attributes.name?.toLowerCase().includes('workstation') ||
    asset.attributes.name?.toLowerCase().includes('laptop') ||
    asset.attributes.name?.toLowerCase().includes('desktop')
  ).length;

  const softwareAssets = assets.filter((asset: ITGlueAsset) => 
    asset.attributes.name?.toLowerCase().includes('software') ||
    asset.attributes.name?.toLowerCase().includes('application') ||
    asset.attributes.name?.toLowerCase().includes('license')
  ).length;

  const networkAssets = assets.filter((asset: ITGlueAsset) => 
    asset.attributes.name?.toLowerCase().includes('switch') ||
    asset.attributes.name?.toLowerCase().includes('router') ||
    asset.attributes.name?.toLowerCase().includes('firewall') ||
    asset.attributes.name?.toLowerCase().includes('network')
  ).length;

  const cloudAssets = assets.filter((asset: ITGlueAsset) => 
    asset.attributes.name?.toLowerCase().includes('cloud') ||
    asset.attributes.name?.toLowerCase().includes('aws') ||
    asset.attributes.name?.toLowerCase().includes('azure') ||
    asset.attributes.name?.toLowerCase().includes('gcp')
  ).length;

  const assetData: ITGlueAssetData = {
    total_assets: assets.length,
    documented_assets: documentedAssets,
    undocumented_assets: undocumentedAssets,
    managed_assets: managedAssets,
    hardware_assets: hardwareAssets,
    software_assets: softwareAssets,
    network_assets: networkAssets,
    cloud_assets: cloudAssets,
    asset_types: {
      hardware: hardwareAssets,
      software: softwareAssets,
      network: networkAssets,
      cloud: cloudAssets
    }
  };

  console.log('Fetching domains...');
  
  // Fetch domains from IT Glue API
  const domainsResponse = await fetch(
    `${baseUrl}/domains?filter[organization_id]=${clientUuid}&filter[archived]=false&page[size]=1000`,
    { headers }
  );

  let domains: ITGlueDomain[] = [];
  if (domainsResponse.ok) {
    try {
      const domainsData = await domainsResponse.json();
      domains = domainsData.data || [];
      console.log(`Found ${domains.length} domains`);
      
      // Debug: Log the first domain to see what fields are available
      if (domains.length > 0) {
        const firstDomain = domains[0];
        console.log('First domain data:', {
          name: firstDomain.attributes.name,
          expires_at: firstDomain.attributes.expires_at,
          created_at: firstDomain.attributes.created_at,
          updated_at: firstDomain.attributes.updated_at,
          all_attributes: Object.keys(firstDomain.attributes),
          all_values: firstDomain.attributes
        });
      }
    } catch (error) {
      console.warn('Failed to parse IT Glue domains JSON:', error);
    }
  } else {
    console.warn(`IT Glue domains API error: ${domainsResponse.status} - ${domainsResponse.statusText}`);
  }

  // Note: Documents endpoint not available in this IT Glue instance
  // All document endpoints return 404 Not Found
  console.log('Skipping documents - endpoint not available in this IT Glue instance');
  // const documents: ITGlueDocument[] = []; // Unused variable

  console.log('Fetching passwords...');
  
  // Fetch passwords from IT Glue API
  const passwordsResponse = await fetch(
    `${baseUrl}/passwords?filter[organization_id]=${clientUuid}&filter[archived]=false&page[size]=1000`,
    { headers }
  );

  let passwords: ITGluePassword[] = [];
  if (passwordsResponse.ok) {
    try {
      const passwordsData = await passwordsResponse.json();
      passwords = passwordsData.data || [];
      console.log(`Found ${passwords.length} passwords`);
      
      // Debug: Log the first password to see the date format
      if (passwords.length > 0) {
        const firstPassword = passwords[0];
        console.log('First password data:', {
          name: firstPassword.attributes.name,
          created_at: firstPassword.attributes.created_at,
          updated_at: firstPassword.attributes.updated_at,
          all_attributes: Object.keys(firstPassword.attributes),
          all_values: firstPassword.attributes
        });
      }
    } catch (error) {
      console.warn('Failed to parse IT Glue passwords JSON:', error);
    }
  } else {
    console.warn(`IT Glue passwords API error: ${passwordsResponse.status} - ${passwordsResponse.statusText}`);
  }

  // Note: Checklists endpoint not available in this IT Glue instance
  // API returns 401 Unauthorized and 404 Not Found for checklists endpoints
  console.log('Skipping checklists - endpoint not available in this IT Glue instance');
  // const checklists: ITGlueChecklist[] = []; // Unused variable

  console.log('Fetching SSL certificates...');
  
  // Fetch SSL certificates from IT Glue API
  const sslResponse = await fetch(
    `${baseUrl}/ssl_certificates?filter[organization_id]=${clientUuid}&filter[archived]=false&page[size]=1000`,
    { headers }
  );

  let sslCertificates: ITGlueSSLCertificate[] = [];
  if (sslResponse.ok) {
    try {
      const sslData = await sslResponse.json();
      sslCertificates = sslData.data || [];
      console.log(`Found ${sslCertificates.length} SSL certificates`);
      
      // Debug: Log the first SSL certificate to see what fields are available
      if (sslCertificates.length > 0) {
        const firstSSL = sslCertificates[0];
        console.log('First SSL certificate data:', {
          name: firstSSL.attributes.name,
          host: firstSSL.attributes.host,
          'valid-until': firstSSL.attributes['valid-until'],
          'issued-by': firstSSL.attributes['issued-by'],
          'created-at': firstSSL.attributes['created-at'],
          'updated-at': firstSSL.attributes['updated-at'],
          'signature-algorithm': firstSSL.attributes['signature-algorithm'],
          'issuer-organization': firstSSL.attributes['issuer-organization'],
          notes: firstSSL.attributes.notes,
          all_attributes: Object.keys(firstSSL.attributes),
          all_values: firstSSL.attributes
        });
      }
    } catch (error) {
      console.warn('Failed to parse IT Glue SSL certificates JSON:', error);
    }
  } else {
    console.warn(`IT Glue SSL certificates API error: ${sslResponse.status} - ${sslResponse.statusText}`);
  }

  console.log('Fetching configuration types...');
  
  // Try multiple endpoints to get configuration/asset types
  let allConfigurationTypes: ITGlueConfigurationType[] = [];
  
  // First try configuration_types endpoint
  console.log('Trying /configuration_types endpoint...');
  const configurationTypesResponse = await fetch(
    `${baseUrl}/configuration_types?page[size]=1000`,
    { headers }
  );

  if (!configurationTypesResponse.ok) {
    console.warn(`IT Glue configuration_types API error: ${configurationTypesResponse.status} - ${configurationTypesResponse.statusText}`);
  } else {
    try {
      const configurationTypesData = await configurationTypesResponse.json();
      allConfigurationTypes = configurationTypesData.data || [];
      console.log(`Found ${allConfigurationTypes.length} configuration types`);
      console.log('Configuration types response structure:', {
        meta: configurationTypesData.meta,
        dataLength: configurationTypesData.data?.length,
        firstType: configurationTypesData.data?.[0]
      });
    } catch (error) {
      console.warn('Failed to parse IT Glue configuration types JSON:', error);
    }
  }
  
  // If no configuration types found, try asset_types endpoint
  if (allConfigurationTypes.length === 0) {
    console.log('No configuration types found, trying /asset_types endpoint...');
    const assetTypesResponse = await fetch(
      `${baseUrl}/asset_types?page[size]=1000`,
      { headers }
    );

    if (assetTypesResponse.ok) {
      try {
        const assetTypesData = await assetTypesResponse.json();
        allConfigurationTypes = assetTypesData.data || [];
        console.log(`Found ${allConfigurationTypes.length} asset types`);
      } catch (error) {
        console.warn('Failed to parse IT Glue asset types JSON:', error);
      }
    } else {
      console.warn(`IT Glue asset_types API error: ${assetTypesResponse.status} - ${assetTypesResponse.statusText}`);
    }
  }
  
  const configurationTypes = allConfigurationTypes;
  console.log(`Total configuration/asset types found: ${configurationTypes.length}`);
  
  // Debug: Log first few configuration types to see their structure
  if (configurationTypes.length > 0) {
    console.log('Sample configuration type structure:', {
      id: configurationTypes[0].id,
      attributes: configurationTypes[0].attributes,
      allAttributeKeys: Object.keys(configurationTypes[0].attributes)
    });
    
    // Log all configuration types for debugging
    console.log('All configuration types:');
    configurationTypes.forEach((configType, index) => {
      console.log(`${index + 1}. ID: ${configType.id}, Name: ${configType.attributes.name}`);
    });
  }

  console.log('Fetching flexible asset types...');
  
  // Fetch flexible asset types to understand what types are available
  const flexibleAssetTypesResponse = await fetch(
    `${baseUrl}/flexible_asset_types?page[size]=1000`,
    { headers }
  );

  let flexibleAssetTypes: ITGlueFlexibleAssetType[] = [];
  if (flexibleAssetTypesResponse.ok) {
    try {
      const flexibleAssetTypesData = await flexibleAssetTypesResponse.json();
      flexibleAssetTypes = flexibleAssetTypesData.data || [];
      console.log(`Found ${flexibleAssetTypes.length} flexible asset types`);
    } catch (error) {
      console.warn('Failed to parse IT Glue flexible asset types JSON:', error);
    }
  } else {
    console.warn(`IT Glue flexible asset types API error: ${flexibleAssetTypesResponse.status} - ${flexibleAssetTypesResponse.statusText}`);
  }

    // Step 1: Create flexible asset type lookup map
  const flexibleAssetTypeMap = new Map<string, string>();
  if (flexibleAssetTypes.length > 0) {
    flexibleAssetTypes.forEach((type: ITGlueFlexibleAssetType) => {
      if (type.attributes.name) {
        flexibleAssetTypeMap.set(type.id, type.attributes.name);
      }
    });
    console.log(`Created flexible asset type lookup map with ${flexibleAssetTypeMap.size} types`);
  }

  console.log('Fetching flexible assets by type...');
  
  // Fetch flexible assets for each type with organization filter
  let allFlexibleAssets: ITGlueFlexibleAsset[] = [];
  
  // Get all flexible asset types first
  const flexibleAssetTypeIds = Array.from(flexibleAssetTypeMap.keys());
  console.log(`Fetching flexible assets for ${flexibleAssetTypeIds.length} types...`);
  
  for (const typeId of flexibleAssetTypeIds) {
    const typeName = flexibleAssetTypeMap.get(typeId) || `Type ${typeId}`;
    console.log(`Fetching flexible assets for type: ${typeName} (ID: ${typeId})`);
    
    const flexibleAssetsResponse = await fetch(
      `${baseUrl}/flexible_assets?filter[flexible_asset_type_id]=${typeId}&filter[organization_id]=${clientUuid}&filter[archived]=false&page[size]=1000`,
      { headers }
    );

    if (!flexibleAssetsResponse.ok) {
      console.warn(`IT Glue flexible assets API error for type ${typeName} (${typeId}): ${flexibleAssetsResponse.status} - ${flexibleAssetsResponse.statusText}`);
      continue; // Skip this type and continue with others
    }
    
    let flexibleAssetsData;
    try {
      flexibleAssetsData = await flexibleAssetsResponse.json();
      const pageFlexibleAssets = flexibleAssetsData.data || [];
      allFlexibleAssets = allFlexibleAssets.concat(pageFlexibleAssets);
      
      if (pageFlexibleAssets.length > 0) {
        console.log(`✅ Found ${pageFlexibleAssets.length} flexible assets for type: ${typeName}`);
      } else {
        console.log(`ℹ️  No flexible assets found for type: ${typeName}`);
      }
    } catch (error) {
      console.warn(`Failed to parse IT Glue flexible assets JSON for type ${typeName} (${typeId}):`, error);
      continue;
    }
  }
  
  console.log(`Total flexible assets found: ${allFlexibleAssets.length}`);
  
  const flexibleAssets = allFlexibleAssets;

  // Step 2: Process flexible assets and create summarization
  const flexibleAssetsDetailed: Record<string, { count: number; examples: string[] }> = {};
  
  console.log(`🔍 Processing ${allFlexibleAssets.length} flexible assets...`);
  
  allFlexibleAssets.forEach((asset: ITGlueFlexibleAsset, index: number) => {
    const attrs = asset.attributes as Record<string, unknown>;
    const typeId = attrs['flexible-asset-type-id'] as string | undefined;
    const typeName = attrs['flexible-asset-type-name'] as string | undefined;
    const assetName = asset.attributes.name || 'Unnamed Asset';
    
    // Log all assets for debugging
    console.log(`Flexible Asset ${index + 1}: "${assetName}" - Type: ${typeName}`);
    
    // Use the type name from the asset attributes, or fall back to the lookup map
    const finalTypeName = typeName || (typeId ? (flexibleAssetTypeMap.get(typeId) || `Type ${typeId}`) : 'Unknown');
    
    // Initialize the type if it doesn't exist
    if (!flexibleAssetsDetailed[finalTypeName]) {
      flexibleAssetsDetailed[finalTypeName] = { count: 0, examples: [] };
    }
    
    // Count and add example
    flexibleAssetsDetailed[finalTypeName].count++;
    if (flexibleAssetsDetailed[finalTypeName].examples.length < 3) { // Limit to 3 examples
      flexibleAssetsDetailed[finalTypeName].examples.push(assetName);
    }
    
    console.log(`✅ Added flexible asset: "${assetName}" to type "${finalTypeName}"`);
  });

  console.log('📊 Flexible Assets Breakdown by Type:', flexibleAssetsDetailed);

  // Check if we found any flexible assets
  if (Object.keys(flexibleAssetsDetailed).length === 0) {
    console.log('No flexible assets found for this organization');
  }







  // Calculate process metrics
  const documentedProcesses = flexibleAssets.filter((asset: ITGlueFlexibleAsset) => 
    asset.attributes.name && asset.attributes.name.trim() !== ''
  ).length;

  // Calculate outdated processes (not updated in last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const outdatedProcesses = flexibleAssets.filter((asset: ITGlueFlexibleAsset) => {
    if (!asset.attributes.updated_at) return true;
    const updatedAt = new Date(asset.attributes.updated_at);
    return updatedAt < ninetyDaysAgo;
  }).length;

  const processTypes = flexibleAssets.map((asset: ITGlueFlexibleAsset) => asset.attributes.name).filter(Boolean);

  const processData: ITGlueProcessData = {
    total_processes: flexibleAssets.length,
    documented_processes: documentedProcesses,
    outdated_processes: outdatedProcesses,
    compliance_score: Math.round((documentedProcesses / Math.max(flexibleAssets.length, 1)) * 100),
    process_types: processTypes as string[],
    recent_updates: flexibleAssets.filter((asset: ITGlueFlexibleAsset) => {
      if (!asset.attributes.updated_at) return false;
      const updatedAt = new Date(asset.attributes.updated_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return updatedAt > thirtyDaysAgo;
    }).length
  };

  console.log('Fetching user data...');
  
  // Fetch users from IT Glue API
  const usersResponse = await fetch(
    `${baseUrl}/users?page[size]=100`,
    { headers }
  );

  if (!usersResponse.ok) {
    console.warn(`IT Glue users API error: ${usersResponse.status} - ${usersResponse.statusText}`);
  }
  
  let usersData;
  try {
    usersData = await usersResponse.json();
  } catch (error) {
    console.warn('Failed to parse IT Glue users JSON:', error);
    usersData = { data: [] };
  }
  
  const users = usersData.data || [];
  
  console.log(`Found ${users.length} users`);

  // Calculate user engagement metrics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const activeUsers = users.filter((user: ITGlueUser) => {
    if (!user.attributes.last_sign_in_at) return false;
    const lastSignIn = new Date(user.attributes.last_sign_in_at);
    return lastSignIn > thirtyDaysAgo;
  }).length;

  const topContributors = users
    .filter((user: ITGlueUser) => user.attributes.name)
    .slice(0, 3)
    .map((user: ITGlueUser) => user.attributes.name || 'Unknown User');

  const userData: ITGlueUserData = {
    total_users: users.length,
    active_users: activeUsers,
    active_user_percentage: users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0,
    top_contributors: topContributors
  };

  console.log('Fetching activity data...');
  
  // Fetch recent activity from IT Glue API
  const activityResponse = await fetch(
    `${baseUrl}/activities?filter[organization_id]=${clientUuid}&page[size]=100`,
    { headers }
  );

  if (!activityResponse.ok) {
    console.warn(`IT Glue activities API error: ${activityResponse.status} - ${activityResponse.statusText}`);
  }
  
  let activityData;
  try {
    activityData = await activityResponse.json();
  } catch (error) {
    console.warn('Failed to parse IT Glue activities JSON:', error);
    activityData = { data: [] };
  }
  
  const activities = activityData.data || [];
  
  console.log(`Found ${activities.length} activities`);

  // Calculate activity metrics
  const recentUpdates = activities.filter((activity: ITGlueActivity) => {
    if (!activity.attributes.created_at) return false;
    const createdAt = new Date(activity.attributes.created_at);
    return createdAt > thirtyDaysAgo;
  }).length;

  // Calculate average documentation age
  const assetAges = assets
    .filter((asset: ITGlueAsset) => asset.attributes.updated_at)
    .map((asset: ITGlueAsset) => {
      const updatedAt = new Date(asset.attributes.updated_at!);
      const now = new Date();
      return Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    });

  const avgDocumentationAge = assetAges.length > 0 
    ? Math.round(assetAges.reduce((sum: number, age: number) => sum + age, 0) / assetAges.length)
    : 0;

  const activityDataObj: ITGlueActivityData = {
    recent_updates: recentUpdates,
    avg_documentation_age: avgDocumentationAge,
    update_frequency: recentUpdates > 0 ? Math.round(30 / recentUpdates) : 0
  };

  console.log('Calculating compliance data...');
  
  // Calculate compliance metrics (simplified - in real implementation, you'd fetch compliance data)
  const complianceData: ITGlueComplianceData = {
    compliance_score: Math.round((documentedAssets / Math.max(assets.length, 1)) * 100),
    compliance_items: assets.length + flexibleAssets.length,
    compliant_items: documentedAssets + documentedProcesses,
    non_compliant_items: undocumentedAssets + (flexibleAssets.length - documentedProcesses),
    categories: ['Asset Documentation', 'Process Documentation', 'Configuration Management', 'Password Management'],
    last_audit: new Date().toISOString().split('T')[0]
  };

  console.log('Getting client name...');
  
  // Get organization name from the organizations list
  const clientsResponse = await fetch(`${baseUrl}/organizations/${clientUuid}`, { headers });
  
  let clientName = 'Unknown Client';
  
  if (!clientsResponse.ok) {
    console.warn(`Client ${clientUuid} not found (${clientsResponse.status}), using first available client`);
    
    // Try to get the first available client instead
    const allClientsResponse = await fetch(`${baseUrl}/organizations?page[size]=1`, { headers });
    if (allClientsResponse.ok) {
      try {
        const allClientsData = await allClientsResponse.json();
        if (allClientsData.data && allClientsData.data.length > 0) {
          clientName = allClientsData.data[0].attributes.name || 'Unknown Client';
          console.log(`Using first available client: ${clientName}`);
        }
      } catch (error) {
        console.error('Failed to get fallback client:', error);
      }
    }
  } else {
    try {
      const clientData = await clientsResponse.json();
      clientName = clientData.data?.attributes?.name || 'Unknown Client';
    } catch (error) {
      console.error('Failed to parse IT Glue client JSON:', error);
      const responseText = await clientsResponse.text();
      console.error('Response text:', responseText);
    }
  }

  // Process documentation summary data (metadata only, no sensitive data)
  const docSummaryNinetyDaysAgo = new Date();
  docSummaryNinetyDaysAgo.setDate(docSummaryNinetyDaysAgo.getDate() - 90);
  
  // SIMPLE CONFIGURATION TEST
  console.log('=== SIMPLE CONFIGURATION TEST ===');
  
  // Step 1: Get configuration types
  console.log(`📋 Found ${configurationTypes.length} configuration types:`);
  configurationTypes.forEach((configType, index) => {
    console.log(`  ${index + 1}. ID: ${configType.id} -> Name: ${configType.attributes.name}`);
  });
  
  // Step 2: Create a simple lookup map
  const configTypeMap = new Map();
  configurationTypes.forEach((configType: ITGlueConfigurationType) => {
    if (configType.attributes.name) {
      configTypeMap.set(configType.id, configType.attributes.name);
    }
  });
  
  // Step 3: Process configurations and create a simple breakdown with expiration tracking
  const configurationsByType: Record<string, number> = {};
  const configurationsByExpiration: Record<string, number> = {
    'Active': 0,
    'Expiring Soon (30 days)': 0,
    'Expired': 0,
    'No Expiration Date': 0
  };
  
  console.log(`🔍 Processing ${allAssets.length} configurations...`);
  
  allAssets.forEach((asset: ITGlueAsset, index: number) => {
    // Try multiple places/field styles for the configuration type information
    const attrs = asset.attributes as unknown as Record<string, unknown>;
    const relationshipTypeId = (asset as any).relationships?.['configuration-type']?.data?.id;
    const attributeTypeId = (attrs && (
      (attrs['configuration-type-id'] as string | number | undefined) ||
      (attrs['asset-type-id'] as string | number | undefined) ||
      (attrs as any).configuration_type_id ||
      (attrs as any).asset_type_id
    )) as string | number | undefined;

    // Prefer explicit attribute type-id, then relationship id
    const typeId = attributeTypeId ?? relationshipTypeId;
    const attributeTypeName = (attrs && (attrs['configuration-type-name'] as string | undefined)) as string | undefined;
    const assetName = asset.attributes.name || 'Unnamed Asset';
    
    // Check for expiration dates
    const expirationDate = (attrs && (
      (attrs['warranty-expires-at'] as string | undefined) ||
      (attrs['mitp-device-expiration-date'] as string | undefined) ||
      (attrs['mitp-end-of-life-date'] as string | undefined) ||
      (attrs['expiration-date'] as string | undefined) ||
      (attrs['expires-on'] as string | undefined) ||
      (attrs['valid-until'] as string | undefined) ||
      (attrs['end-of-life-date'] as string | undefined) ||
      (attrs as any).warranty_expires_at ||
      (attrs as any).mitp_device_expiration_date ||
      (attrs as any).mitp_end_of_life_date ||
      (attrs as any).expiration_date ||
      (attrs as any).expires_on ||
      (attrs as any).valid_until ||
      (attrs as any).end_of_life_date
    )) as string | undefined;
    
    // Determine expiration status
    let expirationStatus = 'No Expiration Date';
    if (expirationDate) {
      try {
        const expiryDate = new Date(expirationDate);
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        if (expiryDate < now) {
          expirationStatus = 'Expired';
        } else if (expiryDate <= thirtyDaysFromNow) {
          expirationStatus = 'Expiring Soon (30 days)';
        } else {
          expirationStatus = 'Active';
        }
      } catch (error) {
        // If date parsing fails, treat as no expiration date
        expirationStatus = 'No Expiration Date';
      }
    }
    
    // Log first few assets to see what we're working with
    if (index < 5) {
      console.log(`Asset ${index + 1}: "${assetName}" - Type ID: ${typeId || 'NOT FOUND'} - Expiration: ${expirationDate || 'None'} (${expirationStatus})`);
      
      // Debug: Show all available attribute keys for the first asset
      if (index === 0) {
        console.log('🔍 DEBUG: First asset attributes keys:', Object.keys(asset.attributes));
        console.log('🔍 DEBUG: First asset full attributes:', JSON.stringify(asset.attributes, null, 2));
        
        // Check for any type-related fields
        const typeRelatedFields = Object.keys(asset.attributes).filter(key => 
          key.toLowerCase().includes('type') || 
          key.toLowerCase().includes('config') || 
          key.toLowerCase().includes('category')
        );
        console.log('🔍 DEBUG: Type-related fields found:', typeRelatedFields);
        
        // Check for any date-related fields
        const dateRelatedFields = Object.keys(asset.attributes).filter(key => 
          key.toLowerCase().includes('expir') || 
          key.toLowerCase().includes('valid') || 
          key.toLowerCase().includes('end') ||
          key.toLowerCase().includes('date')
        );
        console.log('🔍 DEBUG: Date-related fields found:', dateRelatedFields);
        
        // Check the full asset object structure
        console.log('🔍 DEBUG: Full asset object keys:', Object.keys(asset));
        const assetAny = asset as unknown as { relationships?: { [key: string]: unknown } };
        if (assetAny.relationships) {
          console.log('🔍 DEBUG: Asset relationships:', Object.keys(assetAny.relationships));
          console.log('🔍 DEBUG: Configuration type relationship:', JSON.stringify(assetAny.relationships['configuration-type'], null, 2));
        }
      }
    }
    
    // Get the type name from attribute (if present) or the map by id
    const typeName = attributeTypeName || (typeId ? (configTypeMap.get(typeId) || `Type ${typeId}`) : 'Unknown');
    
    // Count by type name
    configurationsByType[typeName] = (configurationsByType[typeName] || 0) + 1;
    
    // Count by expiration status
    configurationsByExpiration[expirationStatus]++;
  });
  
  console.log('📊 Configuration Breakdown by Type:');
  Object.entries(configurationsByType).forEach(([typeName, count]) => {
    console.log(`  ${typeName}: ${count}`);
  });
  
  console.log('\n📅 Configuration Breakdown by Expiration:');
  Object.entries(configurationsByExpiration).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  
  // Show what we have vs what we're missing
  console.log('\n🔍 ANALYSIS:');
  console.log(`✅ Configuration types available: ${configurationTypes.length}`);
  console.log(`✅ Assets found: ${allAssets.length}`);
  console.log(`❌ Assets with type assignments: ${allAssets.filter(asset => {
    const assetAny = asset as unknown as { relationships?: { [key: string]: { data?: { id?: string } } } };
    return assetAny.relationships?.['configuration-type']?.data?.id;
  }).length}`);
  console.log(`❌ Assets without type assignments: ${allAssets.filter(asset => {
    const assetAny = asset as unknown as { relationships?: { [key: string]: { data?: { id?: string } } } };
    return !assetAny.relationships?.['configuration-type']?.data?.id;
  }).length}`);
  
  // Show expiration analysis
  const expiredCount = configurationsByExpiration['Expired'];
  const expiringSoonCount = configurationsByExpiration['Expiring Soon (30 days)'];
  const totalWithExpiration = allAssets.length - configurationsByExpiration['No Expiration Date'];
  
  console.log(`📅 Expiration Analysis:`);
  console.log(`  Assets with expiration dates: ${totalWithExpiration}`);
  console.log(`  Expired assets: ${expiredCount}`);
  console.log(`  Expiring soon: ${expiringSoonCount}`);
  console.log(`  Neglected assets (expired + expiring): ${expiredCount + expiringSoonCount}`);
  
  if (allAssets.length > 0) {
    console.log('\n💡 SUGGESTION:');
    console.log('These assets appear to be test data without proper configuration type assignments.');
    console.log('To see proper configuration breakdown, try a client with categorized assets.');
  }
  
  // Log a summary of what we found
  console.log('=== SUMMARY ===');
  console.log(`Total assets: ${allAssets.length}`);
  console.log(`Configuration types found: ${configurationTypes.length}`);
  console.log(`Assets with type IDs: ${allAssets.filter(asset => {
    const attrs = asset.attributes as Record<string, unknown>;
    const attributeTypeId = attrs?.['configuration-type-id'] || attrs?.['asset-type-id'] || attrs?.configuration_type_id || attrs?.asset_type_id;
    const assetAny = asset as unknown as { relationships?: { [key: string]: { data?: { id?: string } } } };
    const relationshipTypeId = assetAny?.relationships?.['configuration-type']?.data?.id;
    return Boolean(attributeTypeId ?? relationshipTypeId);
  }).length}`);
  console.log(`Assets without type IDs: ${allAssets.filter(asset => {
    const attrs = asset.attributes as Record<string, unknown>;
    const attributeTypeId = attrs?.['configuration-type-id'] || attrs?.['asset-type-id'] || attrs?.configuration_type_id || attrs?.asset_type_id;
    const assetAny = asset as unknown as { relationships?: { [key: string]: { data?: { id?: string } } } };
    const relationshipTypeId = assetAny?.relationships?.['configuration-type']?.data?.id;
    return !Boolean(attributeTypeId ?? relationshipTypeId);
  }).length}`);
  
  // Add a simple test to see what's in the first few assets
  console.log('🔍 QUICK TEST - First 3 assets:');
  allAssets.slice(0, 3).forEach((asset, index) => {
    const attrs = asset.attributes as Record<string, unknown>;
    const attributeTypeId = attrs?.['configuration-type-id'] || attrs?.['asset-type-id'] || attrs?.configuration_type_id || attrs?.asset_type_id;
    const assetAny = asset as unknown as { relationships?: { [key: string]: { data?: { id?: string } } } };
    const relationshipTypeId = assetAny?.relationships?.['configuration-type']?.data?.id;
    const typeId = attributeTypeId ?? relationshipTypeId;
    console.log(`Asset ${index + 1}: "${asset.attributes.name}" - Type ID: ${typeId || 'NOT FOUND'}`);
  });
  
  // Process documents metadata (not available in this IT Glue instance)
  // const totalDocuments = 0; // Unused variable
  // const freshDocuments = 0; // Unused variable
  // const staleDocuments = 0; // Unused variable
  
  // Process passwords metadata (no actual passwords stored)
  const totalPasswords = passwords.length;
  const freshPasswords = passwords.filter((pwd: ITGluePassword) => {
    // Use password-updated-at for password freshness
    const passwordUpdatedAt = pwd.attributes['password-updated-at'] as string | undefined;
    if (!passwordUpdatedAt) return false;
    const passwordDate = new Date(passwordUpdatedAt);
    return passwordDate >= docSummaryNinetyDaysAgo;
  }).length;
  const stalePasswords = totalPasswords - freshPasswords;
  
  // Process SSL certificates metadata with more details
  const totalSSLCertificates = sslCertificates.length;
  const expiringSoonSSLCertificates = sslCertificates.filter((ssl: ITGlueSSLCertificate) => {
    const expiryDate = ssl.attributes['valid-until'] as string | undefined;
    if (!expiryDate) return false;
    const certExpiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return certExpiry <= thirtyDaysFromNow;
  }).length;
  
  // Create detailed SSL certificate list with more information
  const sslCertificateList = sslCertificates.map((ssl: ITGlueSSLCertificate) => {
    const name = (ssl.attributes.name as string) || (ssl.attributes.host as string) || 'Unknown';
    const issuer = (ssl.attributes['issued-by'] as string) || (ssl.attributes['issuer-organization'] as string) || 'Unknown';
    
    // Handle expiry date with proper timezone conversion
    let expiryDate = 'Unknown';
    if (ssl.attributes['valid-until']) {
      const expiryDateObj = new Date(ssl.attributes['valid-until'] as string);
      // Format as YYYY-MM-DD in local timezone
      expiryDate = expiryDateObj.toLocaleDateString('en-CA'); // en-CA format is YYYY-MM-DD
    }
    
    const algorithm = (ssl.attributes['signature-algorithm'] as string) || 'Unknown';
    
    return {
      name,
      issuer,
      expiryDate,
      algorithm,
      displayText: `${name} (${issuer}) - expires: ${expiryDate}`
    };
  }).filter(Boolean);
  
  // Process checklists metadata (not available in this IT Glue instance)
  // const totalChecklists = 0; // Unused variable
  // const completedChecklists = 0; // Unused variable
  // const incompleteChecklists = 0; // Unused variable
  
  // Process domains metadata with more details
  const totalDomains = domains.length;
  const domainList = domains.map((domain: ITGlueDomain) => {
    const name = (domain.attributes.name as string) || 'Unknown';
    const expiryDate = domain.attributes['expires-on'] ? new Date(domain.attributes['expires-on'] as string).toISOString().split('T')[0] : 'Unknown';
    const registrar = (domain.attributes['registrar-name'] as string) || 'Unknown';
    
    return {
      name,
      expiryDate,
      registrar,
      displayText: `${name} (expires: ${expiryDate})`
    };
  }).filter(Boolean);
  
  // Use the detailed flexible assets breakdown we created earlier
  const flexibleAssetsByType: Record<string, number> = {};
  Object.entries(flexibleAssetsDetailed).forEach(([typeName, data]) => {
    flexibleAssetsByType[typeName] = data.count;
  });

  // Calculate overall metrics
  const documentationCompleteness = Math.round(
    ((assetData.documented_assets + processData.documented_processes) / 
     Math.max(assetData.total_assets + processData.total_processes, 1)) * 100
  );

  const assetManagementScore = Math.round((assetData.managed_assets / Math.max(assetData.total_assets, 1)) * 100);
  const processComplianceScore = processData.compliance_score;
  const userEngagementScore = userData.active_user_percentage;

  return {
    assetData,
    processData,
    userData,
    activityData: activityDataObj,
    complianceData,
    documentationSummary: {
      configurations: {
        total: allAssets.length,
        byType: configurationsByType,
        byExpiration: configurationsByExpiration
      },
      domains: {
        total: totalDomains,
        list: domainList
      },

      passwords: {
        total: totalPasswords,
        fresh: freshPasswords,
        stale: stalePasswords
      },

      sslCertificates: {
        total: totalSSLCertificates,
        expiringSoon: expiringSoonSSLCertificates,
        list: sslCertificateList
      },
      flexibleAssets: {
        byType: flexibleAssetsByType,
        detailed: flexibleAssetsDetailed
      }
    },
    overallMetrics: {
      documentation_completeness: documentationCompleteness,
      asset_management_score: assetManagementScore,
      process_compliance_score: processComplianceScore,
      user_engagement_score: userEngagementScore
    },
    lastRefresh: new Date().toISOString(),
    selectedClientUuid: clientUuid,
    selectedClientName: clientName,
          debug: {
        configurationsByType: configurationsByType,
        configTypeMap: Object.fromEntries(configTypeMap),
      sampleAssets: allAssets.slice(0, 3).map((asset: ITGlueAsset) => {
        const attrs = asset.attributes as Record<string, unknown>;
        const attributeTypeId = attrs?.['configuration-type-id'] || attrs?.['asset-type-id'] || attrs?.configuration_type_id || attrs?.asset_type_id;
        const assetAny = asset as unknown as { relationships?: { [key: string]: { data?: { id?: string } } } };
        const relationshipTypeId = assetAny?.relationships?.['configuration-type']?.data?.id;
        return {
          name: asset.attributes.name,
          typeId: (attributeTypeId ?? relationshipTypeId) as string | number | undefined,
          allAttributes: Object.keys(asset.attributes)
        };
      })
    }
  };
}

async function updateITGlueReport(liveData: ITGlueLiveData) {
  const jsonPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/json/qbr-report-itglue.json');
  
  // Read current JSON template
  const templateData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Process template with live data
  const processedData = processTemplate(templateData, liveData);

  // Return the processed data instead of writing to file (Vercel has read-only filesystem)
  return {
    success: true,
    message: 'IT Glue QBR data processed successfully',
    data: processedData,
    debug: {
      assetCount: liveData.assetData.total_assets,
      documentedAssets: liveData.assetData.documented_assets,
      activeUsers: liveData.userData.active_users,
      sampleProcesses: liveData.processData.process_types.slice(0, 3)
    }
  };
}

function processTemplate(template: unknown, liveData: ITGlueLiveData): unknown {
  // Create a deep copy to avoid mutating the template
  const processed = JSON.parse(JSON.stringify(template));
  
  // Debug: Log the configuration data we're working with
  console.log('🔍 TEMPLATE PROCESSING DEBUG:');
  console.log('configurationsByType:', liveData.documentationSummary.configurations.byType);
  console.log('configurationsTotal:', liveData.documentationSummary.configurations.total);
  
  // Add a simple test to see what's in the configurationsByType object
  console.log('🚨 CRITICAL: configurationsByType keys:', Object.keys(liveData.documentationSummary.configurations.byType || {}));
  console.log('🚨 CRITICAL: configurationsByType values:', Object.values(liveData.documentationSummary.configurations.byType || {}));
  
  // Add a simple test to see what's in the configurationsByType object
  console.log('🚨 CRITICAL: configurationsByType content:', JSON.stringify(liveData.documentationSummary.configurations.byType, null, 2));
  
  // Calculate derived values
  const calculations = calculateDerivedValues(liveData);
  
  // Create a data context for placeholder replacement
  const dataContext = {
    ...liveData,
    calculated: calculations,
    
    // Debug: Log what's in the configurationsByType object
    debugConfigs: () => {
      console.log('🔍 DEBUG: configurationsByType content:', liveData.documentationSummary.configurations.byType);
      return 'DEBUG LOGGED';
    },
    // Add type-safe conversions for string comparisons
    documentationCompleteness: liveData.overallMetrics.documentation_completeness,
    totalAssets: liveData.assetData.total_assets,
    documentedAssets: liveData.assetData.documented_assets,
    managedAssets: liveData.assetData.managed_assets,
    activeUsers: liveData.userData.active_users,
    recentUpdates: liveData.activityData.recent_updates,
    documentedProcesses: liveData.processData.documented_processes,
    complianceScore: liveData.complianceData.compliance_score,
    undocumentedAssets: liveData.assetData.undocumented_assets,
    outdatedProcesses: liveData.processData.outdated_processes,
    activeUserPercentage: liveData.userData.active_user_percentage,
    avgDocumentationAge: liveData.activityData.avg_documentation_age,
    complianceItems: liveData.complianceData.compliance_items,
    // Add calculated adjectives and trends
    documentationAdjective: calculations.documentationAdjective,
    engagementAdjective: calculations.engagementAdjective,
    documentationTrend: calculations.documentationTrend,
    assetManagementTrend: calculations.assetManagementTrend,
    complianceTrend: calculations.complianceTrend,
    engagementTrend: calculations.engagementTrend,
    freshnessTrend: calculations.freshnessTrend,
    undocumentedAssetSeverity: calculations.undocumentedAssetSeverity,
    outdatedProcessSeverity: calculations.outdatedProcessSeverity,
    userEngagementSeverity: calculations.userEngagementSeverity,
    // Add status mappings
    assetDocumentationStatus: liveData.assetData.documented_assets > 0 ? 'satisfactory' : 'needs_attention',
    processDocumentationStatus: liveData.processData.documented_processes > 0 ? 'satisfactory' : 'needs_attention',
    configManagementStatus: liveData.assetData.network_assets > 0 ? 'satisfactory' : 'needs_attention',
    passwordManagementStatus: liveData.assetData.software_assets > 0 ? 'satisfactory' : 'needs_attention',
    vendorDocumentationStatus: liveData.assetData.hardware_assets > 0 ? 'satisfactory' : 'needs_attention',
    hardwareAssetStatus: liveData.assetData.hardware_assets > 0 ? 'satisfactory' : 'needs_attention',
    softwareAssetStatus: liveData.assetData.software_assets > 0 ? 'satisfactory' : 'needs_attention',
    networkAssetStatus: liveData.assetData.network_assets > 0 ? 'satisfactory' : 'needs_attention',
    cloudAssetStatus: liveData.assetData.cloud_assets > 0 ? 'satisfactory' : 'needs_attention',
    docStandardsStatus: liveData.complianceData.compliance_score > 70 ? 'satisfactory' : 'needs_attention',
    processAdoptionStatus: liveData.userData.active_users > 0 ? 'satisfactory' : 'needs_attention',
    userEngagementStatus: liveData.activityData.recent_updates > 0 ? 'satisfactory' : 'needs_attention',
    updateFrequencyStatus: liveData.activityData.avg_documentation_age < 30 ? 'satisfactory' : 'needs_attention',
    // Add missing placeholders
    documentedConfigs: liveData.assetData.network_assets,
    managedPasswords: liveData.assetData.software_assets,
    documentedVendors: liveData.assetData.hardware_assets,
    hardwareAssets: liveData.assetData.hardware_assets,
    softwareAssets: liveData.assetData.software_assets,
    networkAssets: liveData.assetData.network_assets,
    cloudAssets: liveData.assetData.cloud_assets,
    lastRefresh: liveData.lastRefresh,
    selectedClientUuid: liveData.selectedClientUuid,
    // Add documentation summary placeholders
    configurationsTotal: liveData.documentationSummary.configurations.total,
    configurationsByType: liveData.documentationSummary.configurations.byType,
    configurationsByExpiration: liveData.documentationSummary.configurations.byExpiration,
    flexibleAssetsDetailed: liveData.documentationSummary.flexibleAssets.detailed,
    domainsTotal: liveData.documentationSummary.domains.total,
    domainsList: liveData.documentationSummary.domains.list,

    passwordsTotal: liveData.documentationSummary.passwords.total,
    passwordsFresh: liveData.documentationSummary.passwords.fresh,
    passwordsStale: liveData.documentationSummary.passwords.stale,

    sslCertificatesTotal: liveData.documentationSummary.sslCertificates.total,
    sslCertificatesExpiringSoon: liveData.documentationSummary.sslCertificates.expiringSoon,
    sslCertificatesList: liveData.documentationSummary.sslCertificates.list,
    flexibleAssetsByType: liveData.documentationSummary.flexibleAssets.byType,
    
    // Add calculated values for template placeholders
    configurationsExpired: liveData.documentationSummary.configurations.byExpiration.Expired || 0,
    configurationsExpiringSoon: liveData.documentationSummary.configurations.byExpiration['Expiring Soon (30 days)'] || 0,
    configurationsExpiredPercentage: Math.round(((liveData.documentationSummary.configurations.byExpiration.Expired || 0) / liveData.documentationSummary.configurations.total) * 100),
    configurationsTypeCount: Object.keys(liveData.documentationSummary.configurations.byType).length,
    flexibleAssetsTotal: Object.values(liveData.documentationSummary.flexibleAssets.byType).reduce((sum: number, count: unknown) => sum + Number(count), 0),
    flexibleAssetTypesCount: Object.keys(liveData.documentationSummary.flexibleAssets.byType).length,
    
    // Add trend calculations
    configurationsExpiredTrend: (liveData.documentationSummary.configurations.byExpiration.Expired || 0) > 50 ? 'needs_attention' : 'positive',
    sslCertificatesExpiringSoonTrend: (liveData.documentationSummary.sslCertificates.expiringSoon || 0) > 0 ? 'needs_attention' : 'positive',
    passwordsStaleTrend: (liveData.documentationSummary.passwords.stale || 0) > 0 ? 'needs_attention' : 'positive'
  };

  // Process the entire template recursively
  console.log('Data context keys:', Object.keys(dataContext));
  console.log('Sample data context values:', {
    documentationCompleteness: dataContext.documentationCompleteness,
    totalAssets: dataContext.totalAssets,
    documentedAssets: dataContext.documentedAssets
  });
  
  const processedData = processObject(processed, dataContext) as Record<string, unknown>;
  
  // Add back the detailed live data sections
  (processedData as Record<string, unknown>).documentationMetrics = {
    totalAssets: liveData.assetData.total_assets,
    documentedAssets: liveData.assetData.documented_assets,
    undocumentedAssets: liveData.assetData.undocumented_assets,
    completenessRate: `${liveData.overallMetrics.documentation_completeness}%`,
    assetTypes: liveData.assetData.asset_types,
    managedAssets: liveData.assetData.managed_assets,
    managementRate: `${liveData.assetData.managed_assets > 0 ? Math.round((liveData.assetData.managed_assets / liveData.assetData.total_assets) * 100) : 0}%`
  };
  
  (processedData as Record<string, unknown>).processManagement = {
    totalProcesses: liveData.processData.total_processes,
    documentedProcesses: liveData.processData.documented_processes,
    outdatedProcesses: liveData.processData.outdated_processes,
    complianceScore: liveData.processData.compliance_score,
    processTypes: liveData.processData.process_types,
    recentUpdates: liveData.processData.recent_updates
  };
  
  (processedData as Record<string, unknown>).userEngagement = {
    totalUsers: liveData.userData.total_users,
    activeUsers: liveData.userData.active_users,
    activeUserPercentage: `${liveData.userData.active_user_percentage}%`,
    recentUpdates: liveData.activityData.recent_updates,
    avgDocumentationAge: liveData.activityData.avg_documentation_age,
    topContributors: liveData.userData.top_contributors
  };
  
  (processedData as Record<string, unknown>).complianceCoverage = {
    totalItems: liveData.complianceData.compliance_items,
    compliantItems: liveData.complianceData.compliant_items,
    nonCompliantItems: liveData.complianceData.non_compliant_items,
    complianceRate: `${liveData.complianceData.compliance_score}%`,
    categories: liveData.complianceData.categories,
    lastAudit: liveData.complianceData.last_audit
  };

  // Ensure SSL certificate list is preserved as an object
  if ((processedData as Record<string, unknown>).documentationSummary && 
      typeof (processedData as Record<string, unknown>).documentationSummary === 'object') {
    const docSummary = (processedData as Record<string, unknown>).documentationSummary as Record<string, unknown>;
    if (docSummary.sslCertificates && typeof docSummary.sslCertificates === 'object') {
      const sslCerts = docSummary.sslCertificates as Record<string, unknown>;
      // Ensure the list is preserved as an array of objects, not a JSON string
      sslCerts.list = liveData.documentationSummary.sslCertificates.list;
    }
    if (docSummary.domains && typeof docSummary.domains === 'object') {
      const domains = docSummary.domains as Record<string, unknown>;
      // Ensure the list is preserved as an array of objects, not a JSON string
      domains.list = liveData.documentationSummary.domains.list;
    }
    if (docSummary.configurations && typeof docSummary.configurations === 'object') {
      const configs = docSummary.configurations as Record<string, unknown>;
      // Ensure byExpiration is preserved as an object, not a JSON string
      configs.byExpiration = liveData.documentationSummary.configurations.byExpiration;
    }
  }


  
  return processedData;
}

function calculateDerivedValues(liveData: ITGlueLiveData) {
  const documentationCoverage = liveData.assetData.total_assets > 0 
    ? Math.round((liveData.assetData.documented_assets / liveData.assetData.total_assets) * 100) 
    : 0;

  const assetManagement = liveData.assetData.total_assets > 0 
    ? Math.round((liveData.assetData.managed_assets / liveData.assetData.total_assets) * 100) 
    : 0;

  const documentationAdjective = liveData.overallMetrics.documentation_completeness > 80 ? 'excellent' : 
                                 liveData.overallMetrics.documentation_completeness > 60 ? 'good' : 'fair';

  const engagementAdjective = liveData.userData.active_user_percentage > 80 ? 'strong' : 
                             liveData.userData.active_user_percentage > 50 ? 'moderate' : 'limited';

  const documentationTrend = liveData.overallMetrics.documentation_completeness > 80 ? 'positive' : 
                             liveData.overallMetrics.documentation_completeness > 60 ? 'neutral' : 'negative';

  const assetManagementTrend = assetManagement > 80 ? 'positive' : 
                               assetManagement > 60 ? 'neutral' : 'negative';

  const complianceTrend = liveData.complianceData.compliance_score > 80 ? 'positive' : 
                          liveData.complianceData.compliance_score > 60 ? 'neutral' : 'negative';

  const engagementTrend = liveData.userData.active_user_percentage > 80 ? 'positive' : 
                          liveData.userData.active_user_percentage > 50 ? 'neutral' : 'negative';

  const freshnessTrend = liveData.activityData.avg_documentation_age < 30 ? 'positive' : 
                         liveData.activityData.avg_documentation_age < 90 ? 'neutral' : 'negative';

  const undocumentedAssetSeverity = liveData.assetData.undocumented_assets > 10 ? 'high' : 
                                   liveData.assetData.undocumented_assets > 5 ? 'medium' : 'low';

  const outdatedProcessSeverity = liveData.processData.outdated_processes > 5 ? 'high' : 
                                 liveData.processData.outdated_processes > 2 ? 'medium' : 'low';

  const userEngagementSeverity = liveData.userData.active_user_percentage < 30 ? 'high' : 
                                liveData.userData.active_user_percentage < 50 ? 'medium' : 'low';

  return {
    documentationCoverage,
    assetManagement,
    documentationAdjective,
    engagementAdjective,
    documentationTrend,
    assetManagementTrend,
    complianceTrend,
    engagementTrend,
    freshnessTrend,
    undocumentedAssetSeverity,
    outdatedProcessSeverity,
    userEngagementSeverity
  };
}

function processObject(obj: unknown, dataContext: Record<string, unknown>): unknown {
  if (typeof obj === 'string') {
    return replacePlaceholders(obj, dataContext);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processObject(item, dataContext));
  }
  
  if (obj && typeof obj === 'object') {
    const processed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      processed[key] = processObject(value, dataContext);
    }
    return processed;
  }
  
  return obj;
}

function replacePlaceholders(template: string, dataContext: Record<string, unknown>): string {
  return template.replace(/\{([^}]+)\}/g, (match, placeholder) => {
    // Handle nested object properties (e.g., configurationsHealth.active)
    const keys = placeholder.split('.');
    let value: unknown = dataContext;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        value = undefined;
        break;
      }
    }
    
    console.log(`Replacing ${match} with ${value} (placeholder: ${placeholder})`);
    if (value !== undefined) {
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return String(value);
    }
    return match;
  });
}
