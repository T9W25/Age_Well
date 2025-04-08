import React, { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper
} from "@mui/material";
import api from "../api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await api.put(
        `/api/admin/users/${userId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        Admin Dashboard
      </Typography>

      <Paper elevation={3} sx={{ overflowX: "auto", p: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status || "active"}</TableCell>
                <TableCell>
                  {user.status === "pending" ? (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => updateUserStatus(user.id, "approved")}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => updateUserStatus(user.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No Actions
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
