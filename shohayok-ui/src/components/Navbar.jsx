import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Shohayok</h1>

        <div
          className="text-2xl cursor-pointer"
          onClick={() => setOpen(true)}
        >
          ☰
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-700 text-white z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* HEADER */}
        <div className="p-5 border-b border-blue-500 flex justify-between items-center">
          <h2 className="text-lg font-bold">Menu</h2>
          <span
            className="cursor-pointer text-xl"
            onClick={() => setOpen(false)}
          >
            ✕
          </span>
        </div>

        {/* LINKS */}
        <div className="flex flex-col p-5 space-y-4">

          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/map" onClick={() => setOpen(false)}>Map</Link>
          <Link to="/chat" onClick={() => setOpen(false)}>Chat</Link>

          {user?.role === "user" && (
            <Link to="/need-help" onClick={() => setOpen(false)}>
              Need Help
            </Link>
          )}

          {user?.role === "volunteer_head" && (
            <Link to="/volunteer-head-dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          )}

          {user?.role === "volunteer" && (
            <Link to="/volunteer-dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)}>
              Admin Panel
            </Link>
          )}

          {!user ? (
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>
    </>
  );
}