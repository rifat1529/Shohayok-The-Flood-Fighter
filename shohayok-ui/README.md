# 🖥️ Shohayok-UI (Frontend)

This is the official frontend repository for the **Shohayok: The Flood Fighter** project. It is a React-based web application built to provide a real-time, responsive, and user-friendly interface for flood victims, volunteers, and admins.

---

## ✨ UI Features

* **Role-Based Dashboards:** Separate views for Admins, Volunteers, and General Users.
* **Real-time Chat Interface:** A modern, bubble-style chat UI powered by **Socket.io** for seamless communication.
* **Volunteer Selection:** Users and Admins can browse and start conversations with available volunteers.
* **Dynamic Relief Tracking:** Interactive components to view and manage flood relief data.
* **Auth Integration:** Secure login and registration flows with persistent session management using JWT.

---

## 🛠️ Technology Stack

* **Core Library:** React.js
* **State Management:** React Hooks (`useState`, `useEffect`, `useContext`, `useRef`)
* **Routing:** React Router DOM
* **Real-time Communication:** Socket.io-client
* **API Client:** Axios
* **Styling:** CSS3 (Custom Modules) & Responsive Design

---

## 📂 Folder Structure

```text
shohayok-ui/
├── public/              # Static assets (icons, images)
├── src/
│   ├── components/      # Reusable UI components (Buttons, Inputs, etc.)
│   ├── pages/           # Main page views (Home, Login, Chat, Dashboard)
│   ├── styles/          # CSS files for custom styling
│   ├── utils/           # Helper functions and API configurations
│   ├── App.js           # Main application logic & Routing
│   └── main.jsx         # Entry point
├── package.json         # Project dependencies and scripts
└── README.md
🚀 Getting Started
To get the UI running on your local machine, follow these steps:

1. Prerequisites
Ensure you have Node.js and npm installed.

2. Installation
Navigate to the shohayok-ui directory and install dependencies:

Bash
npm install
3. Environment Configuration
Create a .env file in the root of the shohayok-ui folder and add your backend URL:

Code snippet
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
4. Running the App
Start the development server:

Bash
npm run dev
The app will typically be available at http://localhost:5173.
