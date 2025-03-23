import React, { useState, useEffect } from "react";
import { getPrescriptions } from "../api/prescription";
import { 
  Container, Card, CardContent, Typography, List, ListItem, CircularProgress 
} from "@mui/material";

const MedicationView = ({ user }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user || !user._id) {
        console.error("❌ User is not defined, skipping prescription fetch.");
        setLoading(false); // Stop loading if user is not available
        return;
      }

      try {
        const data = await getPrescriptions(user._id);
        setPrescriptions(data);
      } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
      } finally {
        setLoading(false); // Stop loading after fetching data
      }
    };

    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  // ✅ Prevent crash: Show loading until user is ready
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 5 }}>
        <CircularProgress /> 
        <Typography variant="body1">Loading user data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Medication Schedule
      </Typography>

      {/* ✅ Show loading indicator while fetching prescriptions */}
      {loading ? (
        <Container sx={{ textAlign: "center", marginTop: 3 }}>
          <CircularProgress />
          <Typography variant="body1">Loading prescriptions...</Typography>
        </Container>
      ) : prescriptions.length === 0 ? (
        <Typography variant="body1" align="center">No prescriptions available.</Typography>
      ) : (
        <List>
          {prescriptions.map((prescription, index) => (
            <ListItem key={index}>
              <Card sx={{ width: "100%", padding: 2 }}>
                <CardContent>
                  <Typography variant="h6">{prescription.medicationName}</Typography>
                  <Typography variant="body2">Dosage: {prescription.dosage}</Typography>
                  <Typography variant="body2">Time: {prescription.time}</Typography>
                  <Typography variant="body2">Days: {prescription.days.join(", ")}</Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default MedicationView;
