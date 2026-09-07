# Square Toiletries — Recruitment Portal

Candidates fill in their full application on their own phone; HR sees every
submission in a structured dashboard and issues an appointment proposal PDF in
one click.

Field-for-field replacement for the existing Google Apps Script form, with a
real database behind it.

---

## What it does

**Public side — `/apply`**

A five-step wizard: Personal → Education → Work Experience → Compensation →
Disclosure. Everything from the old form is here, including the conditional
logic (spouse block only when married, employment history only when
"Experienced", Square-relatives table only when "Yes", manual-entry boxes on
every "Other" option) and the repeatable blocks (dependents, siblings, higher
education, experiences with previous designations, Square relatives).

Two things the old form did not do:

- **Draft autosave.** Progress is written to the candidate's own device as they
  type. If they lose signal or close the tab, they pick up where they left off.
- **Client-side photo resizing.** A 5 MB phone photo becomes a ~60 KB
  passport-size JPEG before it is uploaded.

On submit the candidate gets a reference number: `STL-2026-0001`.

**HR side — `/admin`** (password protected)

- Every application listed, newest first, with counts per status.
- Filter by position, status and date range; search by name, email, mobile, NID
  or application number.
- Full detail page: every submitted field, laid out in sections, with the photo.
- Set status (Submitted → Shortlisted → Interviewed → Selected / Rejected) and
  keep private HR notes.
- **Export CSV** — 48 columns, respects the current filters, opens cleanly in
  Excel.
- **Positions tab** — create a position and copy its apply link
  (`/apply?pos=Executive%20-%20HR`); the position is pre-filled on the
  candidate's form.

**One-click proposal**

On any candidate, enter the agreed designation, salary and joining date. The
generated PDF is a Square-letterheaded appointment proposal containing the
seven required fields — name, designation, age, NID, address, salary, joining
date — plus salary in words and a signature block. Age is calculated *as of the
joining date*, which is what the letter asserts.

Every issued proposal is stored with a reference number
(`STL/HR/AP/2026/001`) and can be re-downloaded unchanged.

---

## Running it

```bash
npm install
npx prisma generate
npm run dev                # http://localhost:3000
```

Copy `.env.example` to `.env` and fill in the three values:

```bash
cp .env.example .env
openssl rand -hex 32        # paste the result as SESSION_SECRET
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection string (plus `DATABASE_URL_UNPOOLED` for migrations) |
| `ADMIN_PASSWORD` | Password for the HR dashboard at `/admin` |
| `SESSION_SECRET` | Signs the admin session cookie; changing it signs everyone out |

> `ADMIN_PASSWORD` is the only thing protecting candidate personal data — set a
> strong one and share it out of band. `.env` is git-ignored and must stay that
> way.

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build && npm start` | Production build |
| `npx prisma studio` | Browse the database in a GUI |
| `npx prisma migrate dev --name <name>` | Apply a schema change |

---

## Deployment

Live at **https://square-toiletries-rt.vercel.app** on Vercel, backed by Neon
Postgres (provisioned through the Vercel Marketplace, so its connection
variables are injected into the project automatically).

Local development talks to the **same** Neon database, so what you see on your
machine is what candidates and HR see live. There is no separate local dataset
to keep in sync.

Three variables must be set in the Vercel project (Production and Preview):

| Variable | Source |
| --- | --- |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Injected by the Neon integration — do not set by hand |
| `ADMIN_PASSWORD` | Set manually; guards the HR dashboard |
| `SESSION_SECRET` | Set manually; `openssl rand -hex 32` |

`ADMIN_PASSWORD` and `SESSION_SECRET` are stored as **Secret** type, which means
they cannot be read back out — not from the dashboard and not via
`vercel env pull`. Record the password somewhere safe when you set it; if it is
lost the only remedy is to overwrite it:

```bash
vercel env rm ADMIN_PASSWORD production --yes
echo -n "new-password" | vercel env add ADMIN_PASSWORD production
vercel --prod          # redeploy to pick it up
```

Prisma uses `directUrl` for migrations because Neon's pooled connection runs
through pgbouncer, which cannot execute DDL.

### Moving data between databases

`scripts/export-data.ts` snapshots every application and its nested rows to
`prisma/data-export.json`; `scripts/import-data.ts` replays that snapshot into
whatever `DATABASE_URL` currently points at, skipping applications whose
reference number is already present. The snapshot contains NIDs, addresses and
photographs, so it is git-ignored and should be deleted once used.

## Data model

`Application` holds the flat fields and links to the repeatable ones:

```
Application ─┬─ Dependent
             ├─ Sibling
             ├─ HigherEducation
             ├─ Experience ── Promotion
             ├─ SquareRelation
             └─ Proposal
```

`Position` is a separate table HR manages; applications store the position as
text exactly as the candidate submitted it, so renaming or deleting a position
never rewrites history.

The candidate photo is stored as a data URL on the application row rather than
in blob storage — passport photos are small, and it keeps the deployment to a
single database with no second service to configure or secure.

---

## Layout

```
src/
  app/
    apply/                     candidate form page
    admin/
      login/                   password screen
      (dash)/                  everything behind the auth guard
        page.tsx               applications list + filters
        applications/[id]/     detail, status, notes, proposal panel
        positions/             position management + apply links
    api/
      applications/            public submission endpoint
      admin/proposals/         create proposal, render PDF
      admin/export/            CSV export
  components/apply/            the five wizard steps + shared fields
  lib/
    application-schema.ts      one zod schema, used by client and server
    options.ts                 every dropdown list, copied from the old form
    proposal-pdf.tsx           the appointment proposal document
    auth.ts, prisma.ts, utils.ts
```

Validation lives in a single schema that both the browser and the API run, so
the server never trusts the client but the candidate still gets instant
feedback.

---

## Test data

Six sample applications carried over from development are in the live database.
Delete them from the dashboard: open a candidate and use **Danger Zone → Delete
application**, which also removes their proposals and documents.
