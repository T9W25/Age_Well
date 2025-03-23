import React, { useEffect, useState } from "react";
import { IconButton, Badge, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import notificationSound from "../assets/notification.mp3"; // ✅ Add notification sound

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const audio = new Audio(notificationSound); // ✅ Load sound

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
        const unreadNotifications = res.data.filter(n => !n.read);

        // ✅ Play sound only if new notifications are received
        if (unreadNotifications.length > notifications.length) {
          audio.play();
        }

        setNotifications(unreadNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications(); // Fetch immediately

    // ✅ Auto-fetch notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval); // Cleanup
  }, [userId, notifications]);

  const handleMarkAsRead = async () => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/mark-read/${userId}`);
      setNotifications([]); // Clear UI notifications
      setAnchorEl(null);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {notifications.length === 0 ? (
          <MenuItem>No Notifications</MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index}>{notification.message}</MenuItem>
          ))
        )}
        {notifications.length > 0 && (
          <MenuItem onClick={handleMarkAsRead}>Mark All as Read</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default NotificationBell;
