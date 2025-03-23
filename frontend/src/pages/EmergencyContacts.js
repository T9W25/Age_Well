import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, Button, List, ListItem, IconButton, Alert, CircularProgress
} from "@mui/material";
import { Delete, Call, Report } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext

const EmergencyContacts = () => {
  const { user } = useContext(AuthContext); // ✅ Get user from AuthContext
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !user._id) {
      setError("User ID is missing.");
      return;
    }

    const fetchContacts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/emergency/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(res.data);
      } catch (error) {
        setError("Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [user, token]);

  const addContact = async () => {
    if (!user?._id) {
      setError("User ID is missing.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/emergency/${user._id}`, newContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data.emergencyContacts);
      setSuccessMessage("Contact added!");
      setNewContact({ name: "", phone: "", relationship: "" });
    } catch (error) {
      setError("Failed to add contact.");
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await axios.delete(`http://localhost:5000/api/emergency/${user._id}/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(contacts.filter((c) => c._id !== contactId));
      setSuccessMessage("Contact removed!");
    } catch (error) {
      setError("Failed to remove contact.");
    }
  };

  // ✅ Open phone dialer when clicking a contact
  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  // ✅ Trigger Emergency Alert (Backend API)
  const triggerEmergencyAlert = async () => {
    try {
      await axios.post("http://localhost:5000/api/emergency/alert", { userId: user._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      new Audio("/alert.mp3").play(); // ✅ Play emergency alert sound
      alert("🚨 Emergency alert sent to all contacts!");
    } catch (error) {
      alert("❌ Failed to send emergency alert.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 3 }}>
        🚨 Emergency Contacts
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {/* ✅ Emergency Alert Button */}
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={triggerEmergencyAlert}
        sx={{ marginBottom: 2 }}
        startIcon={<Report />}
      >
        Send Emergency Alert 🚨
      </Button>

      {/* ✅ Add Contact Form */}
      <TextField fullWidth label="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} sx={{ marginBottom: 2 }} />
      <TextField fullWidth label="Phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} sx={{ marginBottom: 2 }} />
      <TextField fullWidth label="Relationship" value={newContact.relationship} onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })} sx={{ marginBottom: 2 }} />
      <Button variant="contained" fullWidth onClick={addContact} sx={{ marginBottom: 2 }}>Add Contact</Button>

      {/* ✅ Contacts List */}
      {loading ? <CircularProgress sx={{ display: "block", margin: "0 auto" }} /> : (
        <List>
          {contacts.map((contact) => (
            <ListItem key={contact._id} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{contact.name} - {contact.phone} ({contact.relationship})</Typography>
              <div>
                <IconButton color="primary" onClick={() => handleCall(contact.phone)}><Call /></IconButton>
                <IconButton color="error" onClick={() => deleteContact(contact._id)}><Delete /></IconButton>
              </div>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default EmergencyContacts;
