import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { syllabusService } from "../services/api";

const formatDate = (dateString) => {
  if (!dateString) return 'No date set';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid date';
  }
};

const SyllabusPlanning = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ chapters: [], modules: [] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [tempEditData, setTempEditData] = useState({
    ThisWeek: false,
    RemainingTime: 0
  });
  const [updating, setUpdating] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [TID, setTID] = useState("");
  const [Type, setType] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [subjectID, setSubjectID] = useState("");

  useEffect(() => {
    const tidFromParams = searchParams.get("TID");
    const typeFromParams = searchParams.get("Type");
    const subjectIDFromParams = searchParams.get("SubjectID");
    const tabFromParams = searchParams.get("tab");
    const tabMapping = {
      'syllabus': 0,
      'attendance': 1,
      'performance': 2
    };
    
    setTID(tidFromParams || localStorage.getItem("TID") || "");
    setType(typeFromParams || localStorage.getItem("Type") || "");
    setSubjectID(subjectIDFromParams || "");
    setCurrentTab(tabMapping[tabFromParams] || 0);
  }, [searchParams]);

  const fetchModules = async (chapterId) => {
    try {
      const moduleData = await syllabusService.getModules(chapterId);
      return moduleData;
    } catch (error) {
      console.error("Error fetching modules:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const syllabusId = `${id}_${subjectID}`;
        const chapters = await syllabusService.getChapters(syllabusId);
        const modulesPromises = chapters.map(chapter => fetchModules(chapter.ChapterID));
        const modulesData = await Promise.all(modulesPromises);
        
        setData({
          chapters,
          modules: modulesData.flat()
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && subjectID) {
      fetchData();
    }
  }, [id, subjectID]);

  const handleModuleEdit = (module) => {
    setEditingModule(module);
    setTempEditData({
      ThisWeek: module.ThisWeek || false,
      RemainingTime: module.RemainingTime || 0
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingModule(null);
    setTempEditData({
      ThisWeek: false,
      RemainingTime: 0
    });
    setUpdating(false);
  };

  const handleSubmitChanges = async () => {
    if (!editingModule) return;
    
    setUpdating(true);
    try {
      // Ensure the update data matches the API structure
      const updateData = {
        ModuleID: editingModule.ModuleID,
        ChapterID: editingModule.ChapterID,
        ModuleName: editingModule.ModuleName,
        URL: editingModule.URL,
        ThisWeek: tempEditData.ThisWeek,
        RemainingTime: tempEditData.RemainingTime,
        estimated_completion_date: editingModule.estimated_completion_date, // Ensure this is included if required
      };
  
      console.log("Submitting Data: ", updateData);
  
      // Make the API call
      await syllabusService.putModules(editingModule.ModuleID, updateData);
  
      // Update local state
      setData(prevData => ({
        ...prevData,
        modules: prevData.modules.map(mod =>
          mod.ModuleID === editingModule.ModuleID
            ? { ...mod, ...updateData }
            : mod
        ),
      }));
  
      handleDialogClose();
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Failed to update module. Please try again.");
    } finally {
      setUpdating(false);
    }
    console.error("Error updating module:", error.response?.data || error);

  };  

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{mt: 2, mb: 10}}>
      {data.chapters.map((chapter) => (
        <Accordion key={chapter.ChapterID}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '55vw' }}>
              <Typography variant="h6">{chapter.ChapterName}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Target Date: {formatDate(chapter.targetDate)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Estimated Completion: {formatDate(chapter.estimated_completion_date)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {data.modules
              .filter((module) => module.ChapterID === chapter.ChapterID)
              .map((module) => (
                <Box 
                  key={module.ModuleID}
                  sx={{ 
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 2,
                    mb: 1
                  }}
                >
                  <Typography variant="subtitle1">{module.ModuleName}</Typography>
                  <Typography variant="body2">
                    URL: <a href={module.URL} target="_blank" rel="noopener noreferrer">{module.URL}</a>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <RadioGroup 
                      row 
                      value={module.ThisWeek ? "true" : "false"}
                      onChange={() => handleModuleEdit(module)}
                    >
                      <FormControlLabel 
                        value="true"
                        control={<Radio />}
                        label="This Week"
                      />
                      <FormControlLabel 
                        value="false"
                        control={<Radio />}
                        label="Not This Week"
                      />
                    </RadioGroup>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                        Remaining Time: {module.RemainingTime || 0} hours
                      </Typography>
                      <Button 
                        size="small"
                        variant="outlined"
                        onClick={() => handleModuleEdit(module)}
                      >
                        Edit
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Module Details</DialogTitle>
        <DialogContent>
          <RadioGroup 
            value={tempEditData.ThisWeek.toString()}
            onChange={(e) => setTempEditData({
              ...tempEditData,
              ThisWeek: e.target.value === "true"
            })}
          >
            <FormControlLabel value="true" control={<Radio />} label="This Week" />
            <FormControlLabel value="false" control={<Radio />} label="Not This Week" />
          </RadioGroup>
          <TextField
            label="Remaining Time (hours)"
            type="number"
            value={tempEditData.RemainingTime}
            onChange={(e) => setTempEditData({
              ...tempEditData,
              RemainingTime: parseInt(e.target.value, 10) || 0
            })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={updating}>Cancel</Button>
          <Button 
            onClick={handleSubmitChanges} 
            variant="contained" 
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SyllabusPlanning;