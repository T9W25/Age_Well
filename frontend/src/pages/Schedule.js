import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, List, ListItem, IconButton, Alert, CircularProgress, Box } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const Schedule = ({ user }) => {
  const { user: loggedInUser } = useContext(AuthContext); // Get current user
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ title: "", description: "", date: "", time: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !user._id) {
      setError("User ID is missing.");
      return;
    }

    const fetchSchedules = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/schedules/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(res.data);
      } catch (error) {
        setError("Failed to load schedules.");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [user, token]);

  const addSchedule = async () => {
    if (!loggedInUser || loggedInUser.role !== "caregiver") {
      setError("Only caregivers can add schedules.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/schedules/${user._id}`, newSchedule, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules([...schedules, res.data.newSchedule]);
      setSuccessMessage("Schedule added!");
      setNewSchedule({ title: "", description: "", date: "", time: "" });
    } catch (error) {
      setError("Failed to add schedule.");
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!loggedInUser || loggedInUser.role !== "caregiver") {
      setError("Only caregivers can delete schedules.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/schedules/${user._id}/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(schedules.filter((s) => s._id !== scheduleId));
      setSuccessMessage("Schedule removed!");
    } catch (error) {
      setError("Failed to remove schedule.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
        📅 Schedule
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          {/* Caregivers Can Add Schedule */}
          {loggedInUser?.role === "caregiver" && (
            <Box sx={{ marginBottom: 3 }}>
              <TextField fullWidth label="Title" value={newSchedule.title} onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth label="Description" value={newSchedule.description} onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth type="date" value={newSchedule.date} onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth type="time" value={newSchedule.time} onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })} sx={{ marginBottom: 1 }} />
              <Button fullWidth variant="contained" onClick={addSchedule} sx={{ marginTop: 1 }}>
                Add Schedule
              </Button>
            </Box>
          )}

          {/* Display Schedule */}
          <List>
            {schedules.map((schedule) => (
              <ListItem key={schedule._id}>
                {schedule.title} - {schedule.date} at {schedule.time}
                {loggedInUser?.role === "caregiver" && (
                  <IconButton color="error" onClick={() => deleteSchedule(schedule._id)}>
                    <Delete />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Container>
  );
};

export default Schedule;
