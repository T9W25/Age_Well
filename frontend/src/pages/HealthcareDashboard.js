import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";

const HealthcareDashboard = ({ user }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || "Healthcare Professional"} 👩‍⚕️👨‍⚕️
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This is your healthcare dashboard. Here you will be able to manage patients, view their records, schedule appointments, and collaborate with caregivers and family members.
        </Typography>

        <Box mt={4}>
          <Typography variant="h6">📌 Coming Soon:</Typography>
          <ul>
            <li>Patient overview and analytics</li>
            <li>Medical history access</li>
            <li>Care coordination tools</li>
            <li>Health alerts and check-ins</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
};

export default HealthcareDashboard;
