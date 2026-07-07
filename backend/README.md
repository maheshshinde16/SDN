# Backend README

## GrowEasy CSV Importer - Backend API

Node.js/Express backend for AI-powered CSV extraction and CRM data mapping.

### Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Claude API key
# CLAUDE_API_KEY=your_claude_api_key_here

# Start development server
npm run dev
```

### API Endpoints

- `POST /api/upload` - Upload and parse CSV
- `POST /api/import` - Process CSV with AI
- `GET /api/health` - Health check

### Environment Variables

```
CLAUDE_API_KEY=your_claude_api_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Building

```bash
npm run build
npm start
```

### Project Structure

- `src/index.ts` - Express server entry point
- `src/routes/api.ts` - API route handlers
- `src/services/aiService.ts` - Claude AI integration
- `src/utils/csvParser.ts` - CSV parsing logic
- `src/utils/csvExport.ts` - CSV export logic
- `src/types/index.ts` - TypeScript type definitions

### Key Features

- ✅ CSV file upload with validation
- ✅ AI-powered field extraction using Claude
- ✅ Batch processing for efficiency
- ✅ Error handling and record skipping
- ✅ CORS support for frontend
- ✅ Type-safe TypeScript implementation
