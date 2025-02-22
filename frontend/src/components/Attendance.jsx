import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
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
  Chip
} from '@mui/material';
import { Warning, Send } from '@mui/icons-material';

const attendanceData = {
  attendance: [
    { AttendanceID: 1, Date: '2025-02-13', Status: 1, StudentID: 'S001', StudentName: 'John' },
    { AttendanceID: 2, Date: '2025-02-13', Status: 1, StudentID: 'S002', StudentName: 'Alice' },
    { AttendanceID: 3, Date: '2025-02-13', Status: 0, StudentID: 'S003', StudentName: 'Bob' },
    { AttendanceID: 4, Date: '2025-02-14', Status: 1, StudentID: 'S001', StudentName: 'John' },
    { AttendanceID: 21, Date: '2025-02-14', Status: 1, StudentID: 'S004', StudentName: 'Ram' },
    { AttendanceID: 5, Date: '2025-02-14', Status: 1, StudentID: 'S002', StudentName: 'Alice' },
    { AttendanceID: 6, Date: '2025-02-14', Status: 1, StudentID: 'S003', StudentName: 'Bob' },
    { AttendanceID: 7, Date: '2025-02-15', Status: 0, StudentID: 'S001', StudentName: 'John' },
    { AttendanceID: 8, Date: '2025-02-15', Status: 1, StudentID: 'S002', StudentName: 'Alice' },
    { AttendanceID: 9, Date: '2025-02-15', Status: 1, StudentID: 'S003', StudentName: 'Bob' },
    { AttendanceID: 10, Date: '2025-02-16', Status: 1, StudentID: 'S001', StudentName: 'John' },
    { AttendanceID: 11, Date: '2025-02-16', Status: 1, StudentID: 'S002', StudentName: 'Alice' },
    { AttendanceID: 12, Date: '2025-02-16', Status: 1, StudentID: 'S003', StudentName: 'Bob' },
    { AttendanceID: 13, Date: '2025-02-17', Status: 1, StudentID: 'S001', StudentName: 'John' },
    { AttendanceID: 14, Date: '2025-02-17', Status: 0, StudentID: 'S002', StudentName: 'Alice' },
    { AttendanceID: 15, Date: '2025-02-17', Status: 1, StudentID: 'S003', StudentName: 'Bob' },
    { AttendanceID: 16, Date: '2025-02-18', Status: 1, StudentID: 'S001', StudentName: 'John' },
    { AttendanceID: 17, Date: '2025-02-18', Status: 1, StudentID: 'S002', StudentName: 'Alice' },
    { AttendanceID: 18, Date: '2025-02-18', Status: 0, StudentID: 'S003', StudentName: 'Bob' },
    { AttendanceID: 19, Date: '2025-02-19', Status: 1, StudentID: 'S001', StudentName: 'John' },
    { AttendanceID: 20, Date: '2025-02-19', Status: 1, StudentID: 'S002', StudentName: 'Alice' },
  ],
};


const Attendance = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [graphData, setGraphData] = useState([]);
    const [studentStats, setStudentStats] = useState([]);

  const handleStudentClick = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const handleSendAlert = (studentId, studentName) => {
    // Here you can implement the alert sending logic
    console.log(`Sending alert to ${studentName} (${studentId})`);
  };

  const processAttendanceData = () => {
    // Process data for graph
    const attendanceByDate = {};
    let filteredAttendance = [...attendanceData.attendance];

    // Filter attendance records by date range
    if (startDate.trim() !== '') {
      filteredAttendance = filteredAttendance.filter(
        (record) => new Date(record.Date) >= new Date(startDate)
      );
    }
    if (endDate.trim() !== '') {
      filteredAttendance = filteredAttendance.filter(
        (record) => new Date(record.Date) <= new Date(endDate)
      );
    }

    // Process data for graph
    filteredAttendance.forEach((record) => {
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

    Object.values(attendanceByDate).forEach((dayData) => {
      dayData.presentPercentage = (dayData.presentCount / dayData.totalStudents) * 100;
    });

    const graphDataArray = Object.values(attendanceByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setGraphData(graphDataArray);

    // Process data for student statistics table
    const studentAttendance = {};
    const uniqueDates = new Set(filteredAttendance.map(record => record.Date));
    const totalDays = uniqueDates.size;

    filteredAttendance.forEach((record) => {
      if (!studentAttendance[record.StudentID]) {
        studentAttendance[record.StudentID] = {
          studentId: record.StudentID,
          studentName: record.StudentName,
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
    processAttendanceData();
  }, []);

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

  return (
    <Paper elevation={1} sx={{ maxWidth: '900px', mx: '-100px', p: 4, mb:"105px" }}>
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
            onClick={processAttendanceData}
            sx={{ height: 40 }}
          >
            Submit
          </Button>
        </Box>
      </Box>

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