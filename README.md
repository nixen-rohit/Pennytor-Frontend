# Pennytor Frontend

A modern fintech/investment platform built with Next.js and React 19.

## Tech Stack

### Core
- **Next.js 16** — React framework (App Router)
- **React 19** / **React DOM 19**
- **TypeScript 5** (strict mode)

### Form Handling
- **React Hook Form** — Declarative form state management and validation
- **Input OTP** — OTP input components for verification codes

### UI / Styling
- **Tailwind CSS v4** — Utility-first CSS framework
- **shadcn/ui** — Reusable component primitives (Radix UI based)
- **Radix UI** — Accessible dialog, label, and slot primitives
- **Lucide React** — Icon library
- **React Icons** — Additional icon set
- **class-variance-authority (CVA)** — Variant-based component styling
- **clsx** + **tailwind-merge** — Conditional class merging

### Animation
- **Framer Motion** — Declarative animations

### Build / Dev Tools
- **React Compiler** - (experimental) — Automatic memoization
- **ESLint 9** with `eslint-config-next`
- **PostCSS** with `@tailwindcss/postcss`

### Fonts
- **Poppins** — Primary font
- **Playfair Display** — Accent fonts

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
