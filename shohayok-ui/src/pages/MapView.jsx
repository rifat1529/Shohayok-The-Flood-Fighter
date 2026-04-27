import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import mapboxgl from "mapbox-gl";
import socket from "../socket/socket";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/map.css";
 
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
 
const MAX_LOADS = 50;
 
// ─── Haversine distance (km) ───────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}
 
// ─── Marker config by role ─────────────────────────────────────────────────
const ROLE_CONFIG = {
  volunteer: { color: "#3b82f6", label: "Volunteer 🚑" },
  user:      { color: "#ef4444", label: "User 🆘" },
  volunteer_head: { color: "#22c55e", label: "Team Lead 🧭" },
};
 
function getRoleConfig(role) {
  return ROLE_CONFIG[role] || { color: "#94a3b8", label: "Unknown" };
}
 
// ─── Create DOM element for marker ────────────────────────────────────────
function createMarkerEl(color) {
  const el = document.createElement("div");
  el.style.cssText = `
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${color};
    border: 2px solid white;
    box-shadow: 0 0 6px ${color}88;
    cursor: pointer;
  `;
  return el;
}
 
export default function MapView() {
  const mapRef        = useRef(null);
  const containerRef  = useRef(null);
  const markersRef    = useRef({});   // { userId: { marker, role, lat, lng } }
  const watchIdRef    = useRef(null);
  const headLocRef    = useRef(null); // latest volunteer_head location
 
  const [blocked, setBlocked]   = useState(false);
  const [loads, setLoads]       = useState(0);
  const [tracking, setTracking] = useState(false);
 
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("🧠 CURRENT USER:", user);
  const missionId = JSON.parse(localStorage.getItem("mission") || "{}").id || null;
 
  // ── Guard: load counter ────────────────────────────────────────────────
  useEffect(() => {
    let count = Number(localStorage.getItem("map_loads") || 0);
    if (count >= MAX_LOADS) { setBlocked(true); return; }
    count++;
    localStorage.setItem("map_loads", count);
    setLoads(count);
  }, []);
 
  // ── Init map ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (blocked || mapRef.current) return;
 
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [90.4125, 23.8103],
      zoom: 8,
    });
 
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
 
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [blocked]);
 
  // ── Socket: receive-location ───────────────────────────────────────────
 useEffect(() => {
  if (blocked) return;

  // =========================
  // 📍 RECEIVE LOCATION
  // =========================
 const handleLocation = async ({ userId, lat, lng, role }) => {
  
  console.log("📡 SOCKET DATA:", { userId, role });
  if (!mapRef.current) return; // 🔥 safety

  const key = `${userId}-${role}`;

  // ✅ USE ROLE CONFIG (FIX)
  const { color, label } = getRoleConfig(role);

  // 🔁 update / create marker
  if (markersRef.current[key]) {
    markersRef.current[key].marker.setLngLat([lng, lat]);
    markersRef.current[key].lat = lat;
    markersRef.current[key].lng = lng;
  } else {
    const el = createMarkerEl(color);

    const marker = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<b>${label}</b><br/>ID: ${userId.slice(0, 6)}`
        )
      )
      .addTo(mapRef.current);

    markersRef.current[key] = { marker, role, lat, lng };
  }

  // =========================
  // 📏 DISTANCE + ROUTE
  // =========================
  const allMarkers = Object.values(markersRef.current);
  const userLoc = allMarkers.find((m) => m.role === "user");

  const volunteerOrHead = allMarkers.find(
    (m) => m.role === "volunteer" || m.role === "volunteer_head" && m !== userLoc
  );

  if (userLoc && volunteerOrHead) {
    const km = haversine(
      volunteerOrHead.lat,
      volunteerOrHead.lng,
      userLoc.lat,
      userLoc.lng
    );

    console.log("🧭 Distance:", km, "km");

    // 🔥 skip route if same location
    if (km < 0.01) return;

    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${volunteerOrHead.lng},${volunteerOrHead.lat};${userLoc.lng},${userLoc.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes?.length) return;

      const route = data.routes[0].geometry;

      if (mapRef.current.getSource("route")) {
        mapRef.current.getSource("route").setData({
          type: "Feature",
          geometry: route,
        });
      } else {
        mapRef.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route,
          },
        });

        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#00f0ff",
            "line-width": 4,
          },
        });
      }
    } catch (err) {
      console.error("❌ Route error:", err);
    }
  }

  // =========================
  // 🔍 AUTO ZOOM
  // =========================
  const bounds = new mapboxgl.LngLatBounds();

  allMarkers.forEach((m) => {
    bounds.extend([m.lng, m.lat]);
  });

  if (!bounds.isEmpty()) {
    mapRef.current.fitBounds(bounds, {
      padding: 80,
      maxZoom: 14,
      duration: 800,
    });
  }
};

  // =========================
  // 🛑 STOP TRACKING
  // =========================
  const handleStopTracking = () => {
    Object.values(markersRef.current).forEach(({ marker }) =>
      marker.remove()
    );

    markersRef.current = {};

    if (mapRef.current.getLayer("route")) {
      mapRef.current.removeLayer("route");
      mapRef.current.removeSource("route");
    }
  };

  socket.on("receive-location", handleLocation);
  socket.on("stop-tracking", handleStopTracking);

  return () => {
    socket.off("receive-location", handleLocation);
    socket.off("stop-tracking", handleStopTracking);
  };
}, [blocked]);
 
  // ── Location sender ────────────────────────────────────────────────────
const startTracking = () => {
  if (!navigator.geolocation) return;

  if (!user?.id || !user?.role) {
    console.error("No user");
    return;
  }

  setTracking(true);

  watchIdRef.current = navigator.geolocation.watchPosition(
    ({ coords }) => {
      socket.emit("send-location", {
        userId: user.id,
        lat: coords.latitude,
        lng: coords.longitude,
        role: user.role,
        missionId,
      });
    },
    (err) => console.error(err),
    { enableHighAccuracy: true }
  );
};

const stopTracking = () => {
  if (watchIdRef.current !== null) {
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }

  setTracking(false);

  socket.emit("stop-sharing-location", {
    userId: user.id,
    missionId,
  });
};
  
  // Cleanup watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);
 
  // ── Blocked UI ─────────────────────────────────────────────────────────
  if (loads >= MAX_LOADS) {
    return (
      <div className="map-page-root">
        <Navbar />
        <div className="map-disabled-wrap">
          <div className="map-disabled-card">
            <div className="map-disabled-icon">🚫</div>
            <h2>Map Disabled</h2>
            <p>Usage limit reached ({MAX_LOADS} loads).</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────
  return (
    <div className="map-page-root">
      <Navbar />
      
      <div className="map-wrapper">
        {/* Tracking toggle button */}
        <button
          onClick={tracking ? stopTracking : startTracking}
          className={`map-action-btn ${tracking ? "btn-stop" : "btn-start"}`}
        >
          {tracking ? "⏹ Stop Sharing" : "📡 Share Location"}
        </button>

        {/* Load counter */}
        <div className="map-load-counter">
          🧭 {loads}/{MAX_LOADS} loads
        </div>

        {/* Map container */}
        <div className="map-container" ref={containerRef} />
      </div>
    </div>
  );
}
