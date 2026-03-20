# 🌸 Fularani Foundation – Official Website

This repository contains the source code for **fularanifoundation.org**, the official website of **Fularani Foundation**.
The platform is a full-stack web application contained within a unified monorepo. It leverages **React + Vite** for the frontend and **Node.js + Express** for the backend, assuring fast performance, scalability, and seamless development.

---

## 📌 About Fularani Foundation

**Fularani Foundation** is a social initiative focused on community development, education, empowerment, and welfare programs.
This website serves as the digital presence of the foundation, providing information about its mission, initiatives, events, and impact.

🌐 Website: [https://fularanifoundation.org](https://fularanifoundation.org)

---

## 🚀 Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Tooling:** Concurrently (for running both servers simultaneously)
* **Deployment:** Vercel (Frontend via `vercel.json`) / Render (via `render.yaml`)

---

## 📂 Project Structure

```bash
Fularani-Foundation/
├── app/                  # Frontend Application (React + Vite)
│   ├── public/           # Static assets, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── assets/       # Images, icons, fonts
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main App component
│   ├── index.html        # Root HTML file
│   └── package.json      # Frontend dependencies
│
├── backend/              # Backend API Server (Node.js + Express)
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── db/           # Database configuration
│   │   ├── models/       # Mongoose data models
│   │   ├── routes/       # API routes
│   │   └── app.js        # Express app configuration
│   └── package.json      # Backend dependencies
│
├── package.json          # Root workspace configuration & scripts
├── dev.bat               # Windows batch script for starting the project
├── render.yaml           # Deployment configuration for Render
└── README.md             # Project documentation
```

---

## ✨ Key Features

* ⚡ **Fast & Modern UI:** Built with Vite and React for snappy, hot-reloadable development.
* 🤝 **Unified Full-Stack Workflow:** Start both frontend and backend together instantly using `npm run dev`.
* 🔐 **Authentication & Role-Based Access:** Secure login logic supporting Admin, Volunteer, and Donor roles.
* 💳 **Donation & Payment Gateway:** Live payment endpoints built to seamlessly capture donations and manage donor records.
* 🙋 **Volunteer Registration System:** Ready-to-use workflows for onboarding and managing new volunteers at scale.
* 📊 **Admin Dashboard:** Centralized control functionality to administrate content, galleries, and incoming contributions.
* 📸 **Gallery & Content Management:** Built-in upload and showcase capabilities extending beyond just blogs.
* 🔌 **Robust RESTful Backend:** Node.js/Express architecture handling complex data schemas and file storage seamlessly.
* 🌐 **Production Ready:** Pre-configured with Sitemap, Robots mapping, and deployment properties for Render and Vercel.

---

## 🧑‍💻 Getting Started

### Prerequisites

* **Node.js** v18 or higher
* **npm** or **yarn**
* **MongoDB** connection accessible locally or via Cloud

---

### Installation

Our root `package.json` includes custom scripts to make installation a breeze.

```bash
# Clone the repository
git clone https://github.com/DPEDITS/Fularani-Foundation.git

# Navigate into the project folder
cd Fularani-Foundation

# Install everything at once (Root + App + Backend)
npm run install-all
```

---

### Run Development Server

You don't need to open multiple terminals to develop. The root package uses `concurrently` to spin up both projects simultaneously!

```bash
# Start both Frontend and Backend concurrently
npm run dev
```

*(Windows users can also simply double-click `dev.bat` or run `.\dev.bat`)*

Open your browser at:
👉 **Frontend:** [http://localhost:5173](http://localhost:5173) 

---

## 🔐 Environment Variables

You need to establish separate environment configuration files for both the frontend and backend. 

**Frontend (`app/.env`)**
Create an `.env` file in the `app/` directory (use `app/.env.sample` as a reference):
```env
VITE_SITE_URL=https://fularanifoundation.org
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**Backend (`backend/.env`)**
Create an `.env` file in the `backend/` directory (use `backend/.env.sample` as a reference):
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
```

---

## 🏗️ Build for Production

To build the frontend for production manually:
```bash
cd app
npm run build
npm run preview
```

However, the architecture natively supports automated deployments platforms setting up the build directory via respective platform configurations (e.g. `render.yaml`).

---

## 🤝 Contribution Guidelines

Contributions are welcome ❤️

1. Fork the repository
2. Create a new branch (`feature/your-feature-name`)
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this project with proper attribution.

---

## 👨‍💻 Developed & Maintained By

**Fularani Foundation – Web Team**
Built with ❤️ using **React + Vite** & **Nodejs + Express**

---

## 👨‍💻 Developers

| Developer   | GitHub                                                       | Profile                                                 |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| Developer 1 | [@DPEDITS](https://github.com/DPEDITS)                       | ![](https://github.com/DPEDITS.png?size=100)            |
| Developer 2 | [@Abhijeet-Dashy](https://github.com/Abhijeet-Dashy)         | ![](https://github.com/Abhijeet-Dashy.png?size=100)     |
| Developer 3 | [@abhijeetdutta-1908](https://github.com/abhijeetdutta-1908) | ![](https://github.com/abhijeetdutta-1908.png?size=100) |
