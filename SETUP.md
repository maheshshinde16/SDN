# Setup Checklist

## Backend Setup

- [ ] Navigate to `backend` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Add your Claude API key to `.env`
  ```
  CLAUDE_API_KEY=sk-...
  PORT=5000
  NODE_ENV=development
  FRONTEND_URL=http://localhost:3000
  ```
- [ ] Run `npm install`
- [ ] Run `npm run dev` (should start on http://localhost:5000)
- [ ] Verify `GET http://localhost:5000/api/health` returns `{"status":"ok"}`

## Frontend Setup

- [ ] Navigate to `frontend` directory
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Run `npm install`
- [ ] Run `npm run dev` (should start on http://localhost:3000)
- [ ] Verify the app loads and shows the upload interface

## Testing

- [ ] Use `sample.csv` in the root directory to test the upload
- [ ] Verify CSV preview shows data correctly
- [ ] Click "Proceed to Import" to test AI extraction
- [ ] Check results showing successful and skipped records

## Deployment Preparation

- [ ] Create GitHub repository and push code
- [ ] Set up Vercel account and connect frontend repo
- [ ] Set up Railway account and connect backend repo
- [ ] Add environment variables to Vercel:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-railway-url
  ```
- [ ] Add environment variables to Railway:
  ```
  CLAUDE_API_KEY=sk-...
  FRONTEND_URL=https://your-frontend-vercel-url
  ```

## Production Launch

- [ ] Test end-to-end on production URLs
- [ ] Verify CORS allows both frontend and backend
- [ ] Test with various CSV formats
- [ ] Monitor API rate limits
- [ ] Set up error tracking (optional)

## Submission

- [ ] Hosted application URL (Vercel frontend)
- [ ] GitHub repository URL (public)
- [ ] Position you are applying for (Intern/Full-Time)
- [ ] Email to: varun@groweasy.ai
- [ ] Include README with setup instructions

## Bonus Features (Optional)

- [ ] Add dark mode
- [ ] Add unit tests
- [ ] Add Docker setup documentation
- [ ] Add progress bar during AI processing
- [ ] Add virtualized table for large datasets
- [ ] Add retry mechanism for failed batches
- [ ] Add streaming upload for large files
