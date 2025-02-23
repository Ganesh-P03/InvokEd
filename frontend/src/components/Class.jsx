// This is Class.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Box, 
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import SyllabusPlanning from './SyllabusPlanning';
import Attendance from './Attendance';
import PerformanceTracker from './PerformanceTracker';

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [TID, setTID] = useState("");
  const [Type, setType] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [subjectID, setSubjectID] = useState("");

  // Map tab names to their indices
  const tabMapping = {
    'syllabus': 0,
    'attendance': 1,
    'performance': 2
  };

  // Map indices to tab names
  const reverseTabMapping = {
    0: 'syllabus',
    1: 'attendance',
    2: 'performance'
  };

  useEffect(() => {
    // Get TID, Type, and tab from URL params or localStorage
    const tidFromParams = searchParams.get("TID");
    const typeFromParams = searchParams.get("Type");
    const subjectIDFromParams = searchParams.get("SubjectID");
    const tabFromParams = searchParams.get("tab");
    
    setTID(tidFromParams || localStorage.getItem("TID") || "");
    setType(typeFromParams || localStorage.getItem("Type") || "");
    setSubjectID(subjectIDFromParams || "");
    setCurrentTab(tabMapping[tabFromParams] || 0);

    console.log("TID:", tidFromParams);
    console.log("Type:", typeFromParams);
    console.log("SubjectID:", subjectIDFromParams);
    
    
    // Set current tab based on URL parameter
    if (tabFromParams && tabMapping.hasOwnProperty(tabFromParams)) {
      setCurrentTab(tabMapping[tabFromParams]);
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    // Update the URL with the new tab value while preserving other parameters
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', reverseTabMapping[newValue]);
    setSearchParams(newParams);
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ position: 'fixed', top: '64px', left: 0, width: '100%', bgcolor: 'background.paper', zIndex: 1100 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Syllabus Planning" />
          <Tab label="Attendance" />
          <Tab label="Performance Tracker" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 12, width: '100%' }}>
        {currentTab === 0 && <SyllabusPlanning/>}
        {currentTab === 1 && <Attendance />}
        {currentTab === 2 && <PerformanceTracker />}
      </Box>
    </Box>
  );
};

export default ClassDetail;