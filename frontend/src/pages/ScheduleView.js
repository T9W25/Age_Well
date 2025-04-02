import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";

const ScheduleView = ({ user }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (!user) return;

        const userId = user.role === "family" ? user.assignedFamilyMember : user._id;

        const res = await axios.get(`http://localhost:5000/api/schedules/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setSchedules(res.data);
      } catch (error) {
        console.error("❌ Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user]);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Loading user...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        My Care Schedule
      </Typography>

      {loading ? (
        <Container sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Container>
      ) : schedules.length === 0 ? (
        <Typography align="center">No schedules found.</Typography>
      ) : (
        <List>
          {schedules.map((schedule) => (
            <ListItem key={schedule._id}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h6">{schedule.title}</Typography>
                  <Typography variant="body2">{schedule.description}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(schedule.date).toLocaleDateString()} at {schedule.time}
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

export default ScheduleView;
