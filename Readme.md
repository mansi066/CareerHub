# CareerHub 🚀

CareerHub is a modern **career discovery platform** built with **Next.js App Router** that helps users find **jobs, scholarships, and internships** through a clean, glassmorphic UI and scalable architecture.

---

## ✨ Key Features

* 🔍 **Jobs, Scholarships & Internships** in one place
* 📍 **Smart location-based filtering** (remote, on-site, relocation)
* 🎨 **Glassmorphic & responsive UI** with smooth animations
* ⚡ **Fast & scalable** using Next.js App Router
* 🌗 **Theme toggle** (light / dark mode)

---

## 🛠 Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **Icons:** lucide-react
* **Language:** TypeScript

---

## 📂 Folder Structure (Updated)

```
CAREERHUB/
├── app/
│   ├── dashboard/
│   │   ├── dashboard-content.tsx   # Dashboard UI logic
│   │   ├── loading.tsx             # Dashboard loading skeleton
│   │   └── page.tsx                # /dashboard route
│   │
│   ├── login/
│   │   └── page.tsx                # /login route
│   │
│   ├── signup/                     # /signup route
│   │   └── page.tsx
│   │
│   ├── globals.css                 # Global styles & Tailwind base
│   ├── layout.tsx                  # Root layout (Header, Footer, Theme)
│   └── page.tsx                    # Home page (/)
│
├── components/
│   ├── ui/                         # shadcn/ui reusable components
│   │   └── button.tsx
│   │
│   ├── cta.tsx                     # Call-to-action section
│   ├── features.tsx                # Features section
│   ├── footer.tsx                  # Site footer
│   ├── header.tsx                  # Navbar / Header
│   ├── hero.tsx                    # Hero section
│   ├── pricing.tsx                 # Pricing section
│   ├── testimonials.tsx            # Testimonials section
│   ├── theme-provider.tsx          # Theme context provider
│   └── theme-toggle.tsx            # Dark/Light toggle
│
├── hooks/                           # Custom React hooks
├── lib/                             # Utilities & helpers
├── public/                          # Static assets (images, icons)
├── styles/                          # Additional styles
│
├── .gitignore
├── components.json                 # shadcn/ui config
├── next.config.mjs                 # Next.js configuration
├── postcss.config.mjs              # PostCSS config
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript config
├── package.json
└── pnpm-lock.yaml
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/careerhub.git
cd careerhub
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧩 Core Pages & Components

### 🏠 Home Page (`/`)

* Hero section
* Features overview
* Testimonials
* CTA

### 🔐 Auth Pages

* `/login`
* `/signup`

### 📊 Dashboard (`/dashboard`)

* User-specific content
* Loading skeleton for better UX

---

## 📈 Future Enhancements

* 🤖 AI-based career recommendations
* 🔐 Authentication (NextAuth)
* 📊 Personalized dashboards
* 🔔 Notifications & alerts
* 🌍 Multi-language support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request
5. Read the contributor.md guidelines

---


## ⭐ Support the Career Hub

If you find Career Hub helpful and valuable, please consider starring this repository 🌟
Your support motivates us to keep improving the platform and adding more features for students and professionals.







## 📄 License

This project is licensed under the **MIT License**.

---


### 🌟 CareerHub — Find the right opportunity, faster.
