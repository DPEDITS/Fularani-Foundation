# 🌸 Fularani Foundation – Official Website

This repository contains the source code for **fularanifoundation.org**, the official website of **Fularani Foundation**.
The platform is built as a full-stack web application using **React + Vite** for the frontend and **Node.js + Express** for the backend, ensuring fast performance, scalability, and a robust API-driven architecture.

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
* **State Management:** React Hooks / Context API
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```bash
Fularani-Foundation/
├── app/                  # Frontend Application (React + Vite)
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── assets/       # Images, icons, fonts
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Context providers
│   │   ├── data/         # Static or mock data
│   │   ├── lib/          # Libraries and utility wrappers
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API services
│   │   ├── utils/        # Helper functions
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # Application entry point
│   ├── .env.sample       # Frontend environment variables template
│   ├── index.html        # Root HTML file
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Frontend dependencies & scripts
│
├── backend/              # Backend API Server (Node.js + Express)
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── db/           # Database configuration
│   │   ├── middlewares/  # Express middlewares
│   │   ├── models/       # Mongoose data models
│   │   ├── routes/       # API routes
│   │   ├── scripts/      # Standalone scripts & database utilities
│   │   ├── utils/        # Backend helper functions
│   │   ├── app.js        # Express app configuration
│   │   └── index.js      # Server entry point
│   ├── .env.sample       # Backend environment variables template
│   └── package.json      # Backend dependencies & scripts
│
├── .gitignore            # Git ignore rules
├── package.json          # Root workspace configuration
└── README.md             # Project documentation
```

---

## ✨ Features

* ⚡ Fast build & hot reload with Vite
* 📱 Fully responsive design
* 🧩 Modular and reusable frontend components
* 🧭 Client-side routing with React Router
* 🔌 RESTful API backend handling data, files, and users
* 🚀 Scalable architecture
* 🌐 Deployment-ready for full-stack environments

---

## 🧑‍💻 Getting Started

### Prerequisites

* **Node.js** v18 or higher
* **npm** or **yarn**
* **MongoDB** locally installed or an Atlas Sandbox URI

---

### Installation

```bash
# Clone the repository
git clone https://github.com/DPEDITS/Fularani-Foundation.git

# Navigate into the project folder
cd Fularani-Foundation

# Install frontend dependencies
cd app
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

### Run Development Server

You will need to run both the frontend and backend servers to develop locally.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd app
npm run dev
```

Open your frontend dashboard at:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build for Production

To build the frontend for production, navigate to the `app` directory:
```bash
cd app
npm run build
npm run preview
```

The backend code inherently supports production environments by setting the `NODE_ENV=production` environment variable.

---

## 🔐 Environment Variables

You need to establish separate environment configuration files for both the frontend and backend environments. 

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

*(Refer to `.env.sample` in the respective folders to see all required API keys, secure tokens, and Cloudinary keys.)*

---

## 🔮 Future Enhancements

* Admin dashboard
* Donation & payment gateway
* Volunteer registration system
* Blog & news management
* Backend API integration
* Authentication & role-based access
* Analytics & performance tracking

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
