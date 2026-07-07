# Frontend README

## GrowEasy CSV Importer - Frontend UI

Next.js 14 frontend for CSV upload and data visualization with AI extraction results.

### Quick Start

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Ensure backend is running on http://localhost:5000

# Start development server
npm run dev
```

### Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Building

```bash
npm run build
npm start
```

### Project Structure

- `app/page.tsx` - Main application page
- `app/layout.tsx` - Root layout
- `components/FileUpload.tsx` - CSV upload component
- `components/CSVPreview.tsx` - CSV preview table
- `components/Results.tsx` - Results display
- `lib/api.ts` - API client
- `styles/globals.css` - Global styles
- `public/` - Static assets

### Features

- ✅ Drag & drop CSV upload
- ✅ File picker alternative
- ✅ Live CSV preview
- ✅ Step-by-step workflow
- ✅ Beautiful result display
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive mobile design
- ✅ Tailwind CSS styling

### Development

The app is built with:
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Lucide icons

### Deployment

Deploy to Vercel with one click:
```bash
vercel
```

Make sure to set `NEXT_PUBLIC_API_URL` environment variable in Vercel dashboard.
