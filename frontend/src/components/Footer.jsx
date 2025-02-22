import React, { useState, useEffect, useRef } from "react";
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const Footer = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  
  // Use refs to maintain values across renders
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  
  // Keep ref in sync with state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  
  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const currentTranscript = event.results[current][0].transcript;
      setTranscript(currentTranscript);
    };
    
    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      
      // Important: Use ref value here to ensure we have the latest transcript
      if (transcriptRef.current) {
        setFinalTranscript(transcriptRef.current);
        setOpenDialog(true);
        console.log("Dialog should open with:", transcriptRef.current);
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);

  // Silence detection
  useEffect(() => {
    let silenceTimer;
    if (isListening && transcript) {
      silenceTimer = setTimeout(() => {
        console.log("Silence detected, stopping recognition");
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 10000); // 10 seconds of silence
    }
    
    return () => clearTimeout(silenceTimer);
  }, [transcript, isListening]);
  
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
    } else {
      if (recognitionRef.current) {
        setTranscript("");
        try {
          recognitionRef.current.start();
          setIsListening(true);
          console.log("Started listening");
        } catch (error) {
          console.error("Failed to start recognition:", error);
          alert("There was an error starting speech recognition. Please try again.");
        }
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    }
  };

  const handleConfirm = () => {
    // Process the speech text here
    console.log("Proceeding with:", finalTranscript);
    // Handle the confirmed text (e.g., send to chatbot)
    
    setOpenDialog(false);
    setTranscript("");
    setFinalTranscript("");
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setTranscript("");
    setFinalTranscript("");
  };

  // Force dialog to stay open when it should be open
  useEffect(() => {
    if (finalTranscript && !openDialog) {
      console.log("Forcing dialog open");
      setOpenDialog(true);
    }
  }, [finalTranscript, openDialog]);

  return (
    isAuthenticated && (
      <>
        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
          <Toolbar>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              You are logged in as {localStorage.getItem("TID")}
            </Typography>
            
            {/* Display live transcript while speaking */}
            {isListening && transcript && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mr: 2, 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  maxWidth: '300px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                "{transcript}"
              </Typography>
            )}
            
            {/* Mic icon button */}
            <IconButton 
              color="inherit" 
              onClick={toggleListening}
              sx={{ 
                backgroundColor: isListening ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
              }}
            >
              {isListening ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCancel}
          aria-labelledby="speech-dialog-title"
          aria-describedby="speech-dialog-description"
        >
          <DialogTitle id="speech-dialog-title">Confirm Speech Text</DialogTitle>
          <DialogContent>
            <DialogContentText id="speech-dialog-description">
              Is this what you wanted to ask?
            </DialogContentText>
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 2, 
                p: 2, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                fontWeight: 'medium'
              }}
            >
              {finalTranscript}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="error">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

export default Footer;