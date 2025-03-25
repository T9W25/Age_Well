import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, List, ListItem, IconButton, Alert, CircularProgress, Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const DietPlan = ({ user }) => {
  const { user: loggedInUser } = useContext(AuthContext); // Get current user
  const [dietPlan, setDietPlan] = useState([]);
  const [newMeal, setNewMeal] = useState({ meal: "", time: "", notes: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !user._id) {
      setError("User ID is missing.");
      return;
    }

    const fetchDietPlan = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/diet/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDietPlan(res.data);
      } catch (error) {
        setError("Failed to load diet plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchDietPlan();
  }, [user, token]);

  const addMeal = async () => {
    if (!loggedInUser || loggedInUser.role !== "caregiver") {
      setError("Only caregivers can add diet plans.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/diet/${user._id}`, newMeal, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietPlan([...dietPlan, res.data.newDiet]);
      setSuccessMessage("Diet plan added!");
      setNewMeal({ meal: "", time: "", notes: "" });
    } catch (error) {
      setError("Failed to add diet plan.");
    }
  };

  const deleteMeal = async (dietId) => {
    if (!loggedInUser || loggedInUser.role !== "caregiver") {
      setError("Only caregivers can delete diet plans.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/diet/${user._id}/${dietId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietPlan(dietPlan.filter((d) => d._id !== dietId));
      setSuccessMessage("Meal removed!");
    } catch (error) {
      setError("Failed to remove meal.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
        🍽️ Diet Plan
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <>
          {/* Caregivers Can Add Meal */}
          {loggedInUser?.role === "caregiver" && (
            <Box sx={{ marginBottom: 3 }}>
              <TextField fullWidth label="Meal" value={newMeal.meal} onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth type="time" value={newMeal.time} onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField fullWidth label="Notes (Optional)" value={newMeal.notes} onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })} sx={{ marginBottom: 1 }} />
              <Button fullWidth variant="contained" onClick={addMeal} sx={{ marginTop: 1 }}>
                Add Meal
              </Button>
            </Box>
          )}

          {/* Display Diet Plan */}
          <List>
            {dietPlan.map((meal) => (
              <ListItem key={meal._id}>
                {meal.meal} - {meal.time} {meal.notes && `(${meal.notes})`}
                {loggedInUser?.role === "caregiver" && (
                  <IconButton color="error" onClick={() => deleteMeal(meal._id)}>
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

export default DietPlan;
