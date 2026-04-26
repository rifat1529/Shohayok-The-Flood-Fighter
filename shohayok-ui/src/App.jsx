import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NeedHelp from "./pages/NeedHelp";
import ChatPage from "./pages/ChatPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MapView from "./pages/MapView";
import SubmitReport from "./pages/SubmitReport";
import VolunteerHeadDashboard from "./pages/VolunteerHeadDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddInstruction from "./pages/AddInstruction";
import VolunteerDashboard from "./pages/VolunteerDashboard";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* 🔐 Need Help */}
        <Route
          path="/need-help"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <NeedHelp />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Chat */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "volunteer", "volunteer_head"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Map */}
        <Route
          path="/map"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "volunteer", "volunteer_head"]}>
              <MapView />
            </ProtectedRoute>
          }
        />

        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/submit-report" element={<SubmitReport />} />
        <Route path="/admin/instruction" element={<AddInstruction />} />
  

        {/* 🔐 Volunteer Head Dashboard */}
        <Route
          path="/volunteer-head-dashboard"
          element={
            <ProtectedRoute allowedRoles={["volunteer_head"]}>
              <VolunteerHeadDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Volunteer Dashboard (NEW) */}
        <Route
          path="/volunteer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;