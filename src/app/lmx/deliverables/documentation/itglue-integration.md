# IT Glue Integration for QBR Reports

## 🎯 Overview

The IT Glue QBR module provides documentation-focused business intelligence by integrating with the IT Glue API to fetch real-time documentation metrics, asset management data, and process compliance information.

## 🔄 How It Works

### 1. **Documentation-First Approach**
The IT Glue QBR report focuses on documentation quality and completeness:
- **Asset Documentation**: Tracks hardware, software, network, and cloud assets
- **Process Documentation**: Monitors documented procedures and workflows
- **User Engagement**: Measures team participation in documentation
- **Compliance Tracking**: Ensures documentation meets standards

### 2. **Live Data Integration**
When a refresh is triggered:
1. **Fetch Assets**: Get all assets from IT Glue for the selected client
2. **Fetch Processes**: Retrieve flexible assets (processes, configurations)
3. **Fetch Users**: Get user activity and engagement metrics
4. **Fetch Activities**: Track recent documentation updates
5. **Process Template**: Replace placeholders with live data
6. **Display Report**: Show updated documentation metrics

## 📋 Key Metrics

### **Documentation Coverage**
- **Total Assets**: All assets in the organization
- **Documented Assets**: Assets with proper names/descriptions
- **Undocumented Assets**: Assets lacking proper documentation
- **Completeness Rate**: Percentage of documented assets

### **Asset Management**
- **Hardware Assets**: Servers, workstations, laptops, desktops
- **Software Assets**: Applications, licenses, software tools
- **Network Assets**: Switches, routers, firewalls, network devices
- **Cloud Assets**: Cloud services, AWS, Azure, GCP resources

### **Process Management**
- **Total Processes**: All flexible assets (procedures, configurations)
- **Documented Processes**: Processes with proper documentation
- **Outdated Processes**: Processes not updated in 90+ days
- **Compliance Score**: Percentage of compliant processes

### **User Engagement**
- **Total Users**: All users in IT Glue
- **Active Users**: Users with recent sign-in activity
- **Engagement Rate**: Percentage of active users
- **Top Contributors**: Most active documentation contributors

## 🎨 Editable Sections

IT Glue can modify these sections in the JSON template:

### **Executive Summary**
```json
{
  "executiveSummary": "Your organization demonstrates {documentationAdjective} documentation practices with comprehensive asset management and process tracking. The IT Glue platform manages {totalAssets} assets with {documentedAssets} fully documented, achieving {documentationCompleteness}% overall documentation completeness."
}
```

### **Insights**
```json
{
  "enhancedSections": {
    "insights": [
      {
        "title": "Overall Documentation Coverage",
        "description": "{documentationCompleteness}% overall documentation coverage with {totalAssets} assets and {documentedAssets} fully documented.",
        "metric": "{documentationCompleteness}% Coverage",
        "trend": "{documentationTrend}"
      }
    ]
  }
}
```

### **Recommendations**
```json
{
  "enhancedSections": {
    "recommendations": [
      {
        "title": "Complete Asset Documentation",
        "description": "Document {undocumentedAssets} remaining assets to achieve 100% documentation coverage and reduce operational risks.",
        "priority": "high",
        "effort": "Medium",
        "impact": "Improved operational efficiency and reduced downtime risk"
      }
    ]
  }
}
```

### **Risks**
```json
{
  "enhancedSections": {
    "risks": [
      {
        "title": "Incomplete Asset Documentation",
        "description": "{undocumentedAssets} assets lack proper documentation, creating operational risks and compliance gaps.",
        "severity": "{undocumentedAssetSeverity}",
        "impact": "Increased downtime risk, compliance violations, and knowledge gaps during staff transitions."
      }
    ]
  }
}
```

## 🔧 Technical Implementation

### **API Endpoints**
- `/api/deliverables/itglue/clients` - Fetches available organizations
- `/api/deliverables/itglue/refresh` - Refreshes live documentation data

### **Data Processing Flow**
```typescript
// 1. Fetch assets from IT Glue
const assets = await fetch(`${baseUrl}/assets?filter[organization_id]=${clientUuid}`);

// 2. Calculate documentation metrics
const documentedAssets = assets.filter(asset => asset.attributes.name).length;
const undocumentedAssets = assets.length - documentedAssets;

// 3. Process template with live data
const processedData = processTemplate(templateData, liveData);

// 4. Return processed report
return processedData;
```

### **Asset Categorization**
Assets are automatically categorized based on their names:
- **Hardware**: Contains "server", "workstation", "laptop", "desktop"
- **Software**: Contains "software", "application", "license"
- **Network**: Contains "switch", "router", "firewall", "network"
- **Cloud**: Contains "cloud", "aws", "azure", "gcp"

## 🚀 Benefits

### **For IT Glue Users**
- **Documentation Quality**: Track completeness and quality of documentation
- **Compliance Monitoring**: Ensure documentation meets standards
- **User Engagement**: Monitor team participation in documentation
- **Process Improvement**: Identify outdated or missing procedures

### **For MSPs**
- **Client Value**: Demonstrate documentation value to clients
- **Operational Efficiency**: Identify documentation gaps and risks
- **Compliance Reporting**: Generate compliance reports for audits
- **Process Optimization**: Improve documentation workflows

### **For Business Intelligence**
- **Real-time Metrics**: Live documentation quality metrics
- **Trend Analysis**: Track documentation improvements over time
- **Risk Assessment**: Identify documentation-related risks
- **Resource Planning**: Plan documentation improvement initiatives

## 📝 Best Practices

### **For Documentation Quality**
1. **Consistent Naming**: Use consistent naming conventions for all assets
2. **Regular Updates**: Update documentation at least quarterly
3. **Process Documentation**: Document all key procedures and workflows
4. **User Training**: Train users on proper documentation practices

### **For API Integration**
1. **Rate Limiting**: Respect IT Glue API rate limits
2. **Error Handling**: Implement proper error handling for API failures
3. **Data Caching**: Cache responses to improve performance
4. **Security**: Secure API keys and access credentials

## 🔄 Live Refresh Process

### **Manual Refresh**
1. User clicks "Refresh Live Data" button
2. API fetches latest data from IT Glue
3. Template processes with new data
4. Report updates with processed content
5. Page reloads to show updated metrics

### **Automatic Refresh**
- Configured via `liveData.refreshInterval` (currently 3600 seconds)
- Background process updates data periodically
- Users see "Last refreshed: [timestamp]"

## 🛠️ Setup Instructions

### **1. Environment Configuration**
Add to `.env.local`:
```env
ITGLUE_API_KEY=your_itglue_api_key_here
ITGLUE_BASE_URL=https://api.itglue.com
```

### **2. API Key Setup**
1. Log into your IT Glue instance
2. Navigate to Admin → API Keys
3. Create a new API key with appropriate permissions
4. Copy the API key to your environment variables

### **3. Access Report**
Navigate to `/lmx/deliverables/qbr/qbr-report-itglue`

### **4. Use Live Controls**
- Select client organization from dropdown
- Click "Refresh Data" to update metrics
- View real-time documentation quality metrics

## 📊 Sample Metrics

### **Documentation Quality**
- **Total Assets**: 150
- **Documented Assets**: 120 (80%)
- **Undocumented Assets**: 30 (20%)
- **Asset Types**: Hardware (45), Software (60), Network (25), Cloud (20)

### **Process Management**
- **Total Processes**: 25
- **Documented Processes**: 20 (80%)
- **Outdated Processes**: 5 (20%)
- **Compliance Score**: 85%

### **User Engagement**
- **Total Users**: 15
- **Active Users**: 10 (67%)
- **Recent Updates**: 45 in last 30 days
- **Average Documentation Age**: 45 days

### **Compliance Coverage**
- **Total Items**: 50
- **Compliant Items**: 42 (84%)
- **Non-Compliant Items**: 8 (16%)
- **Last Audit**: 2025-07-15

## 🎯 Next Steps

1. **IT Glue Collaboration**: Share template with IT Glue for content review
2. **Content Iteration**: Refine narratives and messaging
3. **Metric Expansion**: Add more documentation quality metrics
4. **Automation**: Implement automated documentation quality alerts
5. **Multi-Client Support**: Extend to other client organizations

## 📚 Related Files

- **Template**: `src/app/lmx/deliverables/data/json/qbr-report-itglue.json`
- **API Endpoints**: `src/app/api/deliverables/itglue/`
- **API Documentation**: `src/app/lmx/deliverables/documentation/itglue-api.json`
- **Frontend**: `src/app/lmx/deliverables/qbr/[id]/page.tsx`

## 🔍 Troubleshooting

### **Common Issues**
1. **API Key Errors**: Verify IT Glue API key is correct and has proper permissions
2. **Rate Limiting**: Reduce refresh frequency if hitting rate limits
3. **Missing Data**: Check organization ID and ensure client exists in IT Glue
4. **Template Errors**: Verify JSON template syntax and placeholder names

### **Debug Steps**
1. Check browser console for API errors
2. Verify API responses in Network tab
3. Review processed JSON file content
4. Test API endpoints manually with curl or Postman

---

**Built with ❤️ for better documentation management**
