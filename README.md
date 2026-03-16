# 🍳 Recipe Management App

A full-stack Recipe Management Application built with Next.js 14+ App Router.

## 🚀 Live Demo
[View on Vercel](YOUR_VERCEL_URL)

## 🛠️ Tech Stack
- **Next.js 14+** — App Router, Server + Client Components
- **TypeScript** — Strict mode, no `any`
- **Redux Toolkit** — Recipe + Cookbook slices
- **Context API** — Cooking preferences, unit system, theme
- **Tailwind CSS + shadcn/ui** — Styling
- **Vercel** — Deployment

## ✨ Features
- Browse vegetarian recipes with filters
- Ingredient scaling with serving adjuster
- Metric / Imperial unit conversion
- Per-step countdown timers
- Personal cookbook with localStorage persistence
- Create / Edit / Delete recipes
- Star rating system
- Dark / Light theme
- Protected manage routes via middleware

## 📦 Installation

\`\`\`bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/recipe-management-app.git

# Navigate into project
cd recipe-management-app

# Install dependencies
npm install

# Add environment variable
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" > .env.local

# Run dev server
npm run dev
\`\`\`

## 📁 Folder Structure
\`\`\`
app/          → Pages + API routes
components/   → Reusable UI components
context/      → CookingContext
hooks/        → Custom hooks
lib/          → Utilities + data store
store/        → Redux slices
types/        → TypeScript types
\`\`\`

## 🔑 Environment Variables
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`