import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, CardContent, Typography, List, ListItem } from "@mui/material";

const CaregiverDashboard = ({ user }) => {
  const [elderlyUsers, setElderlyUsers] = useState([]);

  useEffect(() => {
    const fetchElderlyUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/elderly-under-caregiver/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setElderlyUsers(res.data.elderlyUsers);
      } catch (error) {
        console.error("❌ Error fetching elderly users:", error);
      }
    };

    if (user?.role === "caregiver") {
      fetchElderlyUsers();
    }
  }, [user]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        My Assigned Elderly Users
      </Typography>

      <List>
        {elderlyUsers.map((elderly, index) => (
          <ListItem key={index}>
            <Card sx={{ width: "100%", padding: 2 }}>
              <CardContent>
                <Typography variant="h6">{elderly.name}</Typography>
                <Typography variant="body2">Email: {elderly.email}</Typography>
                <Typography variant="body2">Health Status: {elderly.healthStatus || "No data"}</Typography>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CaregiverDashboard;
