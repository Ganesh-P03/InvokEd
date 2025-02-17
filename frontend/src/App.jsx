import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Header from "./components/Header";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("authenticated") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>} />
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
