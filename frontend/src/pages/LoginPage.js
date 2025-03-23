import React, { useState } from "react";
import { 
  Container, TextField, Button, Typography, Card, CardContent, IconButton, InputAdornment, CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false); // Toggle between login & register
  const [name, setName] = useState(""); // Only used for registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleAuth = async () => {
    const url = isRegister ? "http://localhost:5000/api/auth/register" : "http://localhost:5000/api/auth/login";
    const data = isRegister ? { name, email, password } : { email, password };
    
    setLoading(true); // Start loading
    setErrorMessage(""); // Clear previous errors

    try {
      const res = await axios.post(url, data);
      console.log("Login Response:", res.data);

      if (setUser) {  
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        navigate("/daily-checkin");
      } else {
        console.error("❌ setUser is undefined!");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);
      setErrorMessage(error.response?.data?.message || "Authentication failed!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ padding: "20px", textAlign: "center", width: "100%" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {isRegister ? "Register" : "Login"}
          </Typography>

          {/* Show Error Message if Authentication Fails */}
          {errorMessage && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {isRegister && (
            <TextField 
              fullWidth 
              label="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              sx={{ marginBottom: 2 }} 
            />
          )}

          <TextField 
            fullWidth 
            label="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            sx={{ marginBottom: 2 }} 
          />

          {/* Password Field with Visibility Toggle */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
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

          {/* Login/Register Button */}
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleAuth} 
            sx={{ marginBottom: 2 }} 
            disabled={loading} // Disable while loading
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : (isRegister ? "Register" : "Login")}
          </Button>

          <Typography variant="body2">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Login" : "Register"}
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
