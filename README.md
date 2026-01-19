# Real Estate Survey App - 3561 W Dublin St

A Next.js real estate survey application for collecting professional opinions about a property, featuring a 3-step survey flow and admin dashboard for data visualization.

## Features

- **Magic Link Support**: Handle email links with automatic data saving
- **3-Step Survey Flow**: Price range selection → Follow-up consent → Detailed questions
- **Admin Dashboard**: Visualize responses with charts and sentiment analysis
- **Mobile-First Design**: High-contrast, accessible UI with large tap targets
- **Supabase Integration**: Real-time database for survey responses

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Backend/Database)
- **Lucide React** (Icons)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Create the `responses` table with the following SQL:

```sql
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  initial_range TEXT NOT NULL,
  specific_price TEXT,
  best_feature TEXT,
  improvement_note TEXT,
  agent_email TEXT
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for the survey)
CREATE POLICY "Allow public inserts" ON responses
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows anyone to read (for the admin dashboard)
CREATE POLICY "Allow public reads" ON responses
  FOR SELECT
  USING (true);
```

3. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon/public` key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Survey Flow

1. **Entry Point**: `/` - Handles magic links or redirects to Step 1
2. **Step 1**: `/survey/step1` - Price range selection
3. **Step 2**: `/survey/step2` - Follow-up consent
4. **Step 3**: `/survey/step3` - Detailed questions
5. **Success**: `/survey/success` - Thank you message

### Magic Links

Send links in this format:
```
https://yourdomain.com/?range=$601k–$700k&email=agent@example.com
```

The app will automatically save the initial range and email, then skip to Step 2.

### Admin Dashboard

Access the admin dashboard at:
```
/admin-dashboard
```

The dashboard shows:
- Price range distribution (bar chart)
- Most popular best features
- Common improvement themes
- All improvement comments with timestamps

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Entry point (handles magic links)
│   ├── survey/                 # Survey flow pages
│   │   ├── step1/
│   │   ├── step2/
│   │   ├── step3/
│   │   └── success/
│   └── admin-dashboard/        # Admin data visualization
├── components/                 # Reusable components
│   ├── PriceButton.tsx
│   ├── SurveyLayout.tsx
│   └── AdminChart.tsx
├── lib/
│   └── supabase.ts            # Supabase client
└── types/
    └── survey.ts              # TypeScript types
```

## Design Principles

- **High Contrast**: Navy blue (#1e3a8a) on white background
- **Accessibility**: All buttons have 48px minimum height for mobile tap targets
- **Simple Language**: No jargon, easy to understand
- **Mobile-First**: Responsive design that works on all devices

## License

Private project for 3561 W Dublin St real estate survey.