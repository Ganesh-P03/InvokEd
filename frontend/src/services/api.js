// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Auth services
export const authService = {
  login: async (teacherId) => {
    const response = await api.get(`/teachers/${teacherId}`);
    return response.data;
  }
};

// Teacher services
export const teacherService = {
  getSyllabus: async (teacherId) => {
    const response = await api.get(`/syllabus/`, {
      params: { TeacherID: teacherId }
    });
    return response.data;
  }
};

// Classroom services
export const classroomService = {
  getAllClassrooms: async () => {
    // Endpoint needs to be confirmed
    const response = await api.get('/classrooms/');
    return response.data;
  },
  
  getTeacherClassrooms: async (teacherId) => {
    // Endpoint needs to be confirmed
    const response = await api.get(`/classrooms/`, {
      params: { TeacherID: teacherId }
    });
    return response.data;
  }
};

// Syllabus services
export const syllabusService = {
  getChapters: async (syllabusId) => {
    const response = await api.get(`/chapters/`, {
      params: { SyllabusID: syllabusId }
    });
    return response.data;
  },

  getModules: async (chapterId) => {
    const response = await api.get(`/modules/`, {
      params: { ChapterID: chapterId }
    });
    return response.data;
  },

  putModules: async (moduleId, data) => {
    const response = await api.put(`/modules/${moduleId}/`, {
      ModuleID: moduleId,  // Ensure the field name matches the API response
      ...data,             // Spread other data fields correctly
    });
  },  
};

// Attendance services
export const attendanceService = {
  getAttendance: async (classroomId, startDate, endDate) => {
    const response = await api.get(`/attendance/`, {
      params: {
        ClassroomID: classroomId,
        StartDate: startDate,
        EndDate: endDate
      }
    });
    return response.data;
  }
};

// Performance services
export const performanceService = {
  getExams: async (syllabusId) => {
    const response = await api.get(`/exams/`, {
      params: { SyllabusID: syllabusId }
    });
    return response.data;
  }
};

// Student services
export const studentService = {
  getStudent: async (studentId) => {
    const response = await api.get(`/students/${studentId}/`);
    return response.data;
  }
};

// alert attendance service
export const alertAttendanceService = {
  sendAttendanceAlert: async (studentId) => {
    const response = await api.post("/alert-attendance/", { "StudentID": studentId });
    return response.data;
  }
};

// alert syllabus service
export const alertSyllabusService = {
  sendSyllabusAlert: async (syllabusId) => {
    const response = await api.post("/alert-syllabus/", { "SyllabusID": syllabusId });
    return response.data;
  }
};

export default api;