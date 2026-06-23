# FundBridge AI

FundBridge AI is a marketplace connecting businesses seeking loans with banks looking for qualified borrowers.

## Tech Stack

### Frontend
- Next.js 15
- App Router
- TypeScript
- TailwindCSS
- Shadcn UI
- Framer Motion
- React Hook Form
- Zod
- TanStack Query
- Axios

### Backend
- FastAPI
- SQLAlchemy 2.0
- Alembic
- PostgreSQL
- Pydantic v2
- JWT Authentication
- Uvicorn

## Folder Structure

- `/frontend` - Next.js frontend application
- `/backend` - FastAPI backend application
- `/docs` - Documentation

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create a virtual environment and activate it:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up the environment variables:**
   Create a `.env` file in the `backend` directory with your `DATABASE_URL` (PostgreSQL), `SECRET_KEY`, and `GROQ_API_KEY`.
5. **Run the database migrations:**
   ```bash
   alembic upgrade head
   ```
6. **Start the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install the dependencies:**
   ```bash
   npm install
   ```
3. **Set up the environment variables:**
   Create a `.env.local` file in the `frontend` directory with your API URL, typically:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Frontend Architecture

The frontend leverages Next.js App Router and strategically splits components into **Client** and **Server** components to optimize for interactivity and performance.

### Client Components (`"use client"`)
These components handle interactivity, state (like `useState`), and browser APIs.
- `frontend/app/page.tsx` (Landing Page)
- `frontend/app/register/page.tsx`
- `frontend/app/login/page.tsx`
- `frontend/app/borrow/page.tsx`
- `frontend/app/invest/page.tsx`
- `frontend/app/dashboard/business/page.tsx`
- `frontend/app/dashboard/bank/page.tsx`
- `frontend/components/layout/Navbar.tsx`
- `frontend/components/ui/SegmentedToggle.tsx`
- `frontend/components/ui/TimelineScroller.tsx`
- `frontend/components/ui/checkbox.tsx`
- `frontend/components/ui/label.tsx`
- `frontend/components/ui/progress.tsx`
- `frontend/components/ui/radio-group.tsx`
- `frontend/components/ui/select.tsx`
- `frontend/components/ui/separator.tsx`

### Server Components
These components render on the server, resulting in zero client-side JavaScript bundle size. They are used for pure presentation and layout.
- `frontend/app/layout.tsx` (Root Layout)
- `frontend/components/layout/Footer.tsx`
- `frontend/components/layout/PageContainer.tsx`
- `frontend/components/ui/AnimatedSection.tsx`
- `frontend/components/ui/EmptyState.tsx`
- `frontend/components/ui/ErrorState.tsx`
- `frontend/components/ui/Loading.tsx`
- `frontend/components/ui/accordion.tsx`
- `frontend/components/ui/badge.tsx`
- `frontend/components/ui/button.tsx`
- `frontend/components/ui/card.tsx`
- `frontend/components/ui/input.tsx`
- `frontend/components/ui/skeleton.tsx`
- `frontend/components/ui/textarea.tsx`
