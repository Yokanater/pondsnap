# PondSnap

A minimal, modern, nature-inspired web application for capturing, naming, and mapping ponds.

## Stack

- Frontend: Next.js + TailwindCSS
- Backend: Express.js
- Database: MongoDB Atlas
- Image Storage: (S3 or Cloudinary) – configurable (Cloudinary scaffolded)
- Map: Leaflet (default) with OpenStreetMap tiles

## Apps

- `frontend/` Next.js App Router
- `backend/` Express API server

## Features
- Capture/upload pond photo (mobile friendly)
- Auto geolocation
- Pond naming (with autosuggest)
- Optional note (<=200 chars)
- Store to MongoDB (image URL + metadata)
- Interactive map of ponds with popups
- Dark mode toggle
- Export all pond data as JSON

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI
- Cloudinary account (for image hosting) OR adjust code to use S3

### Environment Variables
Create `backend/.env`:
```
MONGODB_URI=your_mongodb_atlas_uri
PORT=4000
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

### Install & Run
In one terminal:
```
cd backend
npm install
npm run dev
```
In another:
```
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

## Production Notes
- Consider adding authentication if needed.
- Rate limit / validation hardening for API.
- Switch to S3 signed uploads if preferred.
- Add pagination if pond list grows large.

## License
MIT
