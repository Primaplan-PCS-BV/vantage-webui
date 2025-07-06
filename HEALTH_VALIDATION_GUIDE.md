# Health Dashboard Validation Guide

## Overview
This guide will help you manually validate all the requirements for the Health Dashboard.

## Prerequisites
1. Ensure the development server is running: `npm run dev`
2. Open your browser to `http://localhost:5174`

## Step-by-Step Validation

### 1. Access the Health Page
- Open your browser to `http://localhost:5174/#health`
- **Expected**: The Health page loads with "System Health" header and service cards
- **✅ Pass**: Service cards are displayed with status badges
- **❌ Fail**: Page doesn't load or no service cards visible

### 2. Verify Service Cards and Status Badges
Look for the following elements:
- Service cards in a grid layout
- Each card should have:
  - Service name (e.g., "API Services", "Agent Health", "Database", "Network")
  - Status badge with colors (green, yellow, red, gray)
  - Icon (checkmark, warning, X, etc.)
  - Status message

**Expected services:**
- API Services
- Agent Health  
- Database (P6)
- Network

### 3. Test Auto-refresh Functionality

#### 3.1 Enable Auto-refresh
- Look for "Auto-refresh:" checkbox in the top-right
- **✅ Pass**: Checkbox is present and can be toggled
- If unchecked, click to enable it

#### 3.2 Set 10-second Interval
- After enabling auto-refresh, find the dropdown with time intervals
- Select "10s" from the dropdown
- **✅ Pass**: Dropdown shows options: 10s, 30s, 1m, 5m

#### 3.3 Monitor Network Requests
- Open Browser DevTools (F12)
- Go to **Network** tab
- Clear existing requests
- Wait and observe periodic requests every 10 seconds
- **✅ Pass**: Requests to `/health` and `/p6/status` occur every 10 seconds
- **Note**: `/p6/status` may return 404 - this is expected and should be handled gracefully

### 4. Test Manual Refresh Button
- Look for the "Refresh" button (with spinning icon)
- Click the button
- **✅ Pass**: Button triggers immediate network requests to `/health` and `/p6/status`
- **✅ Pass**: Button shows loading state (spinning icon) during refresh

### 5. Simulate Success/Failure Status

#### 5.1 Override Fetch Function
- Open Browser DevTools → **Console** tab
- Paste and execute this command:
```javascript
window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:'UNHEALTHY'}), {
  headers: { 'Content-Type': 'application/json' }
}));
```

#### 5.2 Trigger Refresh
- Click the Manual Refresh button
- **✅ Pass**: Service cards update to show unhealthy status
- **✅ Pass**: Status badges change color to red
- **✅ Pass**: Icons change to error/warning icons
- **✅ Pass**: Overall system status updates to "unhealthy"

#### 5.3 Test Different Statuses
Try these additional overrides:
```javascript
// Healthy status
window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:'healthy'})));

// Degraded status  
window.fetch = () => Promise.resolve(new Response(JSON.stringify({status:'degraded'})));
```

### 6. Test Debug/Raw Data Mode

#### 6.1 Find Debug Section
- Scroll to bottom of the page
- Look for a collapsible section labeled "Raw Health Data (Development Only)"
- **✅ Pass**: Debug section is present in development mode

#### 6.2 Expand Debug Data
- Click on the debug section to expand it
- **✅ Pass**: Shows raw JSON data from health and P6 status endpoints
- **✅ Pass**: Data is properly formatted and readable

### 7. Error Handling Validation

#### 7.1 Network Error Simulation
- In DevTools → Console, simulate network error:
```javascript
window.fetch = () => Promise.reject(new Error('Network error'));
```
- Click Manual Refresh
- **✅ Pass**: Error message appears
- **✅ Pass**: Service cards show "unhealthy" or "connection failed" status

#### 7.2 Restore Normal Function
```javascript
// Restore normal fetch behavior
location.reload();
```

## Validation Checklist

### ✅ Service Cards Display
- [ ] Service cards are visible in grid layout
- [ ] Each card has service name, status badge, icon
- [ ] Status badges show appropriate colors
- [ ] Icons reflect service status

### ✅ Auto-refresh Functionality  
- [ ] Auto-refresh checkbox present and functional
- [ ] 10-second interval option available
- [ ] Periodic network requests occur at set interval
- [ ] Requests target `/health` and `/p6/status` endpoints

### ✅ Manual Refresh
- [ ] Manual refresh button present
- [ ] Button triggers immediate network requests
- [ ] Loading state visible during refresh

### ✅ Status Simulation
- [ ] Fetch override successfully changes UI
- [ ] Status colors update appropriately
- [ ] Icons change based on status
- [ ] Overall system status reflects individual services

### ✅ Debug Mode
- [ ] Raw data section available in development
- [ ] Debug data displays JSON from endpoints
- [ ] Data is properly formatted

### ✅ Error Handling
- [ ] Network errors handled gracefully
- [ ] 404 responses (P6 status) don't break the UI
- [ ] Error states displayed to user

## Expected Network Behavior

### Successful Requests
- `GET /health` → Returns health data with agent status
- `GET /p6/status` → May return 404 (expected) or P6 database info

### Auto-refresh Pattern
- Every 10 seconds when enabled
- Both endpoints called in parallel
- Failed requests don't break auto-refresh cycle

## Success Criteria
- All service cards display with status information
- Auto-refresh works with 10-second intervals  
- Manual refresh triggers immediate updates
- Status simulation updates UI appropriately
- Debug data is accessible and formatted
- Error states are handled gracefully

## Troubleshooting

### No Service Cards Visible
- Check if backend API is running
- Verify `/health` endpoint responds
- Check browser console for errors

### Auto-refresh Not Working
- Verify checkbox is enabled
- Check Network tab for periodic requests
- Ensure interval is set correctly

### Status Not Updating
- Clear browser cache
- Check fetch override is applied correctly
- Verify Manual Refresh triggers requests

### Debug Section Missing
- Ensure running in development mode
- Check that `import.meta.env.DEV` is true
- Verify health data is loaded
