import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mock IT Glue data for testing
const mockITGlueData = {
  assetData: {
    total_assets: 150,
    documented_assets: 120,
    undocumented_assets: 30,
    managed_assets: 135,
    hardware_assets: 45,
    software_assets: 60,
    network_assets: 25,
    cloud_assets: 20,
    asset_types: {
      hardware: 45,
      software: 60,
      network: 25,
      cloud: 20
    }
  },
  processData: {
    total_processes: 25,
    documented_processes: 20,
    outdated_processes: 5,
    compliance_score: 85,
    process_types: [
      "Incident Response",
      "Change Management", 
      "Backup Procedures",
      "Security Protocols",
      "User Onboarding"
    ],
    recent_updates: 12
  },
  userData: {
    total_users: 15,
    active_users: 10,
    active_user_percentage: 67,
    top_contributors: [
      "John Smith",
      "Sarah Johnson", 
      "Mike Davis"
    ]
  },
  activityData: {
    recent_updates: 45,
    avg_documentation_age: 45,
    update_frequency: 1
  },
  complianceData: {
    compliance_score: 84,
    compliance_items: 50,
    compliant_items: 42,
    non_compliant_items: 8,
    categories: [
      "Security Policies",
      "Data Protection", 
      "Access Controls",
      "Audit Procedures"
    ],
    last_audit: "2025-07-15"
  },
  overallMetrics: {
    documentation_completeness: 80,
    asset_management_score: 90,
    process_compliance_score: 85,
    user_engagement_score: 67
  },
  lastRefresh: new Date().toISOString(),
  selectedClientUuid: "test-client-123",
  selectedClientName: "Test Organization"
};

export async function POST(_request: NextRequest) {
  try {
    console.log('Testing IT Glue template processing with mock data...');
    
    // Process the IT Glue QBR template with mock data
    const result = await updateITGlueReport(mockITGlueData);
    
    console.log('IT Glue template processing test completed successfully');

    return NextResponse.json({
      success: true,
      data: result.data,
      mockData: mockITGlueData,
      message: 'IT Glue template processing test completed successfully',
    });

  } catch (error) {
    console.error('Error testing IT Glue template processing:', error);
    return NextResponse.json(
      { error: `Failed to test IT Glue template processing: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

async function updateITGlueReport(liveData: Record<string, unknown>) {
  const jsonPath = path.join(process.cwd(), 'src/app/lmx/deliverables/data/json/qbr-report-itglue.json');
  
  // Read current JSON template
  const templateData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Process template with live data
  const processedData = processTemplate(templateData, liveData);

  // Return the processed data
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

function processTemplate(template: unknown, liveData: Record<string, unknown>): unknown {
  // Create a deep copy to avoid mutating the template
  const processed = JSON.parse(JSON.stringify(template));
  
  // Calculate derived values
  const calculations = calculateDerivedValues(liveData);
  
  // Create a data context for placeholder replacement
  const dataContext = {
    ...liveData,
    calculated: calculations,
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
    selectedClientUuid: liveData.selectedClientUuid
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
  
  return processedData;
}

function calculateDerivedValues(liveData: any) {
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
    const value = dataContext[placeholder];
    console.log(`Replacing ${match} with ${value} (placeholder: ${placeholder})`);
    return value !== undefined ? String(value) : match;
  });
}
