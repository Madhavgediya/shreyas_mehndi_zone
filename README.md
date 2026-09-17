# 🌿 Shreya's Mehndi Zone — Production-Ready MERN Stack Platform

> A luxury, dynamic, production-ready full-stack MERN website built for a professional Mehndi Artist / Mehndi Designer business (**Shreya's Mehndi Zone**). Features an earthy Indian aesthetic, dynamic MongoDB portfolio, real-time appointment booking, interactive **Virtual Mehndi Try-On** HTML5 canvas engine, and a complete secure **Admin Dashboard** with analytics.

---

## 🌟 Key Highlights & Features

### 1. Public Experience
- **Dynamic Hero & Brand Identity**: Custom Indian henna aesthetic, Playfair Display serif typography, warm henna earth palette (`#6B3E26`, `#FAF7F2`, `#D4A373`).
- **Mehndi Design Gallery**: Masonry grid layout, real-time search, difficulty filters, sort by popularity/price, category filters, quick view modals, and likes/favorites.
- **Design Detail Pages (`/designs/:slug`)**: High-res imagery, estimated application time, intricacy level, pricing, tags, WhatsApp inquiry button, native share sheet, and related category designs.
- **🎨 Virtual Mehndi Try-On Canvas Studio (`/try-on`)**:
  - Upload customer's hand or arm photo (or choose from built-in model hands).
  - Select transparent Mehndi overlay patterns (Mandala, Arabic, Bridal Cuffs, Finger Rings).
  - Responsive HTML5 Canvas: Drag to position, resize/scale, rotate angle, adjust stain density/opacity, flip horizontally, undo, redo, and reset.
  - Download high-resolution merged preview image.
  - "Book This Design" one-click action passing customized selections directly to booking.
- **Dynamic Appointment Booking (`/book`)**:
  - Validates dates (prevents past dates).
  - Preferred time slot selection, guest count, venue address, and custom portrait notes.
  - Generates unique formal booking ID: **`MH-2026-XXXXXX`**.
  - Immediate celebratory confetti confirmation and one-click WhatsApp confirmation link.
- **Services & Dynamic Pricing**: Tiered packages managed dynamically from MongoDB.
- **Testimonials**: Verified bride reviews and public review submission form.
- **Contact & Direct WhatsApp Integration**: Dynamic WhatsApp CTA widgets powered by admin settings.
- **User Accounts & Favorites**: Guest lookbook (persisted in localStorage) and registered customer accounts with personal booking history.

### 2. Admin Management Panel (`/admin/*`)
- **Dashboard & KPIs**: Recharts graphs (Bookings over time, popular designs, channel shares, total metrics).
- **Design Management**: Add, edit, delete, mark featured, publish/draft, upload images and transparent overlays.
- **Category Management**: Full CRUD for design genres with live design count aggregation.
- **Service & Pricing Package Builder**: Manage duration, features, discount badges, and active tiers.
- **Booking Management**: Filter by status (*Pending, Confirmed, Completed, Cancelled*), view booking details modal, one-click WhatsApp message to client, and status transitions.
- **Review Moderation**: Approve, reject, and feature customer testimonials.
- **Inquiry Desk**: Review client contact messages and mark as resolved.
- **Site Settings**: Customize business name, WhatsApp number, phone, email, studio address, hero text, and social links in real time.

---

## 🚀 Quick Start Guide

### Step 1: Clone or Open Workspace
Ensure you are in the project root:
```bash
cd "shreya's-mehndi-zone"
```

### Step 2: Configure Environment (`.env`)
Copy `.env.example` to `.env` (a ready-to-use `.env` is already provided in the root directory):

```env
# ===================================================
# SHREYA'S MEHNDI ZONE - LOCAL CONFIGURATION
# ===================================================

PORT=5000
NODE_ENV=development

# 👉 PASTE YOUR MONGODB CONNECTION STRING HERE:
# Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/shreyas_mehndi_zone

# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/shreyas_mehndi_zone?retryWrites=true&w=majority

JWT_SECRET=super_secret_mehndi_zone_jwt_token_key_2026_secure
JWT_EXPIRES_IN=7d

# CLOUDINARY (Optional - application automatically falls back to local /uploads storage if omitted)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# FRONTEND CLIENT
API_URL=http://localhost:5000/api
WHATSAPP_NUMBER=+919876543210
SITE_URL=http://localhost:5173
```

### Step 3: Seed Database with Realistic Mehndi Data
Once your MongoDB instance is running (or you've pasted your MongoDB Atlas URI into `.env`), run:
```bash
npm run seed
```
This populates:
- **20+ Realistic Mehndi Designs** with high-res photos, overlay paths, difficulty ratings, and prices
- **10+ Categories** (Bridal, Arabic, Indo-Arabic, Traditional, Mandala, Finger, etc.)
- **6+ Services & Tiered Packages**
- **Verified Testimonials & Sample Bookings**
- **Default Site Settings**
- **Default Admin Account**:
  - **Email:** `admin@shreyasmehndizone.com`
  - **Password:** `Admin@12345`

### Step 4: Run Development Server
To launch both the Node/Express backend and Vite React frontend concurrently:
```bash
npm run dev
```

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend API (Port 5000)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client
```

Open your browser:
- **Public Website:** `http://localhost:5173`
- **Virtual Try-On:** `http://localhost:5173/try-on`
- **Gallery:** `http://localhost:5173/gallery`
- **Book Appointment:** `http://localhost:5173/book`
- **Admin Portal:** `http://localhost:5173/admin/login`
  - Login with: `admin@shreyasmehndizone.com` / `Admin@12345`
- **Backend API Health:** `http://localhost:5000/api/health`

---

## 📁 Project Architecture

```
shreya's-mehndi-zone/
├── .env                       # Active environment configuration
├── .env.example               # Template environment configuration
├── README.md                  # Detailed documentation
├── package.json               # Root monorepo scripts (dev, build, server, client, seed)
├── server/
│   ├── server.js              # Server entry point & DB connection listener
│   ├── app.js                 # Express application, CORS, Helmet, rate limiting
│   ├── config/
│   │   ├── db.js              # Mongoose connection with diagnostic reporting
│   │   └── cloudinary.js      # Cloudinary upload handler with local static fallback
│   ├── models/                # User, Design, Category, Service, Pricing, Booking, etc.
│   ├── middleware/            # JWT auth, role validation, error handler, multer upload
│   ├── controllers/           # Auth, designs, bookings, categories, analytics, settings
│   ├── routes/                # REST endpoints under /api/*
│   ├── utils/                 # Booking ID generator (MH-2026-XXXXXX), slugifier
│   └── seed/
│       └── seedData.js        # Realistic seed data script
└── client/
    ├── vite.config.js         # Vite configuration with API proxying
    ├── tailwind.config.js     # Custom Mehndi earthy color tokens & typography
    ├── index.html             # Google fonts (Playfair Display, Plus Jakarta Sans)
    ├── public/
    │   ├── favicon.svg
    │   ├── robots.txt
    │   ├── sitemap.xml
    │   └── overlays/          # High-resolution transparent Mehndi SVGs for Try-On
    └── src/
        ├── api/               # Axios client with interceptors and organized endpoint modules
        ├── context/           # AuthContext, SettingsContext, FavoritesContext
        ├── components/
        │   ├── common/        # Navbar, Footer, Button, Card, Modal, SearchModal, ShareModal, WhatsAppFloating
        │   ├── designs/       # DesignCard, DesignGrid, DesignQuickViewModal
        │   ├── tryOn/         # TryOnCanvas, OverlayControls, DesignSelector, ImageUploader
        │   ├── booking/       # BookingForm, BookingSuccessModal
        │   └── admin/         # AdminLayout, AdminSidebar, StatCard, DataTable
        ├── pages/             # All public pages, user profile, and admin management screens
        ├── routes/            # AppRoutes with ProtectedRoute & AdminRoute guards
        └── styles/index.css   # Custom henna scrollbars and base styles
```

---

## 🌐 Production Deployment Guide

### Frontend (Vercel / Netlify)
1. Set the root directory of the client project to `client`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variable:
   - `API_URL`: Your deployed backend URL (e.g. `https://your-api.onrender.com/api`)

### Backend (Render / Railway / AWS)
1. Root Directory: `server`
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas cluster connection string
   - `JWT_SECRET`: A long random secret string
   - `PORT`: 5000 (or platform default)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (Optional)
"# shreyas_mehndi_zone" 
