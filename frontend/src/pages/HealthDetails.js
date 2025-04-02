import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from "@mui/material";
import { ExpandMore, Person, CloudUpload } from "@mui/icons-material";

const HealthDetails = () => {
  const [userId, setUserId] = useState(null);
  const [healthInfo, setHealthInfo] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    profilePicture: "",
    vitals: {
      heartRate: "",
      bloodPressure: "",
      bloodSugar: "",
      glucoseLevel: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [vitalsMessage, setVitalsMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const base64Payload = token.split('.')[1];
        const decoded = JSON.parse(atob(base64Payload));
        setUserId(decoded.id);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/health/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHealthInfo({
          ...res.data,
          vitals: res.data.vitals || {
            heartRate: "",
            bloodPressure: "",
            bloodSugar: "",
            glucoseLevel: "",
          }
        });
      } catch (error) {
        console.error("Error fetching health info:", error);
        setError("Failed to load health details.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchHealthInfo();
  }, [userId, token]);

  const updateHealthInfo = async () => {
    if (!userId) {
      setError("User information is missing.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/health/${userId}`,
        {
          age: healthInfo.age,
          height: healthInfo.height,
          weight: healthInfo.weight,
          bloodType: healthInfo.bloodType,
          allergies: healthInfo.allergies,
          medicalConditions: healthInfo.medicalConditions,
          profilePicture: healthInfo.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Health details updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating health info:", error);
      setError("Failed to update health details.");
    }
  };

  const updateVitals = async () => {
    try {
      await axios.put(`http://localhost:5000/api/vitals/${userId}`, { vitals: healthInfo.vitals }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVitalsMessage("Vitals updated successfully!");
      setTimeout(() => setVitalsMessage(""), 3000);
    } catch (error) {
      console.error("Error updating vitals:", error);
      setVitalsMessage("Failed to update vitals.");
    }
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setHealthInfo({ ...healthInfo, profilePicture: imageUrl });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", padding: "20px", backgroundColor: "#E3F2FD", borderRadius: "10px" }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>🏥 Health Summary</Typography>
        <Avatar src={healthInfo.profilePicture || ""} sx={{ width: 60, height: 60, backgroundColor: "#90CAF9" }}>
          {!healthInfo.profilePicture && <Person fontSize="large" />}
        </Avatar>
      </Grid>

      <input type="file" accept="image/*" onChange={handlePictureUpload} style={{ display: "none" }} id="file-upload" />
      <label htmlFor="file-upload">
        <IconButton component="span" color="primary"><CloudUpload /></IconButton>
      </label>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Card sx={{ mt: 2, borderRadius: "10px" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>Basic Info</Typography>
          <TextField fullWidth label="Full Name" value={healthInfo.name} onChange={(e) => setHealthInfo({ ...healthInfo, name: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Age (years)" value={healthInfo.age} onChange={(e) => setHealthInfo({ ...healthInfo, age: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Height (cm)" value={healthInfo.height} onChange={(e) => setHealthInfo({ ...healthInfo, height: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Weight (kg)" value={healthInfo.weight} onChange={(e) => setHealthInfo({ ...healthInfo, weight: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Blood Type (e.g. A+, B-, O+)" value={healthInfo.bloodType} onChange={(e) => setHealthInfo({ ...healthInfo, bloodType: e.target.value })} sx={{ mb: 2 }} />
        </CardContent>
      </Card>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}><Typography variant="h6">Vitals Overview</Typography></AccordionSummary>
        <AccordionDetails>
          {vitalsMessage && <Alert severity="info" sx={{ mb: 2 }}>{vitalsMessage}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Heart Rate (bpm)" value={healthInfo.vitals.heartRate} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, heartRate: e.target.value } })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Blood Pressure (mmHg)" value={healthInfo.vitals.bloodPressure} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, bloodPressure: e.target.value } })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Blood Sugar (mg/dL)" value={healthInfo.vitals.bloodSugar} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, bloodSugar: e.target.value } })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Glucose Level (mg/dL)" value={healthInfo.vitals.glucoseLevel} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, glucoseLevel: e.target.value } })} />
            </Grid>
          </Grid>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={updateVitals}>Save Vitals</Button>
        </AccordionDetails>
      </Accordion>

      <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={updateHealthInfo}>
        Save Health Details
      </Button>
    </Container>
  );
};

export default HealthDetails;
