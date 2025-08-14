# Cork API Integration

This directory contains the API routes for integrating with the Cork API to provide live data refresh capabilities for QBR reports.

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
- **Response:** List of clients with UUIDs, names, and status
- **Cache:** 5 minutes

### `/api/deliverables/cork/refresh`
- **Method:** POST
- **Purpose:** Refresh live data for a specific client
- **Body:** `{ "clientUuid": "client-uuid-here" }`
- **Response:** Updated report data
- **Side Effect:** Updates the Cork JSON file with fresh data

## Features

### Live Data Controls
- **Client Selection:** Dropdown populated from Cork API
- **Data Refresh:** Button to fetch latest data
- **Status Indicators:** Shows last refresh time and live status
- **Error Handling:** Graceful fallback if API is unavailable

### Data Sources
- **Security Metrics:** Compliance events and response times
- **Endpoint Data:** Device protection status and types
- **Email Security:** Domain and inbox protection data
- **Client Information:** Names and status from Cork

### Security
- **API Key Protection:** Stored in environment variables only
- **Request Validation:** Proper error handling and validation
- **Rate Limiting:** Built-in caching to prevent excessive API calls

## Usage

1. **Configure API Key:** Add your Cork API key to `.env.local`
2. **Access Cork Report:** Navigate to the Cork QBR report
3. **Select Client:** Choose from available clients in the dropdown
4. **Refresh Data:** Click "Refresh Data" to fetch latest information
5. **View Updates:** Report automatically updates with live data

## Error Handling

- **API Key Missing:** Clear error message if not configured
- **Network Issues:** Graceful fallback with user-friendly messages
- **Invalid Client:** Validation before making API calls
- **Rate Limits:** Caching to prevent excessive requests

## Data Flow

1. User selects client from dropdown
2. Frontend calls `/api/deliverables/cork/refresh`
3. API route fetches data from Cork API
4. Data is processed and formatted
5. Cork JSON file is updated with fresh data
6. Page reloads to show updated report

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

## Future Enhancements

- **Real-time Updates:** WebSocket integration for live data
- **Scheduled Refresh:** Automatic data updates
- **Multiple Clients:** Support for multiple client selection
- **Data Export:** Export refreshed data to various formats
- **Advanced Analytics:** Enhanced data visualization
