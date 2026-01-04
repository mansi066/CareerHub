# CareerHub 🚀

[![ECWOC 2026](https://img.shields.io/badge/ECWOC-2026-blueviolet?style=for-the-badge&logo=opensourceinitiative)](https://ecwoc.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CareerHub is a modern **career discovery platform** built with **Next.js App Router**. We help students and professionals find **jobs, scholarships, and internships** through a clean, glassmorphic UI and a scalable architecture.

---

## 🚀 Quick Overview (TL;DR)
CareerHub is designed for fast opportunity discovery:
* **Unified Search:** Jobs, Scholarships, and Internships in one place.
* **Smart Filtering:** Filter by location (remote, on-site, or relocation).
* **Modern UI:** Glassmorphic design with a built-in Dark/Light theme toggle.
* **Performance:** Powered by Next.js for speed and scalability.

---

## 🛠 Tech Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **Icons:** lucide-react
* **Language:** TypeScript

---

## 📂 Folder Structure (Beginner's Guide)

Understanding where things live in the project:

```text
CAREERHUB/
├── app/                  # Routing & Pages
│   ├── dashboard/        # /dashboard - User dashboard & logic
│   ├── login/ /signup/   # Authentication routes
│   ├── layout.tsx        # Global Layout (Navbar, Footer, Theme)
│   └── page.tsx          # Landing/Home Page (/)
├── components/           # Reusable UI elements
│   ├── ui/               # Base shadcn/ui components (Buttons, Inputs)
│   └── ...               # Sections like Hero, Features, Header, Footer
├── hooks/                # Custom React logic
├── lib/                  # Helper functions & Utilities
├── public/               # Static assets (Images, Icons)
└── tailwind.config.ts    # Design system configuration
```

---

## 🏗 Getting Started

* **1. Installation**

```
git clone [https://github.com/mansi066/careerhub.git](https://github.com/mansi066/careerhub.git)
cd careerhub
npm install
```
* **2. Development**

```
npm run dev
Open http://localhost:3000 to see the site live in your browser.
```

---

## 🤝 Contributing

We are proud participants in **ECWOC**! We welcome and encourage first-time contributors, students, and open-source enthusiasts to help grow CareerHub.

### 🚀 Quick Start for Contributors:
1. **Fork** the repository and clone it locally.
2. **Branch:** Create a new branch for your feature: `git checkout -b feature/your-name`.
3. **Commit:** Use descriptive messages (e.g., `feat: added AI search filter`).
4. **Submit:** Open a Pull Request and mention **"Part of ECWOC"** in your description.

> [!TIP]
> **Detailed Guidelines:** For a full walkthrough on setting up your environment, our coding standards (TypeScript & Tailwind), and the PR process, please refer to our dedicated **[CONTRIBUTING.md](./CONTRIBUTING.md)** file.

---

## ✨ Coding Standards (Brief)
To keep our codebase clean and scalable, please ensure:
* **Strict Typing:** No use of `any` in TypeScript.
* **Component Pattern:** Follow **shadcn/ui** structures in `components/ui/`.
* **Utility First:** Use **Tailwind CSS** only; no raw CSS files or inline styles.

---

## 📈 Future Enhancements (Contribute Here!)
Want to add a new feature? We are looking for help with:

* **AI Recommendations:** Suggest jobs based on user profiles.
* **NextAuth Integration:** Secure user authentication.
* **Personalized Dashboards:** Advanced metrics for applicants.
* **Multi-language:** Support for international users.

---

## ⭐ Support
If you find CareerHub helpful, please consider starring this repository 🌟 It motivates us to keep building and improving!

---

## 📄 License
This project is licensed under the **MIT License**. For more details, please see the **[LICENSE](./LICENSE)** file included in this repository.

---

## *CareerHub — Find the right opportunity, faster.*

