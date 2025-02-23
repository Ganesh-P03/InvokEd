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
  Button,
  Box,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { queryService } from "../services/ai_engine_api";

const Footer = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [timer, setTimer] = useState(3);
  const [progress, setProgress] = useState(100);
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
        setTimer(3);
        setProgress(100);
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

  // Smooth timer effect
  useEffect(() => {
    let timerInterval;
    let progressInterval;

    if (openDialog && timer > 0) {
      // Update timer every second
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      // Update progress more frequently for smooth animation
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (3 * 60)); // 60 updates per second
          return newProgress > 0 ? newProgress : 0;
        });
      }, 1000 / 60); // 60 FPS
    } else if (timer === 0) {
      handleConfirm();
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(progressInterval);
    };
  }, [openDialog, timer]);

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

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synth.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes("Female") || 
      voice.name.includes("Google UK English Female") || 
      voice.name.includes("Microsoft Zira")
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.lang = "en-US";
    utterance.rate = 1.05;
    utterance.volume = 1;
    
    synth.speak(utterance);
  };

  const handleConfirm = async () => {
    try {
      await speak("Sure, let me show you the details");
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const response = await queryService.sendQuery(finalTranscript);
      console.log("AI Engine Response:", response);

      if (response.isFrontend) {
        navigate(response.url);
      } else {
        const fullBackendUrl = `http://127.0.0.1:8000${response.url}`; // Append base URL
        navigate(`/bot?url=${encodeURIComponent(fullBackendUrl)}`); // Pass to /bot
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      alert("An error occurred while processing your request.");
    }

    setOpenDialog(false);
    setTranscript("");
    setFinalTranscript("");
    setTimer(3);
    setProgress(100);
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setTranscript("");
    setFinalTranscript("");
    setTimer(3);
    setProgress(100);
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

        <Dialog
          open={openDialog}
          onClose={handleCancel}
          aria-labelledby="speech-dialog-title"
        >
          <DialogTitle id="speech-dialog-title">Confirm Speech Text</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DialogContentText sx={{ mr: 2 }}>
                Is this what you wanted to ask?
              </DialogContentText>
              <Box sx={{ 
                position: 'relative', 
                display: 'inline-flex',
                transition: 'all 0.3s ease'
              }}>
                <CircularProgress
                  variant="determinate"
                  value={progress}
                  size={40}
                  sx={{
                    transition: 'all 0.3s ease',
                    '& .MuiCircularProgress-circle': {
                      transition: 'all 0.3s ease'
                    }
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography 
                    variant="caption" 
                    component="div" 
                    color="text.secondary"
                    sx={{
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {timer}
                  </Typography>
                </Box>
              </Box>
            </Box>
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