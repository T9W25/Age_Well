import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import DailyCheckIn from "./pages/DailyCheckIn";
import Dashboard from "./pages/Dashboard";
import MedicationView from "./pages/MedicationView";

function App() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      {user && <Sidebar handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/daily-checkin" element={user ? <DailyCheckIn /> : <Navigate to="/" />} />
        <Route path="/medications" element={user ? <MedicationView /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
