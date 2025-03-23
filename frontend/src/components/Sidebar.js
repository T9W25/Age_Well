import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Menu as MenuIcon, Dashboard, EventNote, Medication, Contacts, Logout, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ handleLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Medication Reminder", icon: <Medication />, path: "/medications" },
    { text: "Health Details", icon: <Favorite />, path: "/health-details" },
    { text: "Daily Check-in", icon: <EventNote />, path: "/daily-checkin" },
    { text: "Emergency Contacts", icon: <Contacts />, path: "/emergency" },
  ];

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#2E82E4" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>AgeWell</Typography>
          <IconButton edge="end" color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={() => { navigate(item.path); setOpen(false); }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
