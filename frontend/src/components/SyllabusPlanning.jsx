import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
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
      const updateData = {
        ModuleID: editingModule.ModuleID,
        ChapterID: editingModule.ChapterID,
        ModuleName: editingModule.ModuleName,
        URL: editingModule.URL,
        ThisWeek: tempEditData.ThisWeek,
        RemainingTime: tempEditData.RemainingTime,
        estimated_completion_date: editingModule.estimated_completion_date
      };
  
      await syllabusService.putModules(editingModule.ModuleID, updateData);
  
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
  };  

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{mt: 2, mb: 10}}>
      {data.chapters.map((chapter) => (
        <Accordion key={chapter.ChapterID}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Typography variant="h6">{chapter.ChapterName}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Target Date: {formatDate(chapter.targetDate)} | 
                Estimated Completion: {formatDate(chapter.estimated_completion_date)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Module Name</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell align="center">This Week</TableCell>
                    <TableCell align="center">Remaining Time (hrs)</TableCell>
                    <TableCell align="center">Est. Completion Date</TableCell>
                    <TableCell align="center">Edit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.modules
                    .filter((module) => module.ChapterID === chapter.ChapterID)
                    .map((module) => (
                      <TableRow key={module.ModuleID}>
                        <TableCell>{module.ModuleName}</TableCell>
                        <TableCell>
                          <a href={module.URL} target="_blank" rel="noopener noreferrer">
                            {module.URL}
                          </a>
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={module.ThisWeek || false}
                            onChange={() => handleModuleEdit(module)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {module.RemainingTime || 0}
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(module.estimated_completion_date)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            size="small"
                            onClick={() => handleModuleEdit(module)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Module Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography>This Week</Typography>
            <Switch
              checked={tempEditData.ThisWeek}
              onChange={(e) => setTempEditData({
                ...tempEditData,
                ThisWeek: e.target.checked
              })}
            />
          </Box>
          <TextField
            label="Remaining Time (hours)"
            type="number"
            fullWidth
            value={tempEditData.RemainingTime}
            onChange={(e) => setTempEditData({
              ...tempEditData,
              RemainingTime: parseInt(e.target.value, 10) || 0
            })}
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