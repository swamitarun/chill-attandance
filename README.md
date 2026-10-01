# Chill Attendance

A modern attendance tracker for students to manage courses, lecture schedules, and attendance targets in one clean dashboard.

> ✅ This project was originally created with **Google AI Studio** and then maintained in this repository.

## Features

- Course-wise attendance tracking
- Attendance target percentage per subject
- Weekly lecture schedule management
- Dashboard with quick overview
- Local data persistence using browser storage
- Mobile + desktop friendly UI

## Tech Stack

- React
- TypeScript
- Vite
- date-fns
- Recharts
- Lucide Icons
- Google GenAI SDK (`@google/genai`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the project root and add your Gemini key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Publish / Deploy

You can deploy this Vite app on Netlify, Vercel, or any static hosting platform.

- **Build command:** `npm run build`
- **Output directory:** `dist`

## AI Studio Link

Original AI Studio app:
https://ai.studio/apps/drive/1lRrMr5bUsbagT8vWgevFM5WeccJNp60m
