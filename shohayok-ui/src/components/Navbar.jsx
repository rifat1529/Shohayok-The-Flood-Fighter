import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">Shohayok</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/map">Map</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/login">Login</Link>
        <Link to="/volunteer-head">VolunteerHead</Link>
        <Link to="/admin">Admin</Link>


      </div>
    </div>
  );
}
