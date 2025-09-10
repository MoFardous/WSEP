# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint linter
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npm run seed` - Seed database using scripts/seed.ts

## Project Architecture

This is an Arabic RTL dashboard application built with Next.js 14, featuring project management capabilities with Excel data import/export functionality.

### Key Technologies
- Next.js 14 with App Router
- TypeScript
- Prisma ORM for database management
- TailwindCSS with RTL support using Cairo font
- Radix UI components
- React Query for data fetching
- Zustand for state management

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `api/` - API endpoints (upload-excel, refresh-data, health)
  - Page routes: activities, risks, support, data-sync, data-upload
- `components/` - Reusable React components with Arabic/RTL support
- `lib/` - Utility functions, types, database connection, and data processing
- `prisma/` - Database schema and migrations
- `scripts/` - Database seeding and utility scripts

### Arabic/RTL Support
- Root layout configured with `lang="ar"` and `dir="rtl"`
- Cairo font for Arabic text rendering
- All interface types use Arabic property names
- Activity statuses: 'مكتمل', 'قيد التنفيذ', 'متأخر', 'لم يبدأ'
- Risk statuses: 'قائم', 'منتهي'

### Data Architecture
The application centers around project management data with:
- Activities organized by phases (مراحل) with Arabic field names
- Support activities (أعمال الدعم التشغيلي)
- Risk management (المخاطر والتحديات)
- Excel import/export functionality for bulk data operations

### Configuration Notes
- TypeScript build errors are not ignored in production
- ESLint errors are ignored during builds
- Images are unoptimized for deployment compatibility
- Webpack configuration includes fallbacks for client-side builds
- Optimized for Vercel deployment with compression enabled

## Database
Uses Prisma with schema defined in `prisma/schema.prisma`. Run database operations through Prisma CLI commands and use the seeding script for initial data setup.