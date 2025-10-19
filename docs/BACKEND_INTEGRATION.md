# Backend Integration Guide

This document explains how Fishon.my connects to the Fishon Captain backend in read-only mode.

## Overview

The Fishon.my frontend now supports fetching charter and captain data from the Fishon Captain backend API. The integration includes:

- **Read-only access** - The frontend only reads data, never writes
- **Automatic fallback** - Falls back to dummy data if backend is unavailable
- **Type-safe** - Full TypeScript types for API responses
- **Cached responses** - Uses Next.js caching for better performance

## Configuration

### Environment Variables

Add these variables to your `.env.local` file (or production environment):

```bash
# Fishon Captain Backend API
FISHON_CAPTAIN_API_URL="https://api.fishon-captain.example.com"
FISHON_CAPTAIN_API_KEY="your-api-key-here"  # Optional
```

If `FISHON_CAPTAIN_API_URL` is not set, the app will automatically use dummy data.

### API Endpoints Expected

The backend should expose these REST endpoints:

1. **GET /api/charters** - List all charters
   - Returns: `{ charters: BackendCharter[] }`
   - Cached for 5 minutes

2. **GET /api/charters/:id** - Get single charter
   - Returns: `{ charter: BackendCharter }`
   - Cached for 5 minutes

3. **GET /api/charters/search** - Search charters
   - Query params: `location`, `charterType`, `technique`, `minPrice`, `maxPrice`
   - Returns: `{ charters: BackendCharter[] }`
   - Cached for 5 minutes

## Architecture

### Key Files

- `src/lib/captain-api.ts` - Raw API client for backend
- `src/lib/charter-adapter.ts` - Data transformation layer
- `src/lib/charter-service.ts` - High-level service with fallback logic

### Data Flow

```
Backend API → captain-api.ts → charter-adapter.ts → charter-service.ts → Pages/Components
                                                   ↓ (fallback)
                                              dummy/charter.ts
```

### Type Mapping

The adapter converts backend Prisma schema types to frontend types:

| Backend (Prisma)        | Frontend             | Notes                    |
|-------------------------|----------------------|--------------------------|
| `Charter.id` (cuid)     | `Charter.id` (number)| Converted during mapping |
| `Trip.durationHours`    | `Trip.duration`      | "X hours" format         |
| `Trip.style` (enum)     | `Trip.private` (bool)| PRIVATE → true          |
| `CaptainProfile`        | `Captain`            | Simplified fields        |
| `CharterPricingPlan`    | `tier`               | BASIC/SILVER/GOLD        |

## Testing

### Local Development

1. Leave `FISHON_CAPTAIN_API_URL` unset - app uses dummy data
2. All pages work normally with dummy data

### Testing with Backend

1. Set `FISHON_CAPTAIN_API_URL` to your backend URL
2. Optionally set `FISHON_CAPTAIN_API_KEY` for authentication
3. Start the dev server: `npm run dev`
4. Check console logs for backend connection status

### Verifying Integration

Check the browser console or server logs for these messages:

- ✅ `Using dummy charter data (backend not configured)` - Using fallback
- ✅ Backend API fetching (no logs) - Successfully using backend
- ⚠️ `Error fetching charters from backend, falling back to dummy data` - Backend error, using fallback

## Deployment

### Vercel / Production

1. Add environment variables in your deployment platform:
   - `FISHON_CAPTAIN_API_URL`
   - `FISHON_CAPTAIN_API_KEY` (if required)

2. Deploy the application

3. Monitor logs for backend connection issues

### Staged Rollout

You can deploy this PR without configuring the backend - the app will continue using dummy data until you're ready to connect.

## Caching Strategy

- All backend API calls are cached for **5 minutes** using Next.js `revalidate`
- This reduces backend load and improves performance
- Adjust cache duration in `src/lib/captain-api.ts` if needed

## Error Handling

The integration handles these scenarios gracefully:

1. **Backend not configured** → Uses dummy data, logs info message
2. **Backend timeout/error** → Uses dummy data, logs error
3. **Empty results** → Uses dummy data, logs info message
4. **Invalid response** → Uses dummy data, logs error

## Future Enhancements

### Recommended Improvements

1. **Real-time availability** - Integrate booking availability checks
2. **Search optimization** - Implement backend search with filters
3. **Incremental Static Regeneration** - Use ISR for better caching
4. **Client-side suggestions** - Fetch autocomplete data from backend
5. **Analytics** - Track backend vs dummy data usage

### API Enhancements Needed

For full feature parity, the backend should add:

- `GET /api/locations` - For search autocomplete
- `GET /api/techniques` - List all techniques with counts
- `GET /api/types` - List all charter types with counts
- `POST /api/charters/:id/availability` - Check availability for dates

## Troubleshooting

### Issue: "No charters showing"

**Check:**
- Is `FISHON_CAPTAIN_API_URL` set correctly?
- Is the backend API accessible?
- Check browser console and server logs for errors

**Solution:** Temporarily unset `FISHON_CAPTAIN_API_URL` to use dummy data

### Issue: "Slow page loads"

**Check:**
- Backend API response times
- Network latency

**Solution:** Adjust cache duration or optimize backend queries

### Issue: "Type errors in components"

**Check:**
- Backend API response matches expected `BackendCharter` type
- Data transformation in `charter-adapter.ts`

**Solution:** Update types or adapter logic

## Support

For issues or questions about the backend integration:

1. Check this documentation
2. Review console/server logs
3. Test with dummy data (unset `FISHON_CAPTAIN_API_URL`)
4. Contact the backend team if API issues persist

---

Last updated: 2025-10-13
