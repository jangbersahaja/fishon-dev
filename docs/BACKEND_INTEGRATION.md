# fishon-market: Backend Integration Configuration

## Environment Variables

Add to `.env.local`:

```env
# Required: fishon-captain API endpoint
FISHON_CAPTAIN_API_URL=https://fishon-captain.vercel.app

# Optional: API key if fishon-captain requires authentication
FISHON_CAPTAIN_API_KEY=your-secret-api-key-here
```

## Usage

The existing integration files will automatically use the Public API:

- `src/lib/api/captain-api.ts` - API client
- `src/lib/api/charter-adapter.ts` - Data transformation
- `src/services/charter-service.ts` - Business logic

No code changes needed - just set the environment variables above.
