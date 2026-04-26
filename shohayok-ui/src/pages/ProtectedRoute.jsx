import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔒 not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔒 role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // ✅ access granted
  return children;
}