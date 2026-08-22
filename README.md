cat > README.md <<'EOF'
# First Look Studio

> Premium photography, cinematic storytelling, and creative studio experiences — built as a modern full-stack web platform.

<p align="center">
  <strong>First Look Studio</strong><br />
  A cinematic, responsive photography studio website powered by Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js, and Supabase.
</p>

---

## ✨ About

First Look Studio is a premium digital experience designed for a professional photography and creative studio.

The website combines a cinematic visual identity with a modern content-management system, interactive 3D elements, responsive layouts, and dynamic studio content.

The project is designed to feel polished across **desktop, tablet, and mobile** while keeping the experience fast, maintainable, and production-ready.

---

## 🚀 Highlights

### 🎬 Cinematic Experience

- Interactive Three.js 3D hero scene
- Floating camera and photography elements
- Dynamic camera parallax
- Smooth Framer Motion animations
- Cinematic lighting and depth effects
- Responsive 3D behavior for smaller screens
- Performance-aware WebGL rendering

### 📸 Photography Platform

- Featured gallery
- Dynamic portfolio
- Featured portfolio showcases
- Portfolio categories
- Image uploads
- Image previews
- Responsive gallery layouts
- Studio services presentation

### 🧩 Content Management

The website includes an admin CMS for managing production content without editing frontend components directly.

Supported content includes:

- Homepage hero content
- Homepage sections
- Gallery
- Portfolio
- Services
- Blog
- Testimonials
- Careers
- Contact content
- Navigation
- Site settings
- SEO settings
- Theme configuration
- Media

### 🔐 Admin System

The admin dashboard includes role-based access for:

- Admins
- Super admins
- Content management
- Gallery management
- Portfolio management
- Booking management
- Contact messages
- Newsletter management
- Careers management
- CMS configuration

---

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js | Full-stack React framework |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive UI styling |
| Framer Motion | UI animations |
| Three.js | Interactive 3D experience |
| React Three Fiber | React-based Three.js rendering |
| Drei | Three.js helpers and utilities |
| Supabase | Database, storage, and backend services |
| NextAuth | Authentication |
| Lucide React | Interface icons |

---

## 📁 Project Structure

```text
First-look-studio-12/
├── app/
│   ├── (public)/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── booking/
│   │   ├── career/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── gallery/
│   │   ├── portfolio/
│   │   ├── pricing/
│   │   ├── services/
│   │   ├── shop/
│   │   └── ...
│   │
│   ├── (admin)/
│   │   └── admin/
│   │
│   └── api/
│       ├── admin/
│       ├── auth/
│       ├── booking/
│       ├── career/
│       ├── contact/
│       ├── gallery/
│       ├── newsletter/
│       ├── portfolio/
│       └── ...
│
├── components/
│   ├── admin/
│   ├── sections/
│   ├── three/
│   └── ui/
│
├── lib/
│   ├── cms/
│   ├── data.ts
│   └── ...
│
├── public/
├── README.md
├── package.json
└── tsconfig.json
