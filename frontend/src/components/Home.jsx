// This is Home.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

// Classroom data
const classroomData = [
  { ClassroomID: "6A", ClassTeacherID: "T001" },
  { ClassroomID: "7A", ClassTeacherID: "T003" },
  { ClassroomID: "8A", ClassTeacherID: "T005" },
  { ClassroomID: "8B", ClassTeacherID: "T006" },
  { ClassroomID: "9A", ClassTeacherID: "T007" },
  { ClassroomID: "9B", ClassTeacherID: "T008" },
  { ClassroomID: "10A", ClassTeacherID: "T009" },
  { ClassroomID: "10B", ClassTeacherID: "T010" },
];

// Classes handled by different teachers
const classroomsHandledByTeachers = {
  "T001": [
    { ClassroomID: "6A", ClassTeacherID: "T001" },
    { ClassroomID: "7A", ClassTeacherID: "T003" },
    { ClassroomID: "7B", ClassTeacherID: "T004" },
    { ClassroomID: "8A", ClassTeacherID: "T005" },
    { ClassroomID: "9A", ClassTeacherID: "T007" },
  ],
  "T002": [
    { ClassroomID: "7A", ClassTeacherID: "T003" },
    { ClassroomID: "8B", ClassTeacherID: "T006" },
    { ClassroomID: "9B", ClassTeacherID: "T008" },
    { ClassroomID: "10A", ClassTeacherID: "T009" },
    { ClassroomID: "10B", ClassTeacherID: "T010" },
  ],
  "T003": classroomData, // Headmaster has access to all classrooms
};

// Teacher details with required fields

const loggedInTeacherDetails = [
  { 
    TID: "T001", 
    Name: "Sarah Johnson", 
    DateofJoining: "2018-08-15", 
    Phone: "555-123-4567", 
    SubjectID: "Mathematics" 
  },
  { 
    TID: "T002", 
    Name: "Michael Chen", 
    DateofJoining: "2016-07-20", 
    Phone: "555-234-5678", 
    SubjectID: "Social" 
  },
  { 
    TID: "T003", 
    Name: "Amelia Patel", 
    DateofJoining: "2019-01-10", 
    Phone: "555-345-6789", 
    SubjectID: "Science" 
  }

];

// 🎨 Background colors for each classroom (Google Classroom style)
const bgColors = [
  "#FFB74D", // Orange
  "#64B5F6", // Blue
  "#81C784", // Green
  "#FF8A80", // Red
  "#BA68C8", // Purple
  "#FFD54F", // Yellow
];

// 🎨 SVG Background patterns
const svgPatterns = [
  // Circuit Board pattern
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="none" />
    <circle cx="10" cy="10" r="2" fill="white" opacity="0.5" />
    <circle cx="30" cy="10" r="2" fill="white" opacity="0.5" />
    <circle cx="50" cy="10" r="2" fill="white" opacity="0.5" />
    <path d="M10 10 H 30 V 30" stroke="white" stroke-width="1" fill="none" opacity="0.3" />
    <path d="M50 10 H 70 V 30" stroke="white" stroke-width="1" fill="none" opacity="0.3" />
    <circle cx="10" cy="50" r="2" fill="white" opacity="0.5" />
    <circle cx="30" cy="50" r="2" fill="white" opacity="0.5" />
    <circle cx="50" cy="50" r="2" fill="white" opacity="0.5" />
  </svg>`,

  // Books pattern
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="none" />
    <rect x="5" y="20" width="15" height="60" rx="1" fill="white" opacity="0.4" />
    <rect x="22" y="15" width="12" height="65" rx="1" fill="white" opacity="0.3" />
    <rect x="36" y="25" width="18" height="55" rx="1" fill="white" opacity="0.5" />
    <rect x="56" y="20" width="10" height="60" rx="1" fill="white" opacity="0.3" />
    <rect x="68" y="15" width="14" height="65" rx="1" fill="white" opacity="0.4" />
  </svg>`,

  // Geometry pattern
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="none" />
    <circle cx="20" cy="20" r="15" fill="none" stroke="white" stroke-width="1" opacity="0.3" />
    <circle cx="70" cy="30" r="10" fill="none" stroke="white" stroke-width="1" opacity="0.3" />
    <rect x="15" y="60" width="20" height="20" fill="none" stroke="white" stroke-width="1" opacity="0.3" />
    <polygon points="65,50 80,60 75,80 55,75" fill="none" stroke="white" stroke-width="1" opacity="0.3" />
    <line x1="20" y1="20" x2="70" y2="30" stroke="white" stroke-width="1" opacity="0.2" />
  </svg>`,

  // Pencils pattern
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="none" />
    <g transform="rotate(45, 30, 70)">
      <rect x="10" y="50" width="40" height="5" fill="white" opacity="0.4" />
      <polygon points="10,50 10,55 5,52.5" fill="white" opacity="0.6" />
    </g>
    <g transform="rotate(-30, 70, 40)">
      <rect x="50" y="35" width="40" height="5" fill="white" opacity="0.4" />
      <polygon points="50,35 50,40 45,37.5" fill="white" opacity="0.6" />
    </g>
  </svg>`,

  // Graduation Cap pattern
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="none" />
    <path d="M20,20 L35,15 L50,20 L35,25 Z" fill="white" opacity="0.4" />
    <path d="M35,25 L35,35 M20,20 L20,30" stroke="white" stroke-width="1" fill="none" opacity="0.3" />
    <path d="M60,50 L75,45 L90,50 L75,55 Z" fill="white" opacity="0.4" />
    <path d="M75,55 L75,65 M60,50 L60,60" stroke="white" stroke-width="1" fill="none" opacity="0.3" />
  </svg>`,

  // Graph Paper pattern
  `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="none" />
    <line x1="0" y1="0" x2="100" y2="0" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="0" y1="20" x2="100" y2="20" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="0" y1="40" x2="100" y2="40" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="0" y1="60" x2="100" y2="60" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="0" y1="80" x2="100" y2="80" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="0" y1="0" x2="0" y2="100" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="20" y1="0" x2="20" y2="100" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="40" y1="0" x2="40" y2="100" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="60" y1="0" x2="60" y2="100" stroke="white" stroke-width="0.5" opacity="0.2" />
    <line x1="80" y1="0" x2="80" y2="100" stroke="white" stroke-width="0.5" opacity="0.2" />
  </svg>`,
];

// Convert SVG string to data URL
const svgToDataUrl = (svg) => {
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
};

// Grid Item Component
const Item = ({ children, onClick, index }) => {
  // Get SVG pattern as data URL
  const svgDataUrl = svgToDataUrl(svgPatterns[index % svgPatterns.length]);

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        width: "300px",
        height: "180px",
        padding: "10px",
        margin: "10px",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: bgColors[index % bgColors.length],
        position: "relative",
        overflow: "hidden",
        transition: "0.3s ease",
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.15)",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.2)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("${svgDataUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
          zIndex: 0
        }
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

// Home Component
const Home = () => {
  const [searchParams] = useSearchParams();
  const [TID, setTid] = useState("");
  const [Type, setType] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get TID and Type from URL params or localStorage
    const tidFromParams = searchParams.get("TID");
    const typeFromParams = searchParams.get("Type");
    
    const tid = tidFromParams || localStorage.getItem("TID") || "";
    const type = typeFromParams || localStorage.getItem("Type") || "";
    
    setTid(tid);
    setType(type);
    
    // Determine which classrooms to display based on Type
    if (type === "Headmaster") {
      setClassrooms(classroomData);
    } else if (tid && classroomsHandledByTeachers[tid]) {
      setClassrooms(classroomsHandledByTeachers[tid]);
    } else {
      setClassrooms([]);
    }
  }, [searchParams]);

  // Function to navigate to classroom with preserved query parameters
const navigateToClassroom = (classroomID) => {
  // Find the subject ID for the logged-in teacher
  const currentTeacher = loggedInTeacherDetails.find(teacher => teacher.TID === TID);
  const subjectID = currentTeacher ? currentTeacher.SubjectID : "";
  
  // Create the URL with preserved query parameters including SubjectID
  navigate(`/class/${classroomID}?TID=${TID}&Type=${Type}&SubjectID=${subjectID}`);
};

  return (
    <div>
      <Box sx={{ marginTop: "64px", flexGrow: 1, padding: "20px", overflowY: "auto", height: "100vh" }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", color: "#333" }}>
          {Type === "Headmaster" ? "All Classrooms" : "Your Assigned Classrooms"}
        </Typography>
        
        <Grid container spacing={2} columns={12} justifyContent="center">
          {classrooms.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.ClassroomID} display="flex" justifyContent="center">
              <Item
                index={index}
                onClick={() => navigateToClassroom(item.ClassroomID)}
              >
                {item.ClassroomID}
              </Item>
            </Grid>
          ))}
          
          {classrooms.length === 0 && (
            <Typography variant="h6" sx={{ mt: 4, textAlign: "center", width: "100%" }}>
              No classrooms assigned.
            </Typography>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default Home;