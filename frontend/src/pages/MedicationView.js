import React, { useState, useEffect } from "react";
import { getPrescriptions, markMedicationTaken } from "../api/prescription";
import { 
  Container, Card, CardContent, Typography, List, ListItem, CircularProgress, Checkbox 
} from "@mui/material";

const MedicationView = ({ user }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions(user._id);
        setPrescriptions(data);
      } catch (error) {
        console.error("❌ Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPrescriptions();
  }, [user]);

  const handleMarkAsTaken = async (prescriptionId) => {
    try {
      await markMedicationTaken(prescriptionId);
      setPrescriptions(prev =>
        prev.map(p => (p._id === prescriptionId ? { ...p, taken: true } : p))
      );
    } catch (error) {
      console.error("❌ Error marking medication as taken:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Medication Schedule
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : prescriptions.length === 0 ? (
        <Typography>No prescriptions available.</Typography>
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

                  {/* ✅ Checkbox to mark as taken */}
                  <Checkbox
                    checked={prescription.taken}
                    onChange={() => handleMarkAsTaken(prescription._id)}
                    disabled={prescription.taken}
                  />
                  <Typography variant="body2" color={prescription.taken ? "green" : "red"}>
                    {prescription.taken ? "✔ Taken" : "❌ Not Taken"}
                  </Typography>
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
