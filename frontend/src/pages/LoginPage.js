import React, { useState } from "react";
import {
  TextField, Button, Typography, Card, CardContent,
  IconButton, InputAdornment, CircularProgress, Box,
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logoBg from "../assets/Agewell_logo.jpg"; // ✅ Ensure this is correct

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("elderly"); // ✅ Default role for register
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuth = async () => {
    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const data = isRegister
      ? { name, email, password, role }
      : { email, password };

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(url, data);

      if (setUser) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        // ✅ Redirect based on role
        const userRole = res.data.user.role;
        switch (userRole) {
          case "elderly":
            navigate("/daily-checkin");
            break;
          case "caregiver":
            navigate("/caregiver-dashboard");
            break;
          case "family":
            navigate("/family-dashboard");
            break;
          case "healthcare":
            navigate("/healthcare-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);
      setErrorMessage(error.response?.data?.message || "Authentication failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${logoBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          padding: 3,
          width: "90%",
          maxWidth: 400,
          backgroundColor: "rgba(255, 255, 255, 0.2)", // transparent white
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            {isRegister ? "Register" : "Login"}
          </Typography>

          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {isRegister && (
            <>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="elderly">Elderly</MenuItem>
                  <MenuItem value="caregiver">Caregiver</MenuItem>
                  <MenuItem value="healthcare">Healthcare Professional</MenuItem>
                  <MenuItem value="family">Family Member</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleAuth}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : isRegister ? "Register" : "Login"}
          </Button>

          <Typography variant="body2" align="center">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
