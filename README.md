# Kriswin Infotech Private Limited — Website

Company website for **kriswin-infotech.com**, built with Next.js 16 + PostgreSQL + Prisma 7 + Bootstrap 5.3, with a built-in admin panel.

**Public pages:** Home · Services (mega menu + detail pages) · Products (+ detail pages) · Portfolio / Case Studies (+ detail pages) · About Us · Contact

**Home page sections:** hero, trusted-by strip, problems we solve, services, stats, success stories, why choose us, products, process, technologies (tabs), industries, testimonials, free-consultation form, FAQ, call-to-action.

**Admin panel (`/admin`):** edit site settings, Home & About content, brand colour, contact & social links, services, products (e.g. EasyBillo), case studies, team, testimonials, read contact enquiries, change admin password.

## Tech stack
- Next.js 16 (App Router, Server Actions, Turbopack), React 19, TypeScript
- PostgreSQL + Prisma ORM 7 (with `@prisma/adapter-pg`)
- Bootstrap 5.3 + Bootstrap Icons, Plus Jakarta Sans font
- JWT cookie auth (`jose`) + `bcryptjs` password hashing

## Requirements
- Node.js 20.19+ (22 LTS recommended)
- PostgreSQL 14+ (or run `docker compose up -d` to start one locally)

## Setup
```bash
npm install                 # also runs `prisma generate`
cp .env.example .env        # then edit DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run setup               # creates tables + seeds sample content and the admin user
npm run dev                 # http://localhost:3000
```

Admin panel: http://localhost:3000/admin — log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`
(defaults in `.env.example`: `admin@kriswin-infotech.com` / `Admin@123`). **Change the password after first login** (Admin → My Account).

## Upgrading from the previous version
If you already ran the first version of this project:
```bash
npm install
npx prisma migrate deploy   # adds the new columns and the CaseStudy table
npm run db:seed             # loads the Kriswin Infotech content
```
The seed replaces the old NexaByte sample content only while the company name is still "NexaByte Technologies". After that it never overwrites your edits — it only fills sections that are empty.

## Windows: "Turbopack is not supported … native bindings"
This means the Next.js compiler binary was not downloaded correctly. Delete `node_modules`, `.next` and `package-lock.json`, run `npm cache clean --force`, then `npm install` again. As a temporary fallback you can use `npm run dev:webpack` / `npm run build:webpack`.

## Production
```bash
npm run build
npm run db:deploy           # apply migrations on the production database
npm start
```
- Set a long random `AUTH_SECRET` and `SITE_URL=https://kriswin-infotech.com` in production.
- Uploaded images are stored in the `uploads/` folder and served at `/uploads/...`. Keep this folder on persistent storage (or back it up).
- Works on any Node host (VPS, Railway, Render, etc.). On serverless hosts like Vercel the `uploads/` folder is not persistent — use image URLs instead of uploads there.

## Editing the database schema
Edit `prisma/schema.prisma`, then run `npm run db:migrate -- --name your_change`.

## Project structure
```
prisma/                 schema, migrations, seed data
src/app/(site)/         public website pages
src/app/admin/          admin login + panel pages, server actions (actions.ts)
src/components/site/    navbar, footer, cards, CTA
src/components/admin/   sidebar and form fields
src/lib/                prisma client, auth, data helpers
src/proxy.ts            protects /admin routes
src/app/globals.css     theme & design (brand colour comes from Admin → Settings)
```

## Tips
- Icons: any name from https://icons.getbootstrap.com (e.g. `bi-cloud`, `bi-phone`).
- List-style content in Admin → Settings uses one item per line with `|` separators, e.g. Why choose us / Problems: `icon | Title | Description`, Technologies: `Category | Tech1, Tech2`, Industries: `icon | Name`, FAQs: `Question | Answer`, Core values: `Title | Description`.
- Hide anything without deleting it by switching off **Published**.
