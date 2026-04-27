# 🌊 Shohayok: The Flood Fighter

**Shohayok** is a comprehensive platform designed to streamline flood relief efforts by connecting victims, volunteers, and admins in real-time. This project focuses on efficient resource management, real-time communication, and data-driven decision-making during flood disasters.

---

## 🚀 Features

* **Real-time Chat System:** Seamless communication between Users (Victims), Volunteers, and Admins using **Socket.io**.
* **Role-based Access Control:** Distinct dashboards and permissions for Admins, Volunteers, and General Users.
* **Volunteer Management:** Dedicated sections for managing volunteer activities and deployments.
* **Responsive UI:** A modern, user-friendly interface built with **React.js**.
* **Secure Backend:** Robust API built with **Node.js** and **Express.js**, with JWT-based authentication.
* **Database Management:** Organized data handling using **Sequelize ORM** (MySQL).

---

## 🛠️ Tech Stack

### **Frontend**
* **React.js** (Functional Components, Hooks)
* **Socket.io-client** (Real-time updates)
* **Axios** (API Requests)
* **CSS3** (Custom Modern UI)

### **Backend**
* **Node.js & Express.js**
* **Socket.io** (WebSockets)
* **Sequelize ORM** (Database Management)
* **MySQL** (Database)
* **JWT** (Security & Authentication)

---

## 📂 Project Structure

```text
Shohayok-The-Flood-Fighter/
├── shohayok_backend/       # Node.js Server & APIs
│   ├── controllers/        # Logical Handlers
│   ├── models/             # Database Schemas
│   ├── routes/             # API Endpoints
│   └── app.js              # Entry Point
├── shohayok_frontend/      # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Chat, Dashboard, Login, etc.
│   │   └── App.js          # Routing & Main Logic
└── README.md
⚙️ Installation & Setup
1. Clone the repository
Bash
git clone [https://github.com/rifat1529/Shohayok-The-Flood-Fighter.git](https://github.com/rifat1529/Shohayok-The-Flood-Fighter.git)
cd Shohayok-The-Flood-Fighter
2. Backend Setup
Bash
cd shohayok_backend
npm install
Create a .env file and add your credentials:

Code snippet
PORT=5000
DB_NAME=shohayok_db
DB_USER=root
DB_PASS=password
JWT_SECRET=your_secret_key
Start the server:

Bash
npm start

### 3. Frontend Setup
```bash
cd ../shohayok_frontend
npm install
npm start
💬 Real-time Chat Logic
The platform implements a restricted communication flow:

Admins can communicate with Volunteers.

Users can reach out to Volunteers for help.

Volunteers act as the bridge between victims and authority.

🤝 Contributing
Contributions are welcome! If you have any ideas to improve the relief process, feel free to:

Fork the Project.

Create your Feature Branch.

Commit your Changes.

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information.
