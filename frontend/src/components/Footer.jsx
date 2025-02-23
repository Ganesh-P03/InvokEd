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
import { queryService } from "../services/ai_engine_api"; // Import the API service

const Footer = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

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
      setIsListening(false);
      if (transcriptRef.current) {
        setFinalTranscript(transcriptRef.current);
        setOpenDialog(true);
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

  useEffect(() => {
    let silenceTimer;
    if (isListening && transcript) {
      silenceTimer = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 15000);
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
        } catch (error) {
          console.error("Failed to start recognition:", error);
          alert("There was an error starting speech recognition. Please try again.");
        }
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await queryService.sendQuery(finalTranscript);
      console.log("AI Engine Response:", response);

      if (response.isFrontend) {
        navigate(response.url); // Navigate to frontend URL
      } else {
        const fullBackendUrl = `http://127.0.0.1:8000${response.url}/`; // Append base URL
        navigate(`/bot?url=${encodeURIComponent(fullBackendUrl)}`); // Pass to /bot
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      alert("An error occurred while processing your request.");
    }

    setOpenDialog(false);
    setTranscript("");
    setFinalTranscript("");
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setTranscript("");
    setFinalTranscript("");
  };

  return (
    isAuthenticated && (
      <>
        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
          <Toolbar>
            <Typography variant="heading1" sx={{ flexGrow: 1, fontSize: '1.2rem' }}>
              You are logged in as {localStorage.getItem("TID")}
            </Typography>

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

        {/* Speech Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCancel}
          aria-labelledby="speech-dialog-title"
        >
          <DialogTitle id="speech-dialog-title">Confirm Speech Text</DialogTitle>
          <DialogContent>
            <DialogContentText>
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
