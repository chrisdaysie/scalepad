# QBR Reports Management

This document explains how to manage Quarterly Business Review (QBR) reports in the Lifecycle Manager X system.

## Overview

QBR reports are stored in JSON configuration files and served through a Next.js API. The system supports two types of reports:

- **Individual Reports**: Single-platform reports (e.g., Backup Radar, Cork Enhanced)
- **Aggregate Reports**: Multi-platform comprehensive reports (e.g., Moneta)

**Live Data Integration**: Some reports (like Cork) support real-time data refresh from external APIs with interactive controls in the browser.

## File Structure

```
src/app/lmx/deliverables/
├── data/
│   ├── qbr-configs.json          # Main QBR configuration file
│   └── json/
│       └── qbr-report-cork.json  # Cork report with live data
├── qbr/
│   └── [id]/
│       └── page.tsx              # Dynamic QBR viewer with live controls
├── documentation/
│   └── cork-api.json             # Cork API specification
└── README.md                     # This documentation
```

## Adding New QBR Reports

### Method 1: Using the CLI Script (Recommended)

1. **Run the add script:**
   ```bash
   node scripts/add-qbr-report.js <report-id> <company-name> [type]
   ```

2. **Examples:**
   ```bash
   # Add individual report
   node scripts/add-qbr-report.js qbr-report-huntress "Huntress" individual
   
   # Add aggregate report
   node scripts/add-qbr-report.js qbr-report-full "Moneta" aggregate
   ```

3. **Customize the generated template** in `src/app/lmx/deliverables/data/qbr-configs.json`

### Method 2: Manual Configuration

1. **Add a new entry** to `src/app/lmx/deliverables/data/qbr-configs.json`
2. **Follow the JSON structure** shown in the examples below
3. **Test the report** by visiting `/lmx/deliverables/qbr/[report-id]`

## Live Data Integration

### Cork QBR Report - JSON-First Approach

The Cork QBR report uses a **JSON-first approach** that separates content (JSON template) from data (live API data). This enables better collaboration with Cork on report design while maintaining real-time data integration.

**Key Features:**
- **Template-Based**: JSON contains placeholders for dynamic data
- **Vendor Collaboration**: Cork can edit content without touching code
- **Real-time Data**: Fetch latest security metrics, device data, and compliance events
- **Client Selection**: Dropdown to choose from available clients
- **Interactive Refresh**: Button to update data without page reload
- **Status Indicators**: Shows last refresh time and live status

**Setup:**
1. **Configure API Key**: Add to `.env.local`:
   ```env
   CORK_API_KEY=your_cork_api_key_here
   CORK_BASE_URL=https://api.cork.dev
   ```

2. **Access Report**: Navigate to `/lmx/deliverables/qbr/qbr-report-cork`

3. **Use Live Controls**: Select client and click "Refresh Data"

**API Endpoints:**
- `/api/deliverables/cork/clients` - Fetches available clients
- `/api/deliverables/cork/refresh` - Refreshes live data

**Documentation:**
- [JSON-First Approach Documentation](./documentation/json-first-approach.md) - Detailed guide for template editing and vendor collaboration

## JSON Configuration Structure

### Individual Report Template

```json
{
  "qbr-report-example": {
    "id": "qbr-report-example",
    "title": "Example Business Review Report",
    "company": "EXAMPLE COMPANY",
    "dateRange": "Q2 2025 • Business Intelligence",
    "monthlyInvestment": "$2,500",
    "managedEndpoints": "25 Managed Endpoints",
    "type": "individual",
    "description": "Example business review and analysis report",
    "executiveSummary": "Example company demonstrates strong business performance...",
    "liveData": {
      "enabled": false,
      "refreshInterval": 3600,
      "lastRefresh": null,
      "selectedClientUuid": null,
      "availableClients": []
    },
    "categories": [
      {
        "name": "Security Posture",
        "score": 75,
        "items": [
          { "name": "Endpoint Protection", "status": "satisfactory" },
          { "name": "Email Security", "status": "satisfactory" }
        ]
      }
    ],
    "enhancedSections": {
      "risks": [
        {
          "title": "Data Security Risk",
          "description": "Potential vulnerabilities in data protection.",
          "severity": "medium",
          "impact": "Data breaches and unauthorized access."
        }
      ],
      "insights": [
        {
          "title": "Security Improvements",
          "description": "Significant progress in security posture.",
          "metric": "75% Security Score",
          "trend": "positive"
        }
      ],
      "recommendations": [
        {
          "title": "Enhance Security Awareness",
          "description": "Implement comprehensive security training.",
          "priority": "high",
          "effort": "Medium",
          "impact": "Improved security culture"
        }
      ]
    }
  }
}
```

### Live Data Configuration

For reports with live data integration, add the `liveData` section:

```json
{
  "liveData": {
    "enabled": true,
    "refreshInterval": 3600,
    "lastRefresh": "2025-08-14T03:34:04.359Z",
    "selectedClientUuid": "client-uuid-here",
    "availableClients": []
  }
}
```

### Aggregate Report Template

Aggregate reports include additional sections:

```json
{
  "qbr-report-aggregate": {
    // ... same as individual report ...
    "type": "aggregate",
    "hardwareStats": {
      "totalAssets": 156,
      "overdueReplacement": 12,
      "unsupportedOS": 8,
      "replacementBudget": "$18,000"
    },
    "softwareStats": {
      "totalAssets": 892,
      "unsupported": 34,
      "unsupportedSoon": 23,
      "supported": 835
    },
    "contracts": {
      "monthly": [
        {
          "vendor": "Microsoft 365",
          "description": "Email and productivity suite",
          "cost": "$2,500.00",
          "nextDue": "2025-08-31"
        }
      ],
      "annual": [
        {
          "vendor": "Hardware Maintenance",
          "description": "Annual hardware support contracts",
          "cost": "$15,000.00",
          "nextDue": "2025-12-31"
        }
      ]
    },
    "roadmap": {
      "totalInvestment": "$24,750.00",
      "initiatives": [
        {
          "priority": "open",
          "title": "Workstation Modernization",
          "description": "Replace aging workstations.",
          "investment": "$18,000.00",
          "assets": 12
        }
      ]
    }
  }
}
```

## Configuration Options

### Report Types

- **`individual`**: Single-page layout, no tabs
- **`aggregate`**: Tabbed interface with comprehensive sections

### Status Values

- `satisfactory`: Green indicator
- `needs-attention`: Yellow indicator  
- `at-risk`: Red indicator

### Severity Levels

- `high`: Red indicator
- `medium`: Yellow indicator
- `low`: Green indicator

### Priority Levels

- `critical`: Red indicator
- `high`: Orange indicator
- `medium`: Yellow indicator
- `low`: Green indicator

### Trend Values

- `positive`: Green indicator
- `negative`: Red indicator
- `neutral`: Gray indicator

## Updating Existing Reports

1. **Edit the configuration file** directly: `src/app/lmx/deliverables/data/qbr-configs.json`
2. **Save the file** - changes are automatically reflected
3. **Test the report** by visiting the URL

## Removing QBR Reports

1. **Delete the entry** from `src/app/lmx/deliverables/data/qbr-configs.json`
2. **Update the deliverables page** if the report was listed there
3. **Test** to ensure no broken links

## Best Practices

### Content Guidelines

- **Executive Summary**: 2-3 sentences describing overall performance
- **Categories**: 3-4 key areas with scores 0-100
- **Risks**: 3-4 specific, actionable risks
- **Insights**: 3-4 data-driven observations
- **Recommendations**: 3-4 actionable improvement suggestions

### Naming Conventions

- **Report IDs**: Use `qbr-report-[platform-name]` format
- **Company Names**: Use uppercase for display
- **File Names**: Use kebab-case

### Data Quality

- **Scores**: Use realistic percentages (0-100)
- **Metrics**: Include specific numbers and percentages
- **Dates**: Use consistent date formats (YYYY-MM-DD)
- **Currency**: Use consistent formatting ($X,XXX.XX)

## Troubleshooting

### Common Issues

1. **Report not loading**: Check JSON syntax in config file
2. **Missing sections**: Ensure all required fields are present
3. **API errors**: Verify the API route is working (`/api/deliverables/qbr`)

### Validation

The system validates:
- Required fields are present
- JSON syntax is correct
- Report types are valid
- Status/severity values are recognized

## API Endpoints

- `GET /api/deliverables/qbr`: Returns all QBR configurations
- `GET /lmx/deliverables/qbr/[id]`: Displays individual QBR report

## Examples

See the existing reports in `qbr-configs.json` for complete examples:
- `qbr-report-full`: Comprehensive aggregate report
- `qbr-report-backup-radar`: Individual backup monitoring report
- `qbr-report-cork-enhanced`: Individual AI security report
