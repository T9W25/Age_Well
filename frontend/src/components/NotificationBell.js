import React, { useEffect, useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import notificationSound from "../assets/notification.mp3";

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const audio = new Audio(notificationSound);

  useEffect(() => {
    if (!userId) return; // ✅ Prevent fetch if userId is undefined

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/notifications/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const unread = res.data.filter((n) => !n.read);

        if (unread.length > notifications.length) {
          audio.play();
        }

        setNotifications(unread);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId, notifications.length]);

  const handleMarkAsRead = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/notifications/mark-read/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications([]);
      setAnchorEl(null);
    } catch (error) {
      console.error("❌ Error marking notifications as read:", error);
    }
  };

  const handleRespond = async (notificationId, accept) => {
    try {
      await axios.post(
        `http://localhost:5000/api/notifications/respond/${notificationId}`,
        { accept },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("❌ Error responding to caregiver request:", error);
    }
  };

  return (
    <div>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {notifications.length === 0 ? (
          <MenuItem>No Notifications</MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index} sx={{ whiteSpace: "normal", maxWidth: 300 }}>
              <Stack spacing={1}>
                <Typography variant="body2">{notification.message}</Typography>
                {notification.type === "request" && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleRespond(notification._id, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleRespond(notification._id, false)}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
              </Stack>
            </MenuItem>
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
