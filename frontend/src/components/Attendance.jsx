// This is Attendance.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { attendanceService } from '../services/api';
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
  Link,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Warning, Send } from '@mui/icons-material';

const Attendance = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get classroomId from URL
  console.log("ClassID: "+id);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [graphData, setGraphData] = useState([]);
  const [studentStats, setStudentStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getAttendance(
        id,
        startDate || null,
        endDate || null
      );
      setAttendanceData(response);
      processAttendanceData(response);
    } catch (err) {
      setError('Failed to fetch attendance data. Please try again later.');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const handleSendAlert = async (studentId, studentName) => {
    try {
      // Implement your alert sending logic here using an API call
      console.log(`Sending alert to ${studentName} (${studentId})`);
      // You might want to add an API endpoint for sending alerts
    } catch (err) {
      console.error('Error sending alert:', err);
    }
  };

  const processAttendanceData = (data) => {
    // Process data for graph
    const attendanceByDate = {};

    // Group attendance by date
    data.forEach((record) => {
      const date = record.Date;
      if (!attendanceByDate[date]) {
        attendanceByDate[date] = {
          date,
          presentCount: 0,
          totalStudents: 0,
          presentPercentage: 0,
        };
      }
      attendanceByDate[date].totalStudents++;
      if (record.Status === 1) {
        attendanceByDate[date].presentCount++;
      }
    });

    // Calculate percentages
    Object.values(attendanceByDate).forEach((dayData) => {
      dayData.presentPercentage = (dayData.presentCount / dayData.totalStudents) * 100;
    });

    // Sort by date
    const graphDataArray = Object.values(attendanceByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setGraphData(graphDataArray);

    // Process student statistics
    const studentAttendance = {};
    const uniqueDates = new Set(data.map(record => record.Date));
    const totalDays = uniqueDates.size;

    data.forEach((record) => {
      if (!studentAttendance[record.StudentID]) {
        studentAttendance[record.StudentID] = {
          studentId: record.StudentID,
          studentName: record.StudentID, // You might want to add student names to the API response
          daysPresent: 0,
          totalDays,
        };
      }
      if (record.Status === 1) {
        studentAttendance[record.StudentID].daysPresent++;
      }
    });

    const studentStatsArray = Object.values(studentAttendance);
    setStudentStats(studentStatsArray);
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [id]); // Fetch when classroomId changes

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const CustomLabel = (props) => {
    const { x, y, value } = props;
    return (
      <text x={x} y={y - 10} fill="#374151" fontSize={12} textAnchor="middle">
        {`${Math.round(value)} present`}
      </text>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ maxWidth: '900px', mx: '-100px', p: 4, mb: "105px" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Attendance Report
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
            onClick={fetchAttendanceData}
            sx={{ height: 40 }}
          >
            Submit
          </Button>
        </Box>
      </Box>

      {graphData.length > 0 ? (
        <Box sx={{ height: 400, mb: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="presentPercentage" 
                stroke="#2563eb" 
                strokeWidth={2}
              >
                <LabelList 
                  content={<CustomLabel />}
                  dataKey="presentCount"
                  position="top"
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No attendance data available for the selected date range
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ mt: 4 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          Student Attendance Summary
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell align="center">Days Present</TableCell>
              <TableCell align="center">Total Days</TableCell>
              <TableCell align="center">Attendance %</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentStats.map((student) => {
              const attendancePercentage = (student.daysPresent / student.totalDays) * 100;
              const isLowAttendance = attendancePercentage < 70;

              return (
                <TableRow 
                  key={student.studentId}
                  sx={{
                    backgroundColor: isLowAttendance ? '#fff4f4' : 'inherit',
                  }}
                >
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleStudentClick(student.studentId)}
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {student.studentId}
                    </Link>
                  </TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell align="center">{student.daysPresent}</TableCell>
                  <TableCell align="center">{student.totalDays}</TableCell>
                  <TableCell align="center">
                    <Box 
                      component="span" 
                      sx={{ 
                        color: isLowAttendance ? 'error.main' : 'inherit',
                        fontWeight: isLowAttendance ? 'bold' : 'regular'
                      }}
                    >
                      {attendancePercentage.toFixed(1)}%
                    </Box>
                  </TableCell>
                  <TableCell>
                    {isLowAttendance && (
                      <Chip
                        icon={<Warning />}
                        label="Low Attendance"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isLowAttendance && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<Send />}
                        onClick={() => handleSendAlert(student.studentId, student.studentName)}
                        sx={{
                          textTransform: 'none',
                          minWidth: '120px'
                        }}
                      >
                        Send Alert
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Attendance;