# httpsDXF — personal site

Next.js (App Router) + Tailwind frontend, Django API backend. Primary domain: [httpsdxf.me](https://httpsdxf.me).

## Structure

- **`frontend/`** — Next.js app (`app/`, `public/`, static export → `out/` for GitHub Pages)
- **`backend/`** — Django project (`httpsdxf/`) and `api` app for HTTP APIs

## Frontend

```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm install
npm run dev
npm run build   # static export → frontend/out/ (GitHub Pages)
```

- **Experiments** — `/experiments` lists cards; `/experiments/view` is the Three.js viewer (glTF/GLB, STL, OBJ, exploded view for multi-part glTF).
- **Blog** — `/blog` and `/blog/[slug]` load published posts from the API when `NEXT_PUBLIC_API_URL` is set.
- **Dashboard** — `/dashboard` (JWT login) for staff: create blog posts and upload experiment models.

**GitHub Pages:** the deploy workflow reads **`NEXT_PUBLIC_API_URL`** from the repository **Actions variables** (Settings → Secrets and variables → Actions → Variables). Set it to your public API base URL with no trailing slash (for example `https://your-api.example.com`). Local dev still uses `frontend/.env.local`.

## Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # staff user for dashboard / JWT
python manage.py runserver
```

API routes:

- `GET /api/health/`
- `POST /api/token/` — JWT (username/password)
- `GET|POST /api/blog/posts/` — list/create (create: staff only)
- `GET|POST /api/experiments/` — list/create (create: staff; multipart upload)

Media (uploaded models) are served at `/media/` when `DEBUG=True`. Set `DJANGO_SECRET_KEY` in production; optional: `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CORS_ORIGINS` (comma-separated, e.g. `http://localhost:3000`).

## CAD files (SolidWorks / Blender)

Browsers cannot reliably load native **`.SLDPRT`** or **`.blend`** in WebGL. Export **STL** or **glTF/GLB** from SolidWorks or Blender, then upload that file in the dashboard or open it in **Experiments → 3D viewer**.

## Testing locally

1. Terminal A: `cd backend && python manage.py runserver`
2. Terminal B: `cd frontend && npm run dev`
3. Open `http://localhost:3000/experiments/view` and drag an exported `.glb` / `.stl` / `.obj`.
4. Open `http://localhost:3000/dashboard/login` and sign in with a **staff** Django user; create a post or upload an experiment.
