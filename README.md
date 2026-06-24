# FundBridge

FundBridge is a marketplace connecting businesses seeking loans with banks looking for qualified borrowers.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- Shadcn UI
- Framer Motion
- Zod
- Axios

### Backend
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL - db
- Uvicorn

## Folder Structure

- `/frontend` - Next.js frontend application
- `/backend` - FastAPI backend application
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
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Then, update `.env` with your `DATABASE_URL`, `SECRET_KEY`, and `GROQ_API_KEY`.
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
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Then, update `.env.local` if your API URL is different from the default (`http://localhost:8000/api/v1`).
4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Client Components
since these components make use of hooks, browser DOM actions and localhost, they are made client components using "use client"
- `frontend/app/page.tsx` (Landing Page)
- `frontend/app/register/page.tsx`
- `frontend/app/login/page.tsx`
- `frontend/app/borrow/page.tsx`
- `frontend/app/invest/page.tsx`
- `frontend/app/dashboard/business/page.tsx`
- `frontend/app/dashboard/bank/page.tsx`
- `frontend/app/dashboard/admin/page.tsx`
- `frontend/app/dashboard/admin/review/[id]/page.tsx`
- `frontend/app/contact/page.tsx`
- `frontend/app/privacy/page.tsx`
- `frontend/app/terms/page.tsx`
- `frontend/contexts/AuthContext.tsx`
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
These components render on the server, which result in zero javascript bundle size on the client and faster execution, this all reusable components are made server compoenents
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


### Choice of DB

- PostgreSQL + SQLAlchemy on Neon  since the backend framework i have used is FastAPI and the ORM for it is SQLAlchemy
- Prisma(preferred stack) is the ORM for typescript and javascript applications

### Flow

[1] Business -> registers -> compute score -> find best matched banks -> applies -> admin receives -> admin reviews(forward/reject)
[2] Banks -> registers -> find potential applicants -> view details -> compare

[1] -> [2] -> bank reveives -> bank reviews -> approves/rejects/waitlists -> status updated to business


### AI features:

- compute AI readiness score
- provide a summary about the business to banks
- provide insights about the business to owners
- interactive chatbot to businesses
- Generate reports for buisness insights

### Matching rule

- Revenue 20
- Debt Ratio 25
- Years 15
- Tenure 10
- Industry 10
- Location 5
- GST 5
- Documents 10

These are compared to the bank's requirements and if they align, the buisness is awarded the points assigned and aggregated at the end

### Tradeoffs

- since we have to store businesses documents, ideally we would require blob storage such as AWS S3, since it was not free, i have pushed documents into the db
- vercel free deployements dont allow payload size more that 4.5mb and instantly blocks anything higher, so i could not implement business' documents to flow froma req to the admin dashboard for the admin to review