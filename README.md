# GrowEasy CSV Importer

An AI-powered CSV importer that intelligently extracts CRM lead information from any CSV format using Claude AI.

## Overview

This project demonstrates advanced AI integration for data extraction and transformation. It can handle CSVs from various sources (Facebook Lead Export, Google Ads, Excel sheets, Real Estate CRM exports, etc.) and intelligently map them to a standardized GrowEasy CRM format.

### Key Features

- **Smart CSV Upload**: Drag & drop or file picker for CSV uploads
- **AI-Powered Extraction**: Uses Claude AI to intelligently map CSV columns to CRM fields
- **Preview Before Import**: Review CSV data before processing
- **Error Handling**: Gracefully handles invalid records and provides detailed feedback
- **Responsive UI**: Modern, mobile-friendly interface built with Next.js and Tailwind CSS
- **Production Ready**: TypeScript, error handling, batch processing, and deployment ready

## Project Structure

```
.
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js 14 app directory
│   │   ├── page.tsx         # Main page component
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── FileUpload.tsx   # CSV upload component
│   │   ├── CSVPreview.tsx   # CSV preview table
│   │   └── Results.tsx      # Results display component
│   ├── lib/                 # Utility functions
│   │   └── api.ts           # API client
│   ├── styles/              # Global styles
│   └── public/              # Static assets
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts         # Express server entry
│   │   ├── routes/
│   │   │   └── api.ts       # API routes
│   │   ├── services/
│   │   │   └── aiService.ts # Claude AI integration
│   │   ├── utils/
│   │   │   ├── csvParser.ts # CSV parsing logic
│   │   │   └── csvExport.ts # CSV export logic
│   │   └── types/
│   │       └── index.ts     # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **CSV Parsing**: csv-parse
- **AI**: Claude API (Anthropic)
- **File Upload**: Multer

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway/Render or Docker

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Claude API key from [Anthropic](https://console.anthropic.com/)

### Setup Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Add your Claude API key to `.env`:
```
CLAUDE_API_KEY=your_claude_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

4. Install dependencies:
```bash
npm install
```

5. Start development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Setup Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Verify the API URL (should match backend port):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Install dependencies:
```bash
npm install
```

5. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Upload a CSV file (drag & drop or file picker)
3. Review the CSV preview
4. Confirm to start the import process
5. View the parsed results with success/skip counts

### Sample CSV Formats

The importer handles various CSV formats:

```csv
name,email,phone,company
John Doe,john@example.com,+91-9876543210,GrowEasy
Sarah Johnson,sarah@example.com,+91-9876543211,Tech Solutions
```

Or:

```csv
first_name,last_name,contact_email,mobile_number,organization
Rajesh,Patel,rajesh@example.com,9876543212,Startup Inc
Priya,Singh,priya@example.com,9876543213,Enterprise Corp
```

The AI will intelligently map these different formats to the standard CRM fields.

## API Documentation

### POST `/api/upload`
Upload and parse a CSV file.

**Request:**
- Form Data: `file` (CSV file)

**Response:**
```json
{
  "fileId": "string",
  "fileName": "string",
  "totalRows": number,
  "columns": ["col1", "col2"],
  "preview": [{ /* first 5 rows */ }]
}
```

### POST `/api/import`
Process the uploaded CSV with AI extraction.

**Request:**
```json
{
  "fileId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "totalRecords": number,
  "successfulRecords": number,
  "skippedRecords": number,
  "records": [
    {
      "created_at": "2026-05-13T14:20:48",
      "name": "John Doe",
      "email": "john@example.com",
      "country_code": "+91",
      "mobile_without_country_code": "9876543210",
      ...
    }
  ],
  "skipped": [
    {
      "reason": "Missing both email and mobile number",
      "originalRecord": { /* raw CSV record */ }
    }
  ]
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## CRM Fields

The following fields are extracted and mapped:

| Field | Description |
|-------|-------------|
| `created_at` | Lead creation date (ISO format) |
| `name` | Lead name |
| `email` | Primary email address |
| `country_code` | Country code (e.g., +91) |
| `mobile_without_country_code` | Mobile number without country code |
| `company` | Company name |
| `city` | City |
| `state` | State/Province |
| `country` | Country |
| `lead_owner` | Lead owner name/email |
| `crm_status` | Status: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE |
| `crm_note` | Notes/remarks/follow-up information |
| `data_source` | Source: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots |
| `possession_time` | Property possession time |
| `description` | Additional description |

## Deployment

### Deploy Frontend to Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

Follow the prompts and set `NEXT_PUBLIC_API_URL` to your backend URL.

### Deploy Backend to Railway

1. Create an account on [Railway.app](https://railway.app)
2. Create a new project and connect your GitHub repository
3. Add environment variables (CLAUDE_API_KEY, PORT, FRONTEND_URL)
4. Railway will automatically deploy when you push to main

### Deploy with Docker

1. Create a Dockerfile for the backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t csv-importer-backend .
docker run -p 5000:5000 -e CLAUDE_API_KEY=your_key csv-importer-backend
```

## Development

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
npm start
```

### Run Linting
```bash
cd backend && npm run lint
cd frontend && npm run lint
```

## Error Handling

The application gracefully handles:
- Invalid CSV files
- Missing email/mobile fields (records are skipped)
- AI processing failures (with retry information)
- Large file uploads (batch processing)
- Network errors with user-friendly messages

## Performance Considerations

- **Batch Processing**: Records are processed in batches of 10 to manage API rate limits
- **Memory Efficient**: Streaming CSV parsing to avoid loading entire files into memory
- **Table Virtualization**: Large result tables support scrolling and pagination
- **Response Caching**: Browser caching for static assets

## Security

- **CORS**: Configured for specific frontend origin
- **Input Validation**: All user inputs are validated
- **Environment Variables**: Sensitive data in .env files
- **Error Messages**: Generic error messages to prevent information leakage
- **Type Safety**: Full TypeScript for compile-time safety

## Troubleshooting

### Backend connection error
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify `NEXT_PUBLIC_API_URL` in frontend

### CSV parsing fails
- Ensure CSV is valid UTF-8
- Check column headers are not empty
- Ensure file is not corrupted

### AI extraction errors
- Verify Claude API key is valid
- Check API rate limits
- Ensure sufficient API credits

### Large file timeout
- Reduce file size
- Check network connection
- Consider implementing streaming upload

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error messages and reproduction steps

## Bonus Features Implemented

- ✅ Drag & Drop file upload
- ✅ Progress indicators during processing
- ✅ Batch processing with error handling
- ✅ Responsive design for mobile devices
- ✅ Type safety with TypeScript
- ✅ Production-ready error handling
- ✅ Clean code architecture
- ✅ API documentation
- ✅ Environment-based configuration
- ✅ Deployment-ready with Docker support

---

**Built for GrowEasy - AI-Powered CRM Lead Import**
