# 🎨 Img V2 Pro — Professional Web Image Converter

**Transform your images instantly** with our powerful, browser-based converter. Built with React + Vite for lightning-fast performance.

![Image Converter](https://via.placeholder.com/800x400/3b82f6/ffffff?text=🎨+Img+V2+Pro+Image+Converter)

## ✨ What You Get

- 🚀 **Lightning Fast** - Convert images instantly in your browser
- 🎯 **Multiple Formats** - JPG, PNG, WEBP, SVG, HEIC, PDF and more
- 📦 **Batch Processing** - Convert hundreds of images at once
- 🎨 **Image Editor** - Crop, resize, rotate, and enhance
- 📱 **Mobile Ready** - Works perfectly on all devices
- 🔒 **Privacy First** - Your images never leave your device (client-side processing)
- 💼 **Professional Grade** - Built with modern web technologies

## 🚀 Quick Start (30 seconds)

### Windows Users:
1. **Download** this project folder
2. **Double-click** `quick-setup.bat`
3. **Wait** for automatic setup
4. **Start converting!** 🎉

### Mac/Linux Users:
1. **Download** this project folder
2. **Open Terminal** in the folder
3. **Run** `./quick-setup.sh`
4. **Start converting!** 🎉

**That's it!** The app will open at `http://localhost:5173`

## 🎮 Try These Features

### Core Converter
- **Format Conversion**: JPG ↔ PNG ↔ WEBP ↔ SVG
- **Batch Processing**: Convert 10-500+ files at once
- **Drag & Drop**: Just drag images into the browser
- **Quality Control**: Adjust compression and quality settings

### Image Editor
- **Crop & Resize**: Perfect dimensions for any use case
- **Rotate & Flip**: Fix orientation issues instantly
- **Format Options**: Choose the best format for your needs

### PDF Tools
- **PDF to Image**: Extract pages as high-quality images
- **Images to PDF**: Combine multiple images into one PDF

### Advanced Features (with backend)
- **HEIC Conversion**: Convert iPhone photos to standard formats
- **Premium Formats**: TIFF, BMP, GIF, ICO support
- **User Accounts**: Save conversion history and preferencesWeb Image Converter (React + Vite)

Convert images between JPG, PNG, WEBP, SVG, and more — right in your browser. Batch processing, per-file options, progress display, and instant downloads. Optional backend enables HEIC/HEIF and some advanced targets.

This README gives a clear overview for users and developers: what it does, how it’s built, and how to run it locally on Windows.

## What you get

- Fast web app built with React 18 + Vite + TailwindCSS
- Drag & drop upload, paste, or file picker
- Client‑side conversion for JPG/PNG/WEBP, SVG vectorization on demand
- PDF utilities: render first page to image, export multiple images to one PDF
- Batch controls (format/quality), per‑file overrides, progress, and downloads
- HEIC/HEIF support via a lightweight FastAPI service (optional in dev/prod)
- Clean pages: Home (Conversion Hub), Image Editor, Pricing, About, Contact, Legal

## Tech stack

- Frontend: React 18, Vite 7, React Router v6, TailwindCSS
- Utilities: pdfjs-dist, jspdf, imagetracerjs (loaded only when needed)
- Backend (optional for HEIC & advanced formats): FastAPI + Pillow + pillow-heif

## Repository layout (important paths)

```
img/                         # Branding assets (logo/icon)
public/                      # Static assets (manifest, robots, favicon)
src/
	components/                # UI and app components (Header, Footer, etc.)
	context/PlanContext.jsx    # Simple plan & capability gating
	pages/
		image-conversion-hub/    # Main conversion UI/logic
		image-editor/            # Image editor page (basic)
		premium-features/        # Pricing & plans
		about, contact, legal/   # Content pages
	utils/api.js               # /api client for server conversions
	utils/pdf.js               # PDF render and images→PDF helpers
	App.jsx, Routes.jsx, index.jsx
vite.config.mjs              # Vite dev server & proxy config (port 5173)
tailwind.config.js           # Tailwind setup
heif-convert/api/main.py     # FastAPI service for HEIC/advanced formats
```

Note: The `libheif-1.20.2/` folder is included for reference and is not required to run the web app.

## Supported conversions

- Client-side (no server needed): JPG ⇄ PNG ⇄ WEBP, raster→SVG (via imagetracerjs), first‑page of PDF → image, images → single PDF.
- Server-assisted (when backend is running): HEIC/HEIF → JPG/PNG/WEBP; and some targets like TIFF/BMP/GIF/ICO.

The app automatically routes formats that need the server to the backend. Everything else stays in the browser for speed and privacy.

## Run the frontend (Windows)

Requirements:
- Node.js 18+
- PowerShell (commands below use PowerShell syntax)

Steps:
1) Install dependencies

```powershell
npm install
```

2) Start the dev server

```powershell
npm start
```

By default the app runs at http://localhost:5173 (see `vite.config.mjs`).

3) Build for production

```powershell
npm run build
```

4) Preview the production build

```powershell
npm run serve
```

Output is written to the `build/` folder.

## Enable HEIC and advanced formats (optional backend)

Some formats (HEIC/HEIF inputs and targets like TIFF/BMP/GIF/ICO) require a small backend. This repo includes a FastAPI service for local dev and deployment.

Backend location: `heif-convert/api/main.py`

Requirements:
- Python 3.10+ (3.11+ recommended)

Install and run (PowerShell):

```powershell
cd heif-convert
python -m venv .venv ; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 5001
```

While this server runs, the frontend will automatically proxy `/api/*` to `http://localhost:5001` (configured in `vite.config.mjs`).

Environment options:
- `MAX_UPLOAD_MB` (default 25) — maximum upload size allowed by the server.

Endpoints:
- `POST /convert` — form-data `file` with query params `format`, `quality`, `exif`, `name`.
- `GET /healthz` — basic health check.

Legacy note: `heic_backend.py` is an older Flask prototype with optional MongoDB logging. Prefer the FastAPI service above for development and production.

## How it works (high level)

- Uploads: drag & drop anywhere, paste from clipboard, or browse.
- Previews: generated client-side for most formats; HEIC gets a quick server preview.
- Conversion:
	- Browser: canvas encodes to JPG/PNG/WEBP; imagetracerjs vectorizes to SVG on demand.
	- Server: HEIC/HEIF and select targets are converted by Pillow + pillow‑heif.
- Batch: choose one output for all or set per-file; progress bar per item.
- Export: download individually or batch; combine images to PDF.

Behaviors & limits:
- WEBP export may fall back to JPEG on browsers that can’t encode WEBP.
- Very large images can hit browser memory limits; try smaller files if a tab crashes.
- Backend enforces an upload size cap (`MAX_UPLOAD_MB`). Increase if needed.

## Plans and capabilities (UI-only)

The app includes a lightweight plan system (`src/context/PlanContext.jsx`, `src/utils/planCapabilities.js`) that gates batch size, file size, and features. It’s local‑only for now (uses `localStorage`) and does not require any backend.

## Deploying

Frontend only (no HEIC needed):
- Run `npm run build` and deploy the static `build/` folder behind any static host (Netlify, Vercel, S3 + CloudFront, Nginx, etc.).

Frontend + Backend:
- Deploy the static site as above.
- Deploy the FastAPI service separately.
- Ensure the site can reach the backend at `/api/*` (recommended: reverse proxy from your web server so `/api` points to the FastAPI service). Alternatively, change `src/utils/api.js` to call your absolute API URL.

## Troubleshooting

- Dev server port: Vite uses 5173. If it’s busy, change `server.port` in `vite.config.mjs` or set `strictPort: false`.
- CORS: In development, FastAPI allows all origins. In production, restrict CORS or use a same‑origin reverse proxy.
- 413/large files on backend: increase `MAX_UPLOAD_MB` for FastAPI. Browser memory may still limit very large client‑side conversions.
- “HEIC support not available”: ensure `pillow-heif` is installed (see `heif-convert/requirements.txt`).

## Scripts

- `npm start` — Start Vite dev server (http://localhost:5173)
- `npm run build` — Build to `build/`
- `npm run serve` — Preview the production build

## License

This project is provided as-is by the repository owner. See licenses of bundled libraries for their terms.

