<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Neural Dither AI

Advanced digital rendering and neural processing visualization built with React, Three.js, and Gemini AI.

## Quick Start

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your Gemini API key to .env.local
# Get one at: https://aistudio.google.com/apikey

# Start development server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run test:e2e` | Run Playwright E2E tests |

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `VITE_SENTRY_DSN` | No | Sentry DSN for error monitoring |

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/neural-dither-ai)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
# Build image
docker build -t neural-dither-ai .

# Run container
docker run -p 80:80 neural-dither-ai
```

### Manual Build

```bash
npm run build
# Serve the `dist` folder with any static file server
```

## Architecture

```
├── components/       # React components
│   ├── sections/     # Page sections
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── services/         # API services (Gemini)
├── stores/           # Zustand state management
├── src/
│   └── lib/          # Utilities (config, rate limiting, Sentry)
└── e2e/              # Playwright E2E tests
```

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **3D:** Three.js, React Three Fiber, Drei
- **State:** Zustand
- **AI:** Google Gemini API
- **Testing:** Vitest, Playwright
- **Build:** Vite

## License

MIT
