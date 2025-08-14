# Cork API Integration

This directory contains the API routes for integrating with the Cork API to provide live data refresh capabilities for QBR reports.

## Overview

The Cork QBR report features real-time data integration that allows users to:
- **Select clients** from a dropdown populated from the Cork API
- **Refresh live data** with a single click
- **View updated metrics** including security events, device protection, and compliance data
- **Monitor integration status** and warranty coverage

## Setup

### 1. Environment Configuration

Create a `.env.local` file in your project root with your Cork API credentials:

```env
# Cork API Configuration
CORK_API_KEY=your_cork_api_key_here
CORK_BASE_URL=https://api.cork.dev
```

**Security Note:** Never commit your actual API key to version control. The `.env.local` file is already in `.gitignore`.

### 2. Get Your API Key

Contact Cork support to obtain your API credentials. The API key should be in the format provided by Cork.

## API Routes

### `/api/deliverables/cork/clients`
- **Method:** GET
- **Purpose:** Fetch available clients from Cork API
- **Response:** List of clients with UUIDs, names, status, and device counts
- **Cache:** 5 minutes
- **Example Response:**
  ```json
  {
    "clients": [
      {
        "uuid": "e363053e-6b41-4306-ae9c-59a7de8c67b0",
        "name": "Bluth Company",
        "status": "active",
        "created_at": "2024-01-15T10:30:00Z",
        "deviceCount": 25
      }
    ],
    "total": 1,
    "lastUpdated": "2025-08-14T03:34:04.359Z"
  }
  ```

### `/api/deliverables/cork/refresh`
- **Method:** POST
- **Purpose:** Refresh live data for a specific client
- **Body:** `{ "clientUuid": "client-uuid-here" }`
- **Response:** Updated report data and success status
- **Side Effect:** Updates the Cork JSON file with fresh data
- **Example Response:**
  ```json
  {
    "success": true,
    "data": {
      "securityMetrics": {
        "total_events": 17,
        "resolved_events": 11,
        "unresolved_events": 6,
        "response_time_avg": 2.1,
        "critical_events": 2,
        "warning_events": 4,
        "info_events": 11,
        "event_types": ["endpoint_protection", "email_security"],
        "last_updated": "2025-08-14T03:34:04.359Z"
      },
      "endpointData": {
        "total_devices": 25,
        "protected_devices": 23,
        "unprotected_devices": 2,
        "protection_rate": "92%",
        "device_types": {
          "edr": 15,
          "bcdr": 8,
          "rmm": 2
        },
        "active_integrations": 5,
        "integration_names": ["Huntress", "Datto", "ConnectWise"]
      },
      "emailData": {
        "total_domains": 3,
        "total_inboxes": 45,
        "protected_inboxes": 42,
        "protection_rate": "93%"
      },
      "overallMetrics": {
        "device_protection_score": 92,
        "event_resolution_rate": 65,
        "total_assets": 73,
        "security_coverage": 79
      },
      "lastRefresh": "2025-08-14T03:34:04.359Z",
      "selectedClientUuid": "e363053e-6b41-4306-ae9c-59a7de8c67b0",
      "selectedClientName": "Bluth Company"
    },
    "message": "Cork data refreshed successfully"
  }
  ```

## Features

### Live Data Controls
- **Client Selection:** Dropdown populated from Cork API with device counts
- **Data Refresh:** Button to fetch latest data with loading indicators
- **Status Indicators:** Shows last refresh time and live status
- **Error Handling:** Graceful fallback if API is unavailable

### Data Sources
- **Security Metrics:** Compliance events, response times, and risk levels
- **Endpoint Data:** Device protection status, types, and integration coverage
- **Email Security:** Domain and inbox protection data
- **Client Information:** Names and status from Cork
- **Warranty Data:** Coverage rates and active warranties
- **Integration Status:** Connected tools and their health

### Security
- **API Key Protection:** Stored in environment variables only
- **Request Validation:** Proper error handling and validation
- **Rate Limiting:** Built-in caching to prevent excessive API calls
- **Error Handling:** Graceful fallbacks with user-friendly messages

## Usage

1. **Configure API Key:** Add your Cork API key to `.env.local`
2. **Access Cork Report:** Navigate to `/lmx/deliverables/qbr/qbr-report-cork`
3. **Select Client:** Choose from available clients in the dropdown
4. **Refresh Data:** Click "Refresh Data" to fetch latest information
5. **View Updates:** Report automatically updates with live data

## Data Flow

1. **User Interface:** React component displays client selector and refresh button
2. **Client Fetch:** Frontend calls `/api/deliverables/cork/clients` to get available clients
3. **User Selection:** User selects a client from the dropdown
4. **Data Refresh:** Frontend calls `/api/deliverables/cork/refresh` with selected client UUID
5. **API Processing:** Backend fetches and processes data from Cork API
6. **File Update:** Cork JSON file is updated with fresh data
7. **Page Reload:** Page reloads to display updated report

## Error Handling

- **API Key Missing:** Clear error message if not configured
- **Network Issues:** Graceful fallback with user-friendly messages
- **Invalid Client:** Validation before making API calls
- **Rate Limits:** Caching to prevent excessive requests
- **API Failures:** Detailed error logging and user feedback

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Check that `.env.local` exists and contains `CORK_API_KEY`
   - Restart your development server after adding the key

2. **"Failed to fetch clients"**
   - Verify your API key is valid
   - Check network connectivity to `https://api.cork.dev`

3. **"Failed to refresh data"**
   - Ensure the client UUID is valid
   - Check Cork API status and rate limits

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```env
DEBUG=true
```

## API Endpoints Used

Based on the Cork API specification (`../lmx/deliverables/documentation/cork-api.json`):

### Clients
- `GET /api/v1/clients` - List all clients (with pagination)
- `GET /api/v1/clients/{client-uuid}/devices` - Get client devices
- `GET /api/v1/clients/{client-uuid}/domains` - Get client domains
- `GET /api/v1/clients/{client-uuid}/inboxes` - Get client inboxes

### Compliance & Risk
- `GET /api/v1/compliance/client/{client-uuid}/events` - Get compliance events
- `GET /api/v1/compliance/event-types` - Get event types

### Integrations & Warranties
- `GET /api/v1/integrations/connected` - Get connected integrations
- `GET /api/v1/warranties` - Get warranty information

### Authentication
- Bearer token authentication required
- API key format: `Bearer YOUR_API_KEY`

## Future Enhancements

- **Real-time Updates:** WebSocket integration for live data
- **Scheduled Refresh:** Automatic data updates
- **Multiple Clients:** Support for multiple client selection
- **Data Export:** Export refreshed data to various formats
- **Advanced Analytics:** Enhanced data visualization
- **Historical Data:** Trend analysis and historical comparisons
