import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CaregiverDashboard = ({ user }) => {
  const [elderlyUsers, setElderlyUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
  
    const fetchElderlyUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/elderly-under-caregiver/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setElderlyUsers(res.data);
      } catch (error) {
        console.error("❌ Error fetching elderly users:", error);
      }
    };
  
    fetchElderlyUsers();
  }, [user]);
  

  const goToPage = (elderlyId, type) => {
    navigate(`/caregiver/${elderlyId}/${type}`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        My Assigned Elderly Users
      </Typography>

      <List>
        {elderlyUsers.map((elderly) => (
          <ListItem key={elderly._id}>
            <Card sx={{ width: "100%", padding: 2 }}>
              <CardContent>
                <Typography variant="h6">{elderly.name}</Typography>
                <Typography>Email: {elderly.email}</Typography>
                <Typography>Health Status: {elderly.healthStatus || "No data"}</Typography>

                <Box sx={{ marginTop: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() => goToPage(elderly._id, "diet")}
                      >
                        View Diet Plan
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => goToPage(elderly._id, "schedule")}
                      >
                        View Schedule
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CaregiverDashboard;
