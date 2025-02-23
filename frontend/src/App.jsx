// This is App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Class from "./components/Class";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import BotPage from "./components/Bot";

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

  // Wrapper component to handle default tab
  const ClassWithDefaultTab = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    useEffect(() => {
      if (!searchParams.get('tab')) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', 'syllabus');
        setSearchParams(newParams);
      }
    }, [searchParams, setSearchParams]);

    return <Class />;
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>} />
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
        />
        <Route 
          path="/class/:id" 
          element={isAuthenticated ? <ClassWithDefaultTab /> : <Navigate to="/" />}
        />
        <Route 
          path="/bot" 
          element={isAuthenticated ? <BotPage /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

export default App;