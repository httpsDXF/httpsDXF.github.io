# Go live (full stack)

Your site is split into **two public pieces**:

| Piece | What it is | Typical host |
|--------|------------|----------------|
| **Frontend** | Static Next.js export (`frontend/out/`) | **GitHub Pages** (already wired via Actions) |
| **Backend** | Django API + uploads | **AWS Elastic Beanstalk** (or any host that runs Gunicorn + Postgres) |

SQLite and local `media/` folders are **not** enough for production; you need **PostgreSQL** and usually **S3** for uploads. Step-by-step for AWS: **[AWS_DEPLOY.md](./AWS_DEPLOY.md)**.

---

## Checklist (do in order)

### 1. Backend: database + API host

1. Create **PostgreSQL** (e.g. AWS RDS) and note host, user, password, database name.
2. Create **S3 bucket** for blog/experiment files (same region as the API).
3. Deploy **`backend/`** (Elastic Beanstalk is documented in `AWS_DEPLOY.md`).
4. In the hosting **environment variables**, set at least:

   - `DJANGO_SECRET_KEY` — long random string  
   - `DJANGO_DEBUG` = `false`  
   - `DJANGO_ALLOWED_HOSTS` — your API hostname(s), comma-separated  
   - `DATABASE_URL` — `postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require`  
   - `DJANGO_CORS_ORIGINS` — **exact** frontend URLs, comma-separated, **no trailing slash**, e.g.  
     `https://httpsdxf.github.io,https://httpsdxf.me`  
   - `DJANGO_CSRF_TRUSTED_ORIGINS` — your API URL(s) with `https://`  
   - `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION_NAME`, `AWS_DEFAULT_REGION`  
   - IAM on the EC2 role so the app can read/write the S3 bucket  

5. Confirm **`GET https://your-api-host/api/health/`** returns OK in a browser.
6. Create a **staff user** (SSH/EB console or one-off command):  
   `python manage.py createsuperuser`

### 2. Frontend: bake in the API URL

The static site must know where the API lives **at build time**.

1. GitHub repo → **Settings → Secrets and variables → Actions → Variables**.  
2. Add variable **`NEXT_PUBLIC_API_URL`** = `https://your-api-host` (no trailing slash).  
3. Push to **`main`** or run **Actions → Deploy site to GitHub Pages → Run workflow**.  
4. After deploy, open the site and check the network tab: API calls should go to your host.

### 3. GitHub Pages

1. Repo → **Settings → Pages**: **Source** = **GitHub Actions** (not “Deploy from branch” only).  
2. Wait for the workflow to finish; note the **published URL** (e.g. `https://<user>.github.io/<repo>/`).

### 4. Custom domain (optional)

1. **DNS** at your registrar: add records GitHub shows for Pages (A/AAAA/CNAME).  
2. Repo → **Pages** → **Custom domain** → add `httpsdxf.me` (or `www`).  
3. Add the **same** origin (with `https://`) to `DJANGO_CORS_ORIGINS` and redeploy the API if needed.

### 5. HTTPS

- GitHub Pages serves the frontend over HTTPS.  
- The API must be reachable over **HTTPS** in production (Beanstalk / ALB / reverse proxy).  
- Browsers block mixed content if the site is HTTPS but the API is only HTTP on another origin.

---

## If something breaks

- **CORS errors** — Origin must match `DJANGO_CORS_ORIGINS` exactly (scheme + host; no path).  
- **502 on API** — Check EB logs; often bad `DATABASE_URL` or missing env.  
- **Blog/images 404** — S3 bucket name, region, IAM policy, or `MEDIA_URL` / storage config.  
- **Frontend still shows placeholders** — `NEXT_PUBLIC_API_URL` missing/wrong at **build** time; fix the variable and **rebuild** Pages.

---

## One-page summary

1. Deploy Django + Postgres + S3 → get `https://api.example.com`.  
2. Set GitHub **variable** `NEXT_PUBLIC_API_URL` → redeploy frontend.  
3. Point DNS at GitHub Pages; add domain to CORS.  

You keep **`docs/AWS_DEPLOY.md`** for the AWS-specific clicks; this file is the order of operations end-to-end.
