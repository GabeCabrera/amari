# Amari - Wedding Planning Project Management

A lightweight project-management web app for wedding planning, modeled after ClickUp or Jira — but tailored for planners and couples.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:GabeCabrera/amari.git
   cd amari
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the contents of `db/schema.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel

## Project Structure

```
amari/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   └── ...
├── components/       # React components
│   └── ui/           # Shadcn UI components
├── db/               # Database schemas and migrations
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configs
│   └── supabase/     # Supabase client configs
├── types/            # TypeScript type definitions
└── constitution.md   # Development guidelines
```

## Features (Planned)

### Phase 1 - MVP
- [ ] User authentication with role-based access (Planner, Couple, Vendor)
- [ ] Wedding workspace creation and management
- [ ] Task board (Kanban/List view)
- [ ] File uploads and management
- [ ] Real-time notifications
- [ ] Dashboard UI

### Phase 2 - Collaboration
- [ ] Comments and chat
- [ ] Role-based views
- [ ] Shared timelines
- [ ] Vendor invitations

### Phase 3 - SaaS Expansion
- [ ] Stripe billing integration
- [ ] Admin portal for planners
- [ ] AI wedding planning assistant

## Development Guidelines

See [constitution.md](./constitution.md) for:
- Development philosophy
- Architecture decisions
- Coding standards
- AI-assisted development guidelines

## Database Schema

The database includes:
- **users**: User profiles with roles
- **weddings**: Wedding projects/workspaces
- **wedding_members**: Shared access management
- **tasks**: Task management with assignments
- **files**: File storage metadata
- **messages**: Comments and communication

See `db/schema.sql` for the complete schema with RLS policies.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

This project follows conventional commits and requires all features to meet the Definition of Done criteria outlined in the constitution.

## License

Open for internal AI-assisted development of Amari.

---

**Author**: Gabriel Cabrera  
**Version**: 1.0
