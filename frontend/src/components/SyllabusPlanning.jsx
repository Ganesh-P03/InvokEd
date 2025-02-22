// This is SyllabusPlanning.jsx

import React, { useState, useEffect } from "react";
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

// Moved syllabusData here
const syllabusData = {
  "Syllabus": [
    {
      "SyllabusID": "SYL001",
      "estimated_completion_date": "2025-03-18",
      "ClassroomID": "7A",
      "SubjectID": "Mathematics",
      "TID": "T001"
    },
    {
      "SyllabusID": "SYL002",
      "estimated_completion_date": "2025-03-20",
      "ClassroomID": "7A",
      "SubjectID": "Social",
      "TID": "T002"
    },
    {
      "SyllabusID": "SYL003",
      "estimated_completion_date": "2025-03-22",
      "ClassroomID": "7A",
      "SubjectID": "Science",
      "TID": "T003"
    }
  ],
  "Chapters": [
    {
      "ChapterID": "CH001",
      "estimated_completion_date": "2025-03-18",
      "ChapterName": "Algebra Basics",
      "TargetDate": "2025-02-20",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH002",
      "estimated_completion_date": "2025-03-15",
      "ChapterName": "Linear Equations",
      "TargetDate": "2025-02-27",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH001",
      "estimated_completion_date": "2025-03-18",
      "ChapterName": "Algebra Basics",
      "TargetDate": "2025-02-20",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH002",
      "estimated_completion_date": "2025-03-15",
      "ChapterName": "Linear Equations",
      "TargetDate": "2025-02-27",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH001",
      "estimated_completion_date": "2025-03-18",
      "ChapterName": "Algebra Basics",
      "TargetDate": "2025-02-20",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH002",
      "estimated_completion_date": "2025-03-15",
      "ChapterName": "Linear Equations",
      "TargetDate": "2025-02-27",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH001",
      "estimated_completion_date": "2025-03-18",
      "ChapterName": "Algebra Basics",
      "TargetDate": "2025-02-20",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH002",
      "estimated_completion_date": "2025-03-15",
      "ChapterName": "Linear Equations",
      "TargetDate": "2025-02-27",
      "SyllabusID": "SYL001"
    },
    {
      "ChapterID": "CH003",
      "estimated_completion_date": "2025-03-10",
      "ChapterName": "Ancient Civilizations",
      "TargetDate": "2025-02-25",
      "SyllabusID": "SYL002"
    },
    {
      "ChapterID": "CH004",
      "estimated_completion_date": "2025-03-12",
      "ChapterName": "Modern History",
      "TargetDate": "2025-03-01",
      "SyllabusID": "SYL002"
    },
    {
      "ChapterID": "CH005",
      "estimated_completion_date": "2025-03-17",
      "ChapterName": "Physics Fundamentals",
      "TargetDate": "2025-02-28",
      "SyllabusID": "SYL003"
    },
    {
      "ChapterID": "CH006",
      "estimated_completion_date": "2025-03-20",
      "ChapterName": "Biology Basics",
      "TargetDate": "2025-03-05",
      "SyllabusID": "SYL003"
    }
  ],
  "Modules": [
    {
      "ModuleID": "MOD001",
      "estimated_completion_date": "2025-02-25",
      "ModuleName": "Introduction to Algebra",
      "RemainingTime": 2,
      "URL": "https://example.com/algebra-intro",
      "ThisWeek": true,
      "ChapterID": "CH001"
    },
    {
      "ModuleID": "MOD002",
      "estimated_completion_date": "2025-02-27",
      "ModuleName": "Basic Algebraic Operations",
      "RemainingTime": 3,
      "URL": "https://example.com/algebra-operations",
      "ThisWeek": true,
      "ChapterID": "CH001"
    },
    {
      "ModuleID": "MOD006",
      "estimated_completion_date": "2025-02-27",
      "ModuleName": "Understanding Linear Equations",
      "RemainingTime": 3,
      "URL": "https://example.com/linear-equations",
      "ThisWeek": true,
      "ChapterID": "CH002"
    },
    {
      "ModuleID": "MOD007",
      "estimated_completion_date": "2025-03-01",
      "ModuleName": "Graphing Linear Equations",
      "RemainingTime": 4,
      "URL": "https://example.com/graphing-linear",
      "ThisWeek": true,
      "ChapterID": "CH002"
    },
    {
      "ModuleID": "MOD010",
      "estimated_completion_date": "2025-02-28",
      "ModuleName": "Introduction to Civilizations",
      "RemainingTime": 3,
      "URL": "https://example.com/civilizations-intro",
      "ThisWeek": true,
      "ChapterID": "CH003"
    },
    {
      "ModuleID": "MOD011",
      "estimated_completion_date": "2025-03-05",
      "ModuleName": "Major Historical Events",
      "RemainingTime": 4,
      "URL": "https://example.com/history-events",
      "ThisWeek": true,
      "ChapterID": "CH004"
    },
    {
      "ModuleID": "MOD012",
      "estimated_completion_date": "2025-03-03",
      "ModuleName": "Introduction to Physics",
      "RemainingTime": 3,
      "URL": "https://example.com/physics-intro",
      "ThisWeek": true,
      "ChapterID": "CH005"
    },
    {
      "ModuleID": "MOD013",
      "estimated_completion_date": "2025-03-08",
      "ModuleName": "Basic Biological Systems",
      "RemainingTime": 4,
      "URL": "https://example.com/biology-basics",
      "ThisWeek": true,
      "ChapterID": "CH006"
    }
  ]
};

const SyllabusPlanning = ({ classroomId, TID }) => {
  const [editingModule, setEditingModule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempEditData, setTempEditData] = useState({
    ThisWeek: false,
    RemainingTime: 0
  });
  const [relevantData, setRelevantData] = useState({
    syllabus: null,
    chapters: [],
    modules: []
  });

  useEffect(() => {
    // Filter relevant data based on ClassroomID and TID
    const relevantSyllabus = syllabusData.Syllabus.find(
      s => s.ClassroomID === classroomId && s.TID === TID
    );

    if (relevantSyllabus) {
      const relevantChapters = syllabusData.Chapters.filter(
        ch => ch.SyllabusID === relevantSyllabus.SyllabusID
      );

      const relevantModules = syllabusData.Modules.filter(
        mod => relevantChapters.some(ch => ch.ChapterID === mod.ChapterID)
      );

      setRelevantData({
        syllabus: relevantSyllabus,
        chapters: relevantChapters,
        modules: relevantModules
      });
    }
  }, [classroomId, TID]);

  const handleModuleEdit = (module) => {
    setEditingModule(module);
    setTempEditData({
      ThisWeek: module.ThisWeek,
      RemainingTime: module.RemainingTime
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
  };

  const handleSubmitChanges = () => {
    const updatedModules = relevantData.modules.map(mod => 
      mod.ModuleID === editingModule.ModuleID
        ? { ...mod, ...tempEditData }
        : mod
    );

    setRelevantData({
      ...relevantData,
      modules: updatedModules
    });

    handleDialogClose();
  };

  return (
    <Box sx={{mt: 2, mb: 10}}>
      {relevantData.chapters.map(chapter => (
        <Accordion key={chapter.ChapterID}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Typography variant="h6">{chapter.ChapterName}</Typography>
              <Typography variant="caption">
                Target Date: {new Date(chapter.TargetDate).toLocaleDateString()}
              </Typography>
              <Typography variant="caption">
                Estimated Completion: {new Date(chapter.estimated_completion_date).toLocaleDateString()}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {relevantData.modules
              .filter(module => module.ChapterID === chapter.ChapterID)
              .map(module => (
                <Box 
                  key={module.ModuleID} 
                  sx={{ 
                    border: '1px solid #ddd', 
                    borderRadius: 1, 
                    p: 2, 
                    mb: 1 
                  }}
                >
                  <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>{module.ModuleName}</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'left' }}>
                    URL: <a href={module.URL} target="_blank" rel="noopener noreferrer">{module.URL}</a>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <RadioGroup 
                      row 
                      value={module.ThisWeek.toString()} 
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
                        Remaining Time: {module.RemainingTime} hours
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
            label="Remaining Time (days)"
            type="number"
            value={tempEditData.RemainingTime}
            onChange={(e) => setTempEditData({
              ...tempEditData,
              RemainingTime: parseInt(e.target.value, 10)
            })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmitChanges} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SyllabusPlanning;