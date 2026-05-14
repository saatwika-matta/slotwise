# SlotWise — Internal Booking & Scheduling Tool

> **"Turning complex scheduling into simple flows."**

SlotWise is a full-stack internal scheduling tool where staff add their availability, guests book time slots, and admins manage everything from a live dashboard — all in one place.

🔗 **Live App:** [slotwise-app.vercel.app](https://slotwise-app.vercel.app)  
🐙 **GitHub:** [github.com/saatwika-matta/slotwise](https://github.com/saatwika-matta/slotwise)

---

## 🚀 What It Does

Most scheduling tools are either too heavy or disconnected from internal workflows. SlotWise was built to solve a real coordination problem — teams waste time in back-and-forth scheduling. This tool gives every stakeholder exactly what they need:

| Role | What They Can Do |
|---|---|
| **Staff** | Add available time slots via a simple form |
| **Guest** | Browse open slots, pick one, and book in seconds |
| **Admin** | View all bookings, track upcoming vs past, and cancel when needed |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Version Control | GitHub |
| AI Dev Tool | Cursor AI |

---

## 📁 Project Structure

```
slotwise/
├── app/
│   ├── page.tsx              # Homepage
│   ├── slots/page.tsx        # Staff availability form
│   ├── book/page.tsx         # Guest booking page
│   ├── admin/page.tsx        # Admin dashboard
│   └── actions/
│       ├── slots.ts          # Server action: create slots
│       ├── bookings.ts       # Server action: fetch & create bookings
│       └── admin.ts          # Server action: fetch & cancel bookings
├── components/
│   └── Navbar.tsx            # Global navigation
├── lib/
│   └── prisma.ts             # Prisma client singleton
└── prisma/
    └── schema.prisma         # Database schema
```

---

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  role      String   @default("staff")
  slots     Slot[]
  createdAt DateTime @default(now())
}

model Slot {
  id        String    @id @default(cuid())
  staffId   String
  staff     User      @relation(fields: [staffId], references: [id])
  startTime DateTime
  endTime   DateTime
  isBooked  Boolean   @default(false)
  booking   Booking?
  createdAt DateTime  @default(now())
}

model Booking {
  id         String   @id @default(cuid())
  slotId     String   @unique
  slot       Slot     @relation(fields: [slotId], references: [id])
  guestName  String
  guestEmail String
  reason     String?
  createdAt  DateTime @default(now())
}
```

---

## ⚙️ Running Locally

```bash
# Clone the repo
git clone https://github.com/saatwika-matta/slotwise.git
cd slotwise

# Install dependencies
npm install

# Add environment variables
# Create a .env file and add your Supabase connection string:
# DATABASE_URL="postgresql://..."

# Push schema to database
npx prisma db push
npx prisma generate

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 Built with AI-Native Development

This project was built using **Cursor AI** as a core part of the development workflow — not as an afterthought.

### Where Cursor saved the most time

| Task | Without AI | With Cursor AI |
|---|---|---|
| Prisma schema design | ~1 hour | ~10 minutes |
| Server action boilerplate | ~45 mins | ~5 minutes |
| TypeScript error debugging | ~30 mins per error | Diagnosed inline in seconds |
| Deployment troubleshooting | Googling for hours | Root cause identified immediately |

### Specific examples

- **Schema generation:** Generated the initial `User`, `Slot`, and `Booking` Prisma schema from a plain-English description, cutting ~1 hour of setup to 10 minutes.
- **Server actions:** Scaffolded full server actions for slot creation, booking, and admin cancellation from single prompts — including edge case handling like double-booking prevention.
- **Debugging:** Caught multiple TypeScript type mismatches between Prisma's `Date` objects and component prop types that would have taken 30+ minutes to track down manually.
- **Deployment:** Identified that `prisma.config.ts` was causing TypeScript build failures on Vercel — a non-obvious root cause that Cursor surfaced immediately.

### Estimated time saved
~6–8 hours across a 5-day build at 1 hour/day.

---

## 🎤 Key Engineering Decisions

**Why Supabase?**
Free managed Postgres with a generous free tier, connection pooling built in, and a clean dashboard for data inspection during development.

**Why Server Actions over API Routes?**
Next.js server actions reduce boilerplate significantly — no need to create separate API route files for each operation. Form data flows directly from the client to the database with minimal code.

**Why Prisma?**
Type-safe database queries that integrate directly with TypeScript. Errors surface at compile time rather than runtime, which is especially valuable in a solo build.

**Production-readiness decisions:**
- Double-booking prevention: slot is atomically marked as `isBooked: true` when a booking is created
- Admin auth-ready: admin page is structured to accept NextAuth protection in a future iteration
- Environment variables: all sensitive config kept out of source via `.env` and Vercel environment settings

---

## 📸 Screenshots

| Page | Description |
|---|---|
| `/` | Homepage with hero and navigation |
| `/slots` | Staff availability form |
| `/book` | Guest booking page with slot picker |
| `/admin` | Admin dashboard with bookings table |

---

## 🔮 Future Improvements

- [ ] Email notifications on booking confirmation (Resend API)
- [ ] Admin authentication with NextAuth
- [ ] Date range filtering on admin dashboard
- [ ] Calendar view for slot visualization
- [ ] Multi-timezone support

---

## 👩‍💻 Author

**Saatwika Matta**  
Full-Stack Software Engineer  
[LinkedIn](https://www.linkedin.com/in/saatwikamatta/) · [GitHub](https://github.com/saatwika-matta) · [Portfolio](https://saatwika-ai-portfolio.vercel.app)