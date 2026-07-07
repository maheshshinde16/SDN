<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CSV Importer Development Guidelines

This workspace contains a full-stack AI-powered CSV Importer application for GrowEasy.

## Project Overview

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **AI**: Claude API for intelligent data extraction
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

## File Structure

```
/frontend - Next.js application
  /app - Next.js 14 App Router
  /components - React components
  /lib - Utility functions and API client
  /styles - Global and component styles

/backend - Express.js API
  /src - TypeScript source
    /routes - API route handlers
    /services - Business logic (AI extraction)
    /utils - Utility functions
    /types - TypeScript type definitions
```

## Development Workflow

### Starting Development

1. **Backend Setup**
   - cd backend
   - cp .env.example .env (add CLAUDE_API_KEY)
   - npm install
   - npm run dev (runs on port 5000)

2. **Frontend Setup**
   - cd frontend
   - cp .env.local.example .env.local
   - npm install
   - npm run dev (runs on port 3000)

### Key API Endpoints

- POST /api/upload - Upload CSV
- POST /api/import - Process with AI
- GET /api/health - Health check

### Important Conventions

1. **TypeScript**
   - Strict mode enabled
   - All files use .ts or .tsx extension
   - Type all function parameters and returns

2. **Component Structure**
   - Use 'use client' directive for client components
   - Props interface defined above component
   - Functional components with hooks

3. **Error Handling**
   - Always catch API errors
   - Provide user-friendly messages
   - Log errors to console

4. **Environment Variables**
   - Backend: .env file
   - Frontend: .env.local file
   - Never commit these files

## Code Style

- ESLint enabled for linting
- Prettier for formatting
- Max line length: 100 characters
- 2-space indentation
- Use const/let, avoid var

## AI Integration

Claude is configured to:
- Extract 15+ CRM fields intelligently
- Handle batch processing (10 records per batch)
- Validate and sanitize data
- Provide meaningful error messages

## Testing

Sample CSV files for testing are in `/samples`:
- standard_format.csv
- facebook_leads.csv
- real_estate_export.csv

## Deployment

- **Vercel**: Frontend auto-deploys on git push
- **Railway**: Backend auto-deploys on git push
- Set environment variables in platform dashboards

## Performance Targets

- Frontend: <3s page load
- API: <2s CSV parse
- AI: <30s for 100 records
- Overall: Support files up to 1MB

## Common Issues

1. CORS errors: Check FRONTEND_URL in backend
2. API not found: Ensure backend is running
3. Upload fails: Check file size and format
4. AI extraction slow: Check API rate limits

## Next Steps After Setup

1. Install dependencies in both folders
2. Add Claude API key to backend .env
3. Run backend: npm run dev
4. Run frontend: npm run dev
5. Test with sample CSV file
6. Deploy to production
