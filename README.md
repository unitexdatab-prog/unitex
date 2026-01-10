# UniteX

A minimalist social learning platform built with Swiss design principles.

## Features

- **Progress Feed** - Share what you're learning and building
- **Spaces** - Join communities around topics
- **Roadmaps** - Structured learning paths with progress tracking
- **Events** - Attend and reflect on learning events
- **Vault** - Private space for saved content (dark mode)
- **Gamification** - XP and badges for consistent effort

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Backend**: Node.js 20 + Express 4
- **Database**: PostgreSQL 15
- **Containerization**: Docker Compose

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Gmail account with App Password (for OTP)

### Quick Start

```bash
# Start database and API
docker-compose up -d

# Start frontend (in new terminal)
cd client
npm install
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api/health

## Design System

- Swiss Minimalism aesthetic
- High-contrast white/black palette with orange accent
- DM Sans typography
- 64px icon-only sidebar
- 3-step interactive onboarding

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Light Gray | `#F4F5F5` | Background |
| Silver | `#EBEDEE` | Surfaces |
| Dark | `#31303A` | Text |
| Orange | `#F4511C` | Accent |
| Coral | `#FF7F50` | Secondary |

## Environment Variables

Copy `.env.example` to `.env` and configure:
```
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

## License

MIT
