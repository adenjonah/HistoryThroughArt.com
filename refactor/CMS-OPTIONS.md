# CMS Options Evaluation

## Requirements

| Requirement | Priority | Notes |
|-------------|----------|-------|
| Free tier available | Must have | Budget-conscious |
| Headless (API-first) | Must have | React frontend |
| Image hosting included | Must have | 407 images, ~54MB |
| Simple admin UI | Must have | Non-technical editors |
| Good React/JS SDK | Should have | Easier integration |
| Generous free limits | Should have | 250 artworks + growth |
| Self-hostable option | Nice to have | Future flexibility |

---

## Option 1: Sanity (Recommended)

**Website:** https://sanity.io

### Pros
- Excellent free tier (generous for small projects)
- Beautiful, customizable admin UI (Sanity Studio)
- Real-time collaborative editing
- Great React tooling (GROQ query language, next-sanity)
- Built-in image CDN with transformations
- Portable (can self-host Studio)
- Active community and docs

### Cons
- Learning curve for GROQ queries
- Studio customization requires code
- API usage limits on free tier (but generous)

### Free Tier Limits
- 100K API requests/month
- 500K API CDN requests/month
- 10GB bandwidth
- 5GB assets
- 3 users

### Fit for This Project
**Excellent.** 250 artworks with images fits comfortably. Image CDN handles all 407 images. Admin UI is intuitive.

---

## Option 2: Strapi (Self-Hosted)

**Website:** https://strapi.io

### Pros
- Fully open source
- Complete control (self-hosted)
- Very flexible content modeling
- REST + GraphQL APIs
- No vendor lock-in
- Large plugin ecosystem

### Cons
- Requires hosting (not free unless you host yourself)
- More setup/maintenance work
- Need to manage database, backups, etc.
- Cloud offering is paid

### Hosting Options
- Railway, Render, Fly.io (free tiers available but limited)
- Adds complexity vs managed CMS

### Fit for This Project
**Good if you want full control.** Adds infrastructure complexity. Better for teams with DevOps capacity.

---

## Option 3: Contentful

**Website:** https://contentful.com

### Pros
- Industry standard headless CMS
- Excellent SDK and documentation
- Powerful content modeling
- Great webhooks and integrations

### Cons
- Free tier is limited (5 users, 25K records, 2 locales)
- Can get expensive at scale
- Image handling not as elegant as Sanity

### Free Tier Limits
- 25,000 records
- 2 locales
- 5 users
- 48MB asset upload limit per file

### Fit for This Project
**Good but may hit limits.** 250 artworks is fine, but growth or additional content types could push past free tier.

---

## Option 4: Hygraph (formerly GraphCMS)

**Website:** https://hygraph.com

### Pros
- GraphQL-native (great for complex queries)
- Good content modeling
- Asset management included
- Remote sources feature

### Cons
- GraphQL can be overkill for simple needs
- Free tier has rate limits
- UI less polished than Sanity

### Free Tier Limits
- 1M API operations/month
- 100GB asset traffic
- 2 users

### Fit for This Project
**Good option.** GraphQL might be more than needed, but free tier is generous.

---

## Option 5: Notion + Super/Notion API

**Website:** https://notion.so + https://super.so

### Pros
- Extremely easy content editing
- Many people already know Notion
- Super.so provides fast hosting
- Very cheap

### Cons
- API is slower than dedicated CMS
- Limited content modeling
- Not designed for this use case
- Rate limits can be an issue

### Fit for This Project
**Possible but not ideal.** Works for simple blogs, less suitable for structured data like artwork records.

---

## Option 6: Directus

**Website:** https://directus.io

### Pros
- Open source, self-hostable
- Works with any SQL database
- Good admin UI
- REST + GraphQL

### Cons
- Requires hosting (like Strapi)
- Directus Cloud is paid
- Smaller community than Strapi

### Fit for This Project
**Similar to Strapi.** Good if self-hosting, adds complexity otherwise.

---

## Comparison Matrix

| CMS | Free Tier | Image CDN | Admin UX | React SDK | Setup Effort |
|-----|-----------|-----------|----------|-----------|--------------|
| **Sanity** | Excellent | Yes | Excellent | Excellent | Low |
| Strapi | N/A* | No | Good | Good | High |
| Contentful | Good | Yes | Good | Excellent | Low |
| Hygraph | Excellent | Yes | Good | Good | Low |
| Notion | Yes | No | Excellent | Poor | Low |
| Directus | N/A* | No | Good | Good | High |

*Self-hosted required for free

---

## Recommendation

### Primary: **Sanity**

**Why:**
1. Free tier comfortably fits 250 artworks + images
2. Built-in image CDN with on-the-fly transformations
3. Excellent developer experience with React
4. Intuitive admin UI for non-technical users
5. Can customize Studio to match exact needs
6. Strong community and documentation
7. No hosting to manage

### Backup: **Contentful**

If Sanity doesn't work out for any reason, Contentful is the next best option with similar managed simplicity.

---

## Next Steps

1. Create Sanity account and project
2. Design content schema matching `artworks.json` structure
3. Test admin UI with sample artwork
4. Test API queries from React
5. Confirm image upload/CDN workflow
6. Make final decision

---

## Migration Estimate

| Step | Effort |
|------|--------|
| Schema design | 1-2 hours |
| Migration script | 2-4 hours |
| Image upload | 1-2 hours (mostly automated) |
| API integration | 4-8 hours |
| Testing | 2-4 hours |
| **Total** | ~10-20 hours |

---

*Last updated: 2026-01-24*
