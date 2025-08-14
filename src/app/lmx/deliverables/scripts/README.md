# Cork API Integration Scripts

This directory contains scripts for integrating with the Cork API to generate enhanced QBR reports with real-time data.

## Overview

The Cork API provides access to:
- **Client Management**: Get client information and UUIDs
- **Device Management**: Retrieve endpoint security data
- **Domain Management**: Access email security configurations
- **Compliance Events**: Fetch security events and metrics
- **Integration Management**: Connect with various security tools

## Scripts

### 1. `cork_discover_clients.py`
Discovers all clients from the Cork API and displays their UUIDs.

```bash
python3 cork_discover_clients.py --config cork_config.json
```

**Features:**
- Lists all available clients with their UUIDs
- Shows client status and creation dates
- Provides example commands for QBR generation
- Handles pagination to show all clients
- Saves client list to JSON file (optional)

### 2. `cork_analyze_data.py`
Comprehensive data analysis module that fetches and analyzes client data.

```bash
python3 cork_analyze_data.py --client-uuid <UUID> --config cork_config.json
```

**Features:**
- Fetches client information, devices, domains, inboxes, and compliance events
- Generates insights based on data analysis
- Provides detailed breakdown of security metrics
- Handles API pagination and error cases

### 3. `cork_generate_enhanced_qbr.py`
Generates enhanced QBR reports with live data from Cork API.

```bash
python3 cork_generate_enhanced_qbr.py \
  --client-uuid <UUID> \
  --period q2-2025 \
  --output enhanced-qbr.html
```

**Features:**
- Real-time data from Cork API
- AI-generated commentary and insights
- Three main sections: Risks, Insights, and Recommendations
- Professional HTML output with modern design
- Client name displayed in report header

### 4. `cork_api_integration.py`
Core API integration module with classes for:
- `CorkAPIClient`: Handles API communication
- `QBRDataProcessor`: Processes data for QBR reports

### 5. `cork_setup_api.py`
Secure API key configuration script that helps you set up your API credentials.

```bash
python3 cork_setup_api.py
```

**Features:**
- Interactive setup with secure password input
- Tests API connection after configuration
- Creates configuration file from template
- Validates API key format and connectivity

**Key Methods:**
- `get_security_metrics()`: Fetches compliance events
- `get_endpoint_data()`: Retrieves device information
- `get_email_security_data()`: Gets domain and inbox data

## Configuration

### `cork_config.json`
Configuration file for API credentials and settings:

```json
{
  "cork_api_key": "your_cork_api_key_here",
  "cork_base_url": "https://api.cork.dev"
}
```

### 🔐 Security Setup
**IMPORTANT**: Before using these scripts, you must configure your API key:

1. **Get API Access**: Contact Cork support for API credentials
2. **Setup Configuration**: Use the secure setup script:
   ```bash
   python3 cork_setup_api.py
   ```
   
   Or manually copy the template and add your API key:
   ```bash
   cp cork_config.template.json cork_config.json
   nano cork_config.json  # Edit with your actual API key
   ```
3. **Security Best Practices**:
   - Never commit API keys to version control
   - Use environment variables in production
   - Rotate keys regularly
   - The `cork_config.json` file is already in `.gitignore`

## API Endpoints Used

Based on the Cork API specification (`../data/cork-api-spec.json`):

### Clients
- `GET /api/v1/clients` - List all clients (with pagination)
- `GET /api/v1/clients/{client-uuid}/devices` - Get client devices
- `GET /api/v1/clients/{client-uuid}/domains` - Get client domains
- `GET /api/v1/clients/{client-uuid}/inboxes` - Get client inboxes

### Compliance & Risk
- `GET /api/v1/compliance/client/{client-uuid}/events` - Get compliance events
- `GET /api/v1/compliance/event-types` - Get event types

### Authentication
- Bearer token authentication required
- API key format: `Bearer YOUR_API_KEY`

## Workflow

1. **Setup Configuration**
   ```bash
   # Edit cork_config.json with your API key
   nano cork_config.json
   ```

2. **Discover Clients**
   ```bash
   python3 cork_discover_clients.py --config cork_config.json
   ```

3. **Generate Enhanced QBR**
   ```bash
   # For Bluth Company (recommended - best data)
   python3 generate_cork_enhanced_qbr.py \
     --client-uuid e363053e-6b41-4306-ae9c-59a7de8c67b0 \
     --period q2-2025 \
     --output ../../bluth-enhanced-qbr.html
   
   # For Cork
   python3 generate_cork_enhanced_qbr.py \
     --client-uuid 4911c0c5-cb68-4ea3-b3e9-625ba6358478 \
     --period q2-2025 \
     --output ../../dist/qbr-report-cork-enhanced.html
   ```

4. **View Report**
   ```bash
   open ../../dist/bluth-enhanced-qbr.html
   # or
   open ../../dist/qbr-report-cork-enhanced.html
   ```

## Report Sections

The enhanced QBR reports include three main sections:

### 1. ⚠️ Risks
- **Security Posture Analysis**: Current state assessment
- **Risk Assessment**: Threat level and concerns
- **Orange/amber styling** to indicate caution/warning

### 2. 🤖 Insights
- **Device Protection**: Coverage analysis
- **Integration**: Stack assessment  
- **Event Monitoring**: Detection status
- **Domain Management**: Infrastructure overview
- **Blue/purple styling** for neutral analysis

### 3. 🎯 Recommendations
- **Email Security**: Configuration improvements
- **Identity Security**: MFA enhancements
- **Incident Response**: Resolution improvements
- **Neutral gray/blue styling** - Professional, actionable

## Available Clients

Currently available clients with good data:
- **Bluth Company** (`e363053e-6b41-4306-ae9c-59a7de8c67b0`) - Active, comprehensive data
- **Cork** (`4911c0c5-cb68-4ea3-b3e9-625ba6358478`) - Active, moderate data
- **Death Star** (`87787313-95a3-451a-855d-7a8425f73c7f`) - Active, minimal data

## Data Sources

### Security Metrics
- **Compliance Events**: Fetched from `/api/v1/compliance/client/{client-uuid}/events`
- **Event Resolution**: Calculated from resolved vs total events
- **Risk Levels**: Dynamic calculation based on at-risk events
- **Event Types**: Breakdown by security category

### Endpoint Security
- **Device Count**: Total devices from `/api/v1/clients/{client-uuid}/devices`
- **Protection Status**: Based on associated endpoints
- **Device Types**: EDR, BCDR, RMM coverage

### Email Security
- **Domain Count**: From `/api/v1/clients/{client-uuid}/domains`
- **Inbox Count**: From `/api/v1/clients/{client-uuid}/inboxes`
- **User Coverage**: Inboxes with associated users

## Error Handling

- **API Failures**: Graceful fallback to mock data
- **Missing Data**: Default values for incomplete information
- **Authentication**: Clear error messages for invalid API keys
- **Network Issues**: Retry logic and timeout handling
- **Pagination**: Handles large client lists properly

## Dependencies

```bash
pip install requests
```

## Examples

### Generate QBR for Bluth Company (Recommended)
```bash
python3 generate_cork_enhanced_qbr.py \
  --client-uuid e363053e-6b41-4306-ae9c-59a7de8c67b0 \
  --period q2-2025 \
  --output ../../bluth-enhanced-qbr.html
```

### Generate QBR for Cork
```bash
python3 generate_cork_enhanced_qbr.py \
  --client-uuid 4911c0c5-cb68-4ea3-b3e9-625ba6358478 \
  --period q2-2025 \
  --output ../../dist/qbr-report-cork-enhanced.html
```

### Discover All Clients
```bash
python3 cork_discover_clients.py \
  --config cork_config.json
```

### Analyze Client Data
```bash
python3 cork_analyze_data.py \
  --client-uuid e363053e-6b41-4306-ae9c-59a7de8c67b0 \
  --config cork_config.json
```

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify API key in `cork_config.json`
   - Check API key permissions

2. **Client UUID Not Found**
   - Run `discover_clients.py` to get valid UUIDs
   - Verify client exists in your Cork account

3. **Network Errors**
   - Check internet connection
   - Verify `cork_base_url` is correct
   - Check firewall settings

4. **Permission Errors**
   - Ensure write permissions for output files
   - Check file paths are valid

### Debug Mode
```bash
python3 generate_cork_enhanced_qbr.py --verbose --client-uuid <UUID> --period q2-2025 --output test.html
```

## Recent Updates

- **Clean Script Structure**: Removed all versioned scripts, now using single `generate_cork_enhanced_qbr.py`
- **Improved Naming**: All scripts now clearly indicate Cork-specific functionality
- **Enhanced Design**: Clean Risks, Insights, and Recommendations sections
- **Client Name Display**: Proper client names now shown in report headers
- **Pagination Fix**: Fixed client discovery to include all available clients

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Automated Scheduling**: Cron jobs for regular report generation
- **Email Distribution**: Automatic report delivery
- **Dashboard Integration**: Real-time metrics dashboard
- **Custom Metrics**: User-defined security metrics
- **Additional Chart Types**: Bar charts, trend analysis
- **Export Options**: PDF, Excel, and other formats
