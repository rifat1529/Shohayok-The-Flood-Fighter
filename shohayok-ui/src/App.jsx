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

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Need Help */}
        <Route path="/need-help" element={<NeedHelp />} />

        {/* 🔥 Chat Page (NEW) */}
        <Route path="/chat" element={<ChatPage />} />
        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Map View */}
        <Route path="/map" element={<MapView />} />
        {/* Submit Report */}
        <Route path="/submit-report" element={<SubmitReport />} />
        {/* Volunteer Head Dashboard */}
        <Route path="/volunteer-head-dashboard" element={<VolunteerHeadDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        

      </Routes>
    </Router>
  );
}

export default App;