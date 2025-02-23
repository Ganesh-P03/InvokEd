import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { attendanceService, performanceService, studentService } from '../services/api';
import { 
  TextField, 
  Button, 
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
  Alert,
  CircularProgress
} from '@mui/material';

const Student = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using axios instance from api.js
      const response = await studentService.getStudent(studentId);
      setStudentData(response);
      console.log(response);
      
      // Initial fetch of attendance and performance data
      if (response.ClassroomID) {
        await Promise.all([
          fetchAttendanceData(response.ClassroomID),
          fetchPerformanceData(response.ClassroomID)
        ]);
      }
    } catch (err) {
      setError('Failed to fetch student data. Please try again later.');
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async (classroomId) => {
    try {
      const response = await attendanceService.getAttendance(
        classroomId,
        startDate || null,
        endDate || null
      );
      
      // Filter attendance data for the specific student
      const studentAttendance = Array.isArray(response) 
        ? response.filter(record => record.StudentID === studentId)
        : [];
      setAttendanceData(studentAttendance);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to fetch attendance data');
    }
  };

  const fetchPerformanceData = async (classroomId) => {
    try {
      const response = await performanceService.getExams(
        `${classroomId}_${'Mathematics' || ''}`
      );
      
      // Process exam data to get student's marks and class average
      const processedData = Array.isArray(response) 
        ? response.map(exam => ({
            ExamName: exam.ExamName,
            StudentMarks: exam.AllMarks?.find(
              student => student.StudentID === studentId
            )?.Marks || 0,
            ClassAverage: exam.AverageMarks || 0
          }))
        : [];
      
      setPerformanceData(processedData);
    } catch (err) {
      console.error('Error fetching performance:', err);
      setError('Failed to fetch performance data');
    }
  };

  const handleDateSubmit = () => {
    if (studentData?.ClassroomID) {
      fetchAttendanceData(studentData.ClassroomID);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              {`${entry.name}: ${Number(entry.value).toFixed(1)}`}
            </Typography>
          ))}
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


  return (
    <Paper elevation={1} sx={{ 
        minWidth: '900px', 
        position: 'relative',
        left: '-188px',
        p: 4, 
        mb: "105px", 
        mt: "50px" 
      }}>
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Student Profile
      </Typography>

      {/* Student Details Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom >
            Personal Information
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '25%' }}>
                    Student ID
                  </TableCell>
                  <TableCell sx={{ width: '25%' }}>{studentData?.StudentID}</TableCell>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '25%' }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ width: '25%' }}>{studentData?.Name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Date of Joining
                  </TableCell>
                  <TableCell>{formatDate(studentData?.DateofJoining)}</TableCell>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Classroom
                  </TableCell>
                  <TableCell>{studentData?.ClassroomID}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Guardian Name
                  </TableCell>
                  <TableCell>{studentData?.GuardianName}</TableCell>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Relation
                  </TableCell>
                  <TableCell>{studentData?.GuardianRelation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Guardian Phone
                  </TableCell>
                  <TableCell>{studentData?.GuardianPhone}</TableCell>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Email
                  </TableCell>
                  <TableCell>{studentData?.Email}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Attendance Section */}
      <Box sx={{ mb: 6, mt: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6">
            Attendance Record
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button 
              variant="contained" 
              onClick={handleDateSubmit}
              sx={{ height: 40 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record.Date}>
                  <TableCell>{formatDate(record.Date)}</TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: record.Status === 1 ? 'success.main' : 'error.main',
                        fontWeight: 'medium'
                      }}
                    >
                      {record.Status === 1 ? 'Present' : 'Absent'}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Performance Graph */}
      <Box sx={{mt: 10}}>
        <Typography variant="h6" gutterBottom>
          Performance Analysis
        </Typography>
        <Box sx={{ height: 400, mb: "150px" }}>
          <ResponsiveContainer width="100%" height="130%">
            <LineChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                dataKey="StudentMarks"
                stroke="#1976d2"
                strokeWidth={2}
                name="Student's Marks"
              />
              <Line
                type="monotone"
                dataKey="ClassAverage"
                stroke="#000000"
                strokeWidth={2}
                name="Class Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default Student;