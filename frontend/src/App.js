import React, { useContext } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import ElderlySearch from "./pages/ElderlySearch"; 
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MedicationView from "./pages/MedicationView";
import HealthDetails from "./pages/HealthDetails";
import DailyCheckIn from "./pages/DailyCheckIn";
import EmergencyContacts from "./pages/EmergencyContacts";
import AdminDashboard from "./pages/AdminDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import DietPlan from "./pages/DietPlan";
import Schedule from "./pages/Schedule";
import FamilyDashboard from "./pages/FamilyDashboard";
import HealthcareDashboard from "./pages/HealthcareDashboard";
import ScheduleView from "./pages/ScheduleView";
import PrivateRoute from "./components/PrivateRoute";

// ✅ Wrappers to pass params into components expecting elderlyId
const DietPlanWrapper = () => {
  const { elderlyId } = useParams();
  return <DietPlan elderlyId={elderlyId} />;
};

const ScheduleWrapper = () => {
  const { elderlyId } = useParams();
  return <Schedule elderlyId={elderlyId} />;
};

function App() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ Role-based redirection after login
  const redirectByRole = () => {
    switch (user?.role) {
      case "elderly":
        return "/dashboard";
      case "caregiver":
        return "/caregiver-dashboard";
      case "family":
        return "/family-dashboard";
      case "healthcare":
        return "/healthcare-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  return (
    <>
      {user && <Sidebar handleLogout={handleLogout} user={user} />}

      <Routes>
        {/* Public Route */}
        <Route path="/" element={user ? <Navigate to={redirectByRole()} /> : <LoginPage setUser={setUser} />} />
        <Route path="/view-schedule" element={user ? <ScheduleView user={user} /> : <Navigate to="/" />} />

        {/* Elderly */}
        <Route path="/dashboard" element={<PrivateRoute user={user} roles={["elderly"]}><Dashboard /></PrivateRoute>} />
        <Route path="/medications" element={<PrivateRoute user={user} roles={["elderly"]}><MedicationView /></PrivateRoute>} />
        <Route path="/health-details" element={<PrivateRoute user={user} roles={["elderly"]}><HealthDetails /></PrivateRoute>} />
        <Route path="/daily-checkin" element={<PrivateRoute user={user} roles={["elderly"]}><DailyCheckIn /></PrivateRoute>} />
        <Route path="/emergency" element={<PrivateRoute user={user} roles={["elderly"]}><EmergencyContacts user={user} /></PrivateRoute>} />

        {/* Caregiver */}
        <Route path="/caregiver-dashboard" element={<PrivateRoute user={user} roles={["caregiver"]}><CaregiverDashboard user={user} /></PrivateRoute>} />
        <Route path="/caregiver/:elderlyId/diet" element={<PrivateRoute user={user} roles={["caregiver"]}><DietPlanWrapper /></PrivateRoute>} />
        <Route path="/caregiver/:elderlyId/schedule" element={<PrivateRoute user={user} roles={["caregiver"]}><ScheduleWrapper /></PrivateRoute>} />
        <Route path="/search-elderly" element={
  <PrivateRoute user={user} roles={["caregiver"]}>
    <ElderlySearch user={user} />
  </PrivateRoute>
} />

        {/* Family */}
        <Route path="/family-dashboard" element={<PrivateRoute user={user} roles={["family"]}><FamilyDashboard /></PrivateRoute>} />

        {/* Healthcare */}
        <Route path="/healthcare-dashboard" element={<PrivateRoute user={user} roles={["healthcare"]}><HealthcareDashboard /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<PrivateRoute user={user} roles={["admin"]}><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
