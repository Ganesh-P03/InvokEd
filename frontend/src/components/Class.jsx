import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [TID, setTID] = useState("");
  const [Type, setType] = useState("");

  useEffect(() => {
    // Get TID and Type from URL params or localStorage
    const tidFromParams = searchParams.get("TID");
    const typeFromParams = searchParams.get("Type");
    
    setTID(tidFromParams || localStorage.getItem("TID") || "");
    setType(typeFromParams || localStorage.getItem("Type") || "");
  }, [searchParams]);


  return (
    <Box sx={{ padding: 3 }}>
      
      <Typography variant="h4" gutterBottom>
        Class {id} Details
      </Typography>
      
      <Typography variant="body1">
        This is the detailed view for classroom {id}.
      </Typography>
    </Box>
  );
};

export default ClassDetail;