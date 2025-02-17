import React, { useState } from "react";
import { TextField, Button, Box, Container, Typography, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = ({ isAuthenticated,setIsAuthenticated }) => {  // Accept setIsAuthenticated as a prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Username and password are required!");
      return;
    }

    if (trimmedUsername === "admin" && trimmedPassword === "admin") {
      localStorage.setItem("authenticated", "true");
      setIsAuthenticated(true);  // Update state in App.jsx
      navigate("/home");
    } else {
      setError("Invalid username or password!");
    }
  };

  return (
    !isAuthenticated &&  // Render only when not authenticated
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src="/vite.svg" alt="Login" style={{ width: 100, height: 100 }} />
        </Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleLogin}
          sx={{ mt: 2 }}
          disabled={!username || !password}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
