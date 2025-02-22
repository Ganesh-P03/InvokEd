// This is PerformanceTracker.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Link
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
  const [selectedExam, setSelectedExam] = useState(null);
  const navigate = useNavigate();

  const handleStudentClick = (studentId) => {
    navigate(`/student/${studentId}`);
  };
  
  const examsMarksData = {
    "examsMarksData": [{"ExamID":"EX001","ExamName":"Unit Test 1","DateOfExam":"2025-02-26","Chapters":["Algebra Basics","Linear Equations"],"SyllabusID":"7A_Mathematics","AverageMarks":63.9,"HighestMarks":79,"LowestMarks":44,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":78},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":67},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":56},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":79},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":44},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":68},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":62},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":49},{"StudentID":"S009","StudentName":"Rohan Das","Marks":72},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":64}]},{"ExamID":"EX002","ExamName":"Mid-Term Examination","DateOfExam":"2025-03-05","Chapters":["Linear Equations","Quadratic Equations"],"SyllabusID":"7A_Mathematics","AverageMarks":76.1,"HighestMarks":88,"LowestMarks":59,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":85},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":72},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":78},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":85},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":59},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":74},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":79},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":71},{"StudentID":"S009","StudentName":"Rohan Das","Marks":88},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":70}]},{"ExamID":"EX003","ExamName":"Weekly Assessment","DateOfExam":"2025-03-12","Chapters":["Quadratic Equations"],"SyllabusID":"7A_Mathematics","AverageMarks":62.6,"HighestMarks":82,"LowestMarks":45,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":62},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":45},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":64},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":47},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":70},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":59},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":55},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":63},{"StudentID":"S009","StudentName":"Rohan Das","Marks":79},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":82}]},{"ExamID":"EX004","ExamName":"Monthly Test","DateOfExam":"2025-03-20","Chapters":["Algebra Basics","Probability"],"SyllabusID":"7A_Mathematics","AverageMarks":86.8,"HighestMarks":92,"LowestMarks":80,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":90},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":80},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":89},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":92},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":82},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":81},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":88},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":85},{"StudentID":"S009","StudentName":"Rohan Das","Marks":91},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":90}]},{"ExamID":"EX005","ExamName":"Quarterly Examination","DateOfExam":"2025-04-10","Chapters":["Linear Equations","Quadratic Equations","Geometry"],"SyllabusID":"7A_Mathematics","AverageMarks":77.1,"HighestMarks":91,"LowestMarks":60,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":73},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":91},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":72},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":66},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":90},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":90},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":73},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":77},{"StudentID":"S009","StudentName":"Rohan Das","Marks":60},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":79}]},{"ExamID":"EX006","ExamName":"Revision Test 1","DateOfExam":"2025-04-25","Chapters":["Algebra Basics","Quadratic Equations","Probability"],"SyllabusID":"7A_Mathematics","AverageMarks":78.4,"HighestMarks":93,"LowestMarks":48,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":88},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":54},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":91},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":83},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":48},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":77},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":80},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":93},{"StudentID":"S009","StudentName":"Rohan Das","Marks":83},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":87}]},{"ExamID":"EX007","ExamName":"Pre-Final Examination","DateOfExam":"2025-05-15","Chapters":["Linear Equations","Probability","Geometry"],"SyllabusID":"7A_Mathematics","AverageMarks":65.9,"HighestMarks":85,"LowestMarks":53,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":59},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":77},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":53},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":57},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":63},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":85},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":67},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":58},{"StudentID":"S009","StudentName":"Rohan Das","Marks":75},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":65}]},{"ExamID":"EX008","ExamName":"Final Examination","DateOfExam":"2025-06-05","Chapters":["Algebra Basics","Linear Equations","Quadratic Equations","Probability","Geometry"],"SyllabusID":"7A_Mathematics","AverageMarks":88.7,"HighestMarks":95,"LowestMarks":75,"AllMarks":[{"StudentID":"S001","StudentName":"Amit Verma","Marks":95},{"StudentID":"S002","StudentName":"Priya Sharma","Marks":88},{"StudentID":"S003","StudentName":"Rahul Gupta","Marks":88},{"StudentID":"S004","StudentName":"Sneha Yadav","Marks":91},{"StudentID":"S005","StudentName":"Vikas Singh","Marks":75},{"StudentID":"S006","StudentName":"Neha Mishra","Marks":92},{"StudentID":"S007","StudentName":"Aditya Pandey","Marks":91},{"StudentID":"S008","StudentName":"Kiran Rajput","Marks":86},{"StudentID":"S009","StudentName":"Rohan Das","Marks":89},{"StudentID":"S010","StudentName":"Pallavi Nair","Marks":92}]}]
  };

  // Process data for the line chart
  const lineChartData = examsMarksData.examsMarksData.map(exam => ({
    ExamName: exam.ExamName,
    Highest: exam.HighestMarks,
    Average: exam.AverageMarks,
    Lowest: exam.LowestMarks
  }));

  // Process data for the scatter plot
  const scatterData = examsMarksData.examsMarksData.flatMap(exam => 
    exam.AllMarks.map(student => ({
      ExamName: exam.ExamName,
      StudentName: student.StudentName,
      Marks: student.Marks
    }))
  );

  const handleExamClick = (examName) => {
    const exam = examsMarksData.examsMarksData.find(e => e.ExamName === examName);
    setSelectedExam(exam);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body2">{`Exam: ${label}`}</Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="body2">{`Student: ${payload[0].payload.StudentName}`}</Typography>
          <Typography variant="body2">{`Marks: ${payload[0].value}`}</Typography>
          <Typography variant="body2">{`Exam: ${payload[0].payload.ExamName}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={1} sx={{ maxWidth: '900px', mx: '-100px', p: 4, mb:"105px" }}>
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
                    <Typography>{selectedExam.ExamName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Date of Exam:
                    </Typography>
                    <Typography>{selectedExam.DateOfExam}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Chapters:
                    </Typography>
                    <Typography>{selectedExam.Chapters.join(", ")}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Performance Summary:
                    </Typography>
                    <Typography>Average: {selectedExam.AverageMarks}</Typography>
                    <Typography>Highest: {selectedExam.HighestMarks}</Typography>
                    <Typography>Lowest: {selectedExam.LowestMarks}</Typography>
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
                      {selectedExam.AllMarks.map((student) => (
                        <TableRow 
                          key={student.StudentID}
                          sx={{
                            bgcolor: student.Marks < selectedExam.AverageMarks ? '#ffebee' : 'inherit',
                            '&:hover': {
                              bgcolor: student.Marks < selectedExam.AverageMarks ? '#ffcdd2' : '#f5f5f5'
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
                              {student.StudentID}
                            </Link>
                          </TableCell>
                          <TableCell>{student.StudentName}</TableCell>
                          <TableCell align="right">{student.Marks}</TableCell>
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
        <Box sx={{ height: 400, mb:"150px" }}>
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