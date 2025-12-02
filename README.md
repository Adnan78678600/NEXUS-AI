<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# NEXUS AI

**Cyberpunk-themed interactive web experience with 3D shader visualizations and AI-powered terminal**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/neural-dither-ai)

</div>

## Features

- **3D Dithered Shader Cube** - Dynamic WebGL visualization with custom GLSL shaders and smooth color transitions
- **Scroll-Driven Experience** - 5 immersive sections (Hero, Identity, Grid, Metrics, Terminal) with parallax animations
- **AI-Powered Terminal** - Interactive command interface powered by Google Gemini for cyberpunk-style responses
- **Procedural Audio** - Reactive sound system that responds to scroll position and mouse movement
- **Particle Star Field** - Animated cosmic background with 5000+ stars
- **Responsive Design** - Fully optimized for desktop and mobile devices

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **AI** | Google Gemini API |
| **State** | Zustand |
| **Animations** | GSAP, CSS Transitions |
| **Icons** | Lucide React |
| **Build** | Vite |
| **Testing** | Vitest, Playwright |
| **Monitoring** | Sentry |

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

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |
| `VITE_SENTRY_DSN` | No | Sentry DSN for error monitoring |

## Architecture

```
├── components/
│   ├── sections/        # Page sections (Hero, Identity, Grid, Metrics, Terminal)
│   ├── ui/              # Reusable UI components
│   ├── DitherScene.tsx  # Main 3D canvas with scroll controls
│   ├── DitherShader.tsx # Custom GLSL shader material
│   └── Navbar.tsx       # Navigation component
├── hooks/
│   └── useProceduralAudio.ts  # Reactive audio system
├── services/
│   └── gemini.ts        # Gemini AI integration
├── stores/
│   └── useAppStore.ts   # Zustand state management
├── src/
│   └── lib/             # Utilities (config, rate limiting, Sentry)
└── e2e/                 # Playwright E2E tests
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
docker build -t nexus-ai .
docker run -p 80:80 nexus-ai
```

### Manual

```bash
npm run build
# Serve the dist folder with any static file server
```

## License

MIT
