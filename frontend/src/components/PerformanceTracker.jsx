// This is PerformanceTracker.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { performanceService } from '../services/api';
import { 
  Paper, 
  Typography, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Collapse,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

const PerformanceTracker = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedExam, setSelectedExam] = useState(null);
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [TID, setTID] = useState("");
  const [Type, setType] = useState("");
  const [SubjectID, setSubjectID] = useState("");
  const [currentTab, setCurrentTab] = useState(0);

  const id_subjectID = `${id}_${SubjectID}`;

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

  useEffect(() => {
    if (id && SubjectID) {
      fetchExamsData();
    }
  }, [id, SubjectID]);

  const fetchExamsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await performanceService.getExams(id_subjectID);
      setExamsData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch exam data. Please try again later.');
      console.error('Error fetching exams:', err);
      setExamsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  // Process data for the line chart - with safety checks
  const lineChartData = examsData.map(exam => ({
    ExamName: exam.ExamName || '',
    Highest: Number(exam.HighestMarks) || 0,
    Average: Number(exam.AverageMarks) || 0,
    Lowest: Number(exam.LowestMarks) || 0
  }));

  // Process data for the scatter plot - with safety checks
  const scatterData = examsData.flatMap(exam => 
    (exam.AllMarks || []).map(student => ({
      ExamName: exam.ExamName || '',
      StudentName: student.StudentName || '',
      Marks: Number(student.Marks) || 0
    }))
  );

  const handleExamClick = (examName) => {
    if (!examName) return;
    const exam = examsData.find(e => e.ExamName === examName);
    setSelectedExam(exam || null);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body2">{`Exam: ${label || ''}`}</Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {`${entry.name || ''}: ${Number(entry.value).toFixed(1)}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const data = payload[0]?.payload;
      return (
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body2">{`Student: ${data?.StudentName || ''}`}</Typography>
          <Typography variant="body2">{`Marks: ${Number(payload[0]?.value || 0).toFixed(1)}`}</Typography>
          <Typography variant="body2">{`Exam: ${data?.ExamName || ''}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!examsData.length) {
    return (
      <Alert severity="info">
        No exam data available for this subject.
      </Alert>
    );
  }

  return (
    <Paper elevation={1} sx={{ maxWidth: '900px', mx: '-100px', p: 4, mb: "105px" }}>
      <Typography variant="h4" gutterBottom>
        Performance Analytics
      </Typography>

      {/* Exam Details Card */}
      <Collapse in={selectedExam !== null}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Exam Details
            </Typography>
            {selectedExam && (
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Exam Name:
                    </Typography>
                    <Typography>{selectedExam.ExamName || ''}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Date of Exam:
                    </Typography>
                    <Typography>{selectedExam.DateOfExam || ''}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Chapters:
                    </Typography>
                    <Typography>{(selectedExam.Chapters || []).join(", ")}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Performance Summary:
                    </Typography>
                    <Typography>Average: {Number(selectedExam.AverageMarks || 0).toFixed(1)}</Typography>
                    <Typography>Highest: {Number(selectedExam.HighestMarks || 0).toFixed(1)}</Typography>
                    <Typography>Lowest: {Number(selectedExam.LowestMarks || 0).toFixed(1)}</Typography>
                  </Box>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell align="right">Marks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(selectedExam.AllMarks || []).map((student) => (
                        <TableRow 
                          key={student.StudentID}
                          sx={{
                            bgcolor: Number(student.Marks) < Number(selectedExam.AverageMarks) ? '#ffebee' : 'inherit',
                            '&:hover': {
                              bgcolor: Number(student.Marks) < Number(selectedExam.AverageMarks) ? '#ffcdd2' : '#f5f5f5'
                            }
                          }}
                        >
                          <TableCell>
                            <Link
                              component="button"
                              variant="body2"
                              onClick={() => handleStudentClick(student.StudentID)}
                              sx={{
                                cursor: 'pointer',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              {student.StudentID || ''}
                            </Link>
                          </TableCell>
                          <TableCell>{student.StudentName || ''}</TableCell>
                          <TableCell align="right">{Number(student.Marks || 0).toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Collapse>

      {/* Line Chart */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Exam Performance Trends
        </Typography>
        <Box sx={{ height: 400, mb: "150px" }}>
          <ResponsiveContainer width="100%" height="130%">
            <LineChart
              data={lineChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              onClick={(data) => data && handleExamClick(data.activeLabel)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="ExamName" 
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 40 }} />
              <Line 
                type="monotone" 
                dataKey="Highest" 
                stroke="#2e7d32" 
                strokeWidth={2}
                name="Highest Marks"
              />
              <Line 
                type="monotone" 
                dataKey="Average" 
                stroke="#1976d2" 
                strokeWidth={2}
                name="Average Marks"
              />
              <Line 
                type="monotone" 
                dataKey="Lowest" 
                stroke="#d32f2f" 
                strokeWidth={2}
                name="Lowest Marks"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Scatter Plot */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Individual Student Performance
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              onClick={(data) => data && handleExamClick(data.activeLabel)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="ExamName" 
                name="Exam"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
                allowDuplicatedCategory={false}
              />
              <YAxis 
                dataKey="Marks" 
                name="Marks" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <ZAxis dataKey="StudentName" />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter 
                data={scatterData} 
                fill="#8884d8"
                name="Students"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default PerformanceTracker;