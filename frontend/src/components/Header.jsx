// This is Header.jsx

import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";


const Header = ({ isAuthenticated, setIsAuthenticated }) => { // Accept props
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    navigate("/home"); // Navigate to the home page
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("TID");
    localStorage.removeItem("Type");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    isAuthenticated &&  // Render only when authenticated
    <AppBar position="fixed" display="block">
      <Toolbar>
        {/* Home Icon on the Left */}
        <IconButton edge="start" color="inherit" aria-label="home" onClick={handleHomeClick}>
          <HomeIcon />
        </IconButton>

        {/* Title or other content in the header */}
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
        EduYantra
        </Typography>

        {/* Box to align logout button to the right */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {/* Logout button shown only when authenticated */}
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
