import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Typography, Card, CardContent, Grid, TextField, Button, Alert, Avatar, Accordion, AccordionSummary, AccordionDetails, IconButton
} from "@mui/material";
import { ExpandMore, Person, CloudUpload } from "@mui/icons-material";

const HealthDetails = ({ user }) => {
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHealthInfo(res.data);
      } catch (error) {
        console.error("Error fetching health info:", error);
        setError("Failed to load health details.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchHealthInfo();
  }, [user, token]);

  const updateHealthInfo = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, healthInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Health details updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating health info:", error);
      setError("Failed to update health details.");
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
      {/* Header Section */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          🏥 Health Summary
        </Typography>
        <Avatar
          src={healthInfo.profilePicture || ""}
          sx={{
            width: 60,
            height: 60,
            backgroundColor: "#90CAF9",
          }}
        >
          {!healthInfo.profilePicture && <Person fontSize="large" />}
        </Avatar>
      </Grid>

      {/* Upload Picture Button */}
      <input type="file" accept="image/*" onChange={handlePictureUpload} style={{ display: "none" }} id="file-upload" />
      <label htmlFor="file-upload">
        <IconButton component="span" color="primary">
          <CloudUpload />
        </IconButton>
      </label>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {/* Basic Info Card */}
      <Card sx={{ marginTop: 2, borderRadius: "10px" }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Basic Info</Typography>
          <TextField
            fullWidth
            label="Name"
            value={healthInfo.name}
            onChange={(e) => setHealthInfo({ ...healthInfo, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Age"
            value={healthInfo.age}
            onChange={(e) => setHealthInfo({ ...healthInfo, age: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Height"
            value={healthInfo.height}
            onChange={(e) => setHealthInfo({ ...healthInfo, height: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Weight"
            value={healthInfo.weight}
            onChange={(e) => setHealthInfo({ ...healthInfo, weight: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Blood Type"
            value={healthInfo.bloodType}
            onChange={(e) => setHealthInfo({ ...healthInfo, bloodType: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
        </CardContent>
      </Card>

      {/* Vitals - Collapsible Section */}
      <Accordion sx={{ marginTop: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Vitals Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Heart Rate" value={healthInfo.vitals.heartRate} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, heartRate: e.target.value } })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Blood Pressure" value={healthInfo.vitals.bloodPressure} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, bloodPressure: e.target.value } })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Blood Sugar" value={healthInfo.vitals.bloodSugar} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, bloodSugar: e.target.value } })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Glucose Level" value={healthInfo.vitals.glucoseLevel} onChange={(e) => setHealthInfo({ ...healthInfo, vitals: { ...healthInfo.vitals, glucoseLevel: e.target.value } })} />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Medication Section */}
      <Accordion sx={{ marginTop: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Medication</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Medication schedule and prescriptions.</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Alerts Section */}
      <Accordion sx={{ marginTop: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Recent Alerts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Recent health alerts will appear here.</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Trends Section */}
      <Accordion sx={{ marginTop: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Trends</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Health trends based on previous records.</Typography>
        </AccordionDetails>
      </Accordion>

      {/* Update Button */}
      <Button fullWidth variant="contained" sx={{ marginTop: 3 }} onClick={updateHealthInfo}>
        Save Health Details
      </Button>
    </Container>
  );
};

export default HealthDetails;
