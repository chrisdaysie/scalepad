# JSON-First Approach for Cork QBR Reports

## 🎯 Overview

The Cork QBR module now uses a **JSON-first approach** that separates content (JSON template) from data (live API data). This enables better collaboration with Cork on report design while maintaining real-time data integration.

## 🔄 How It Works

### 1. **Template Structure**
The JSON file (`qbr-report-cork.json`) contains:
- **Static Content**: Labels, narratives, structure
- **Placeholders**: `{placeholderName}` syntax for dynamic data
- **Calculations**: Formulas for derived values
- **Conditions**: Logic for conditional content

### 2. **Live Data Processing**
When a refresh is triggered:
1. **Read Template**: Load JSON with placeholders
2. **Fetch Live Data**: Get real metrics from Cork API
3. **Process Template**: Replace placeholders with live data
4. **Update JSON**: Write processed data back to file
5. **Display Report**: User sees updated content

## 📋 Template Components

### **Placeholders**
Use `{placeholderName}` syntax for dynamic data:

```json
{
  "heroMetric": {
    "value": "{coveragePercent}%",
    "description": "{deviceCount} endpoints with {integrationCount} active integrations"
  }
}
```

### **Available Placeholders**
- `{coveragePercent}` - Overall security coverage percentage
- `{deviceCount}` - Total number of devices
- `{integrationCount}` - Active integrations count
- `{totalEventCount}` - Total security events
- `{resolvedEventCount}` - Resolved events count
- `{unresolvedEventCount}` - Unresolved events count
- `{eventResolutionRate}` - Event resolution percentage
- `{totalAssetCount}` - Total assets (devices + domains + inboxes)
- `{domainCount}` - Number of email domains
- `{inboxCount}` - Number of email inboxes
- `{activeWarrantyCount}` - Active warranties count
- `{totalWarrantyCount}` - Total warranties count
- `{warrantyCoverageRate}` - Warranty coverage percentage

### **Calculated Values**
- `{coverageAdjective}` - "excellent", "good", or "fair" based on coverage
- `{responseAdjective}` - "highly responsive", "responsive", or "limited"
- `{coverageTrend}` - "positive", "neutral", or "negative"
- `{integrationHealthTrend}` - Trend based on integration health
- `{eventResponseTrend}` - Trend based on event response rate
- `{warrantyTrend}` - Trend based on warranty coverage

### **Status Mappings**
- `{endpointDetectionStatus}` - "satisfactory" or "needs_attention"
- `{threatPreventionStatus}` - Based on protected devices
- `{edrStatus}` - Based on EDR device types
- `{bcdrStatus}` - Based on BCDR device types
- `{rmmStatus}` - Based on RMM device types
- `{emailSecurityStatus}` - Based on domain count

## 🎨 Editable Sections

Cork can modify these sections in the JSON:

### **Executive Summary**
```json
{
  "executiveSummary": "Your organization demonstrates {coverageAdjective} security posture with comprehensive endpoint protection and active threat monitoring. The security stack provides {deviceProtectionRate}% device coverage with {activeIntegrationCount} active integrations delivering multi-layered protection across {domainCount} domains."
}
```

### **Insights**
```json
{
  "enhancedSections": {
    "insights": [
      {
        "title": "Overall Security Coverage",
        "description": "{coveragePercent}% overall security coverage with {deviceCount} devices and {integrationCount} active integrations.",
        "metric": "{coveragePercent}% Coverage",
        "trend": "{coverageTrend}"
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
        "title": "Address Email Configuration Issues",
        "description": "Resolve {insecureEmailCount} insecure email configuration events to improve email deliverability and prevent spoofing attacks.",
        "priority": "high",
        "effort": "Medium",
        "impact": "Improve email deliverability and prevent spoofing attacks"
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
        "title": "Outstanding Security Events",
        "description": "{unresolvedEventCount} unresolved security events requiring immediate attention and remediation.",
        "severity": "{unresolvedEventSeverity}",
        "impact": "Ongoing security risk exposure and potential compliance violations."
      }
    ]
  }
}
```

## 🔧 Technical Implementation

### **Template Processing Flow**
```typescript
// 1. Read template
const templateData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 2. Fetch live data
const liveData = await fetchCorkLiveData(apiKey, baseUrl, clientUuid);

// 3. Process template
const processedData = processTemplate(templateData, liveData);

// 4. Write processed data
fs.writeFileSync(jsonPath, JSON.stringify(processedData, null, 2));
```

### **Placeholder Replacement**
```typescript
function replacePlaceholders(template: string, dataContext: any): string {
  return template.replace(/\{([^}]+)\}/g, (match, placeholder) => {
    const value = getNestedValue(dataContext, placeholder);
    return value !== undefined ? String(value) : match;
  });
}
```

### **Data Context Structure**
```typescript
const dataContext = {
  // Live API data
  overallMetrics: { security_coverage: 92, event_resolution_rate: 85 },
  endpointData: { total_devices: 10, protected_devices: 10 },
  integrations: { active: 10, total: 10 },
  securityMetrics: { total_events: 5, resolved_events: 4 },
  
  // Calculated values
  calculated: {
    coverageAdjective: 'excellent',
    responseAdjective: 'highly responsive',
    coverageTrend: 'positive'
  },
  
  // Flattened placeholders
  coveragePercent: 92,
  deviceCount: 10,
  integrationCount: 10
};
```

## 🚀 Benefits

### **For Cork (Vendor)**
- **Content Control**: Edit narratives, messaging, and structure
- **Easy Collaboration**: JSON format is human-readable
- **Version Control**: Track changes to report content
- **Rapid Iteration**: Test different messaging without code changes

### **For Development**
- **Separation of Concerns**: Content vs. data logic
- **Maintainability**: Clear template structure
- **Flexibility**: Easy to add new placeholders
- **Performance**: Fast initial load with JSON

### **For Users**
- **Real-time Data**: Live metrics still update automatically
- **Consistent Experience**: Same UI with dynamic content
- **Reliable Performance**: No API calls for static content

## 📝 Best Practices

### **For Cork Content Editors**
1. **Use Placeholders**: Replace hardcoded values with `{placeholderName}`
2. **Test Conditions**: Ensure conditional content works with live data
3. **Maintain Structure**: Don't change required JSON structure
4. **Version Control**: Track changes to templates

### **For Developers**
1. **Add New Placeholders**: Update `dataMapping.placeholders`
2. **Add Calculations**: Update `dataMapping.calculations`
3. **Test Processing**: Verify template processing works correctly
4. **Document Changes**: Update this documentation

## 🔄 Live Refresh Process

### **Manual Refresh**
1. User clicks "Refresh Live Data" button
2. API fetches latest data from Cork
3. Template processes with new data
4. JSON file updates with processed content
5. Page reloads to show updated report

### **Automatic Refresh**
- Configured via `liveData.refreshInterval` (currently 3600 seconds)
- Background process updates data periodically
- Users see "Last refreshed: [timestamp]"

## 🛠️ Troubleshooting

### **Common Issues**
1. **Placeholder Not Replaced**: Check placeholder name in `dataMapping.placeholders`
2. **Calculation Errors**: Verify calculation logic in `dataMapping.calculations`
3. **Type Errors**: Ensure data types match expected values
4. **Missing Data**: Check API responses for required fields

### **Debug Steps**
1. Check browser console for errors
2. Verify API responses in Network tab
3. Review processed JSON file content
4. Test placeholder replacement manually

## 📚 Related Files

- **Template**: `src/app/lmx/deliverables/data/json/qbr-report-cork.json`
- **Processing Logic**: `src/app/api/deliverables/cork/refresh/route.ts`
- **Frontend**: `src/app/lmx/deliverables/qbr/[id]/page.tsx`
- **API Documentation**: `src/app/lmx/deliverables/documentation/cork-api.json`

## 🎯 Next Steps

1. **Cork Collaboration**: Share template with Cork for content review
2. **Content Iteration**: Refine narratives and messaging
3. **Placeholder Expansion**: Add more dynamic data points
4. **Template Versioning**: Implement template version control
5. **Multi-Client Support**: Extend to other client reports
