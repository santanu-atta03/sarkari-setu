# Feature: Job Posting API — SarkariSetu
Status: IMPLEMENTED

## Description
Admin-managed government job postings with full SEO, eligibility,
important dates, vacancy breakdown, and JSON-LD schema markup.

## Fields
- title, slug (auto-generated + unique), organization, department
- state, district, jobType, qualification, category
- shortDescription, fullContent (rich HTML)
- notificationPdfUrl, applyOnlineUrl, officialWebsite
- featuredImage, tags, status (draft/published/archived/expired)
- isTrending, isFeatured, publishedAt, expiresAt
- viewCount, bookmarkCount, shareCount
- eligibility (minAge, maxAge, ageRelaxation, qualifications, experience, otherCriteria)
- importantDates (applicationStart/End, examDate, admitCardDate, resultDate, customDates)
- applicationFee (general, obc, scSt, exServicemen, female, paymentMode)
- vacancy (total, general, obc, sc, st, ews, ph, breakdown[])
- salaryMin, salaryMax, salaryUnit
- seo (metaTitle, metaDescription, keywords, canonicalUrl, ogImage, schemaMarkup)
- faqs[], relatedJobs[], createdBy, lastEditedBy

## SEO Metadata
- Auto-generated metaTitle and metaDescription from title/shortDescription
- JSON-LD JobPosting schema.org markup auto-built on save

## Slug
- Auto-generated from title using slugify (lower, strict, trim)
- Collision resolution: appends `-1`, `-2`, ... suffix
- Unique index enforced at DB level

## Validation
- Joi schemas for create, update, and list query
- Middleware factories: validateBody, validateQuery
- Returns structured 422 with per-field error list

## API Endpoints
| Method | Path                    | Auth          | Description                    |
|--------|-------------------------|---------------|-------------------------------|
| GET    | /api/jobs               | Public        | List published jobs (filtered) |
| GET    | /api/jobs/trending      | Public        | Trending jobs                  |
| GET    | /api/jobs/slugs         | Public        | All slugs (SSG/sitemap)        |
| GET    | /api/jobs/:identifier   | Public        | Single job by slug or ID       |
| GET    | /api/jobs/:id/related   | Public        | Related jobs                   |
| POST   | /api/jobs               | Admin JWT     | Create job                     |
| PATCH  | /api/jobs/:id           | Admin JWT     | Update job                     |
| PATCH  | /api/jobs/:id/publish   | Admin JWT     | Toggle publish status          |
| DELETE | /api/jobs/:id           | super_admin   | Delete job                     |
| GET    | /api/auth/login         | —             | Admin login → JWT              |
| GET    | /api/auth/me            | Admin JWT     | Current admin profile          |
| POST   | /api/auth/seed-admin    | Dev only      | Create first super admin       |

## Files Created
- backend/src/models/Job.js
- backend/src/models/Admin.js
- backend/src/controllers/jobController.js
- backend/src/controllers/authController.js
- backend/src/middleware/auth.js
- backend/src/middleware/errorHandler.js
- backend/src/routes/jobRoutes.js
- backend/src/routes/authRoutes.js
- backend/src/validators/jobValidator.js
- backend/src/config/db.js
- backend/src/app.js
- backend/server.js
- backend/.env (+ .env.example)
- backend/package.json