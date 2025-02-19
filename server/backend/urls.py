"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from apigateway.views import subject_list, subject_detail,teacher_list,teacher_detail,\
                             logininfo_list,logininfo_detail,\
                             classroom_list,classroom_detail,student_list,\
                             student_detail,attendance_list,attendance_detail,\
                             timetable_detail,timetable_list,syllabus_detail,syllabus_list, \
                             chapter_list,chapter_detail,module_list,module_detail, \
                             exam_list,exam_detail,marks_list,marks_detail

urlpatterns = [
    path('admin/', admin.site.urls),

    # LoginInfo URLs
    path('logininfos/', logininfo_list, name='login-list-create'),  # GET, POST
    path('logininfos/<str:TID>/', logininfo_detail, name='login-detail'),  # GET, PUT, DELETE

    # Teacher URLs
    path('teachers/', teacher_list, name='teacher-list-create'),  # GET, POST
    path('teachers/<str:TID>/', teacher_detail, name='teacher-detail'),  # GET, PUT, DELETE

    # Student URLs
    path('students/', student_list, name='student-list'),  # List & Create Students
    path('students/<str:StudentID>/', student_detail, name='student-detail'),  # Retrieve, Update, Delete Student

    # Classrrom URLs
    path('classrooms/', classroom_list, name='classroom-list'),  # List & Create Classrooms
    path('classrooms/<str:ClassroomID>/', classroom_detail, name='classroom-detail'),  # Retrieve, Update, Delete Classroom

    # Attendance URLs
    path('attendance/', attendance_list, name='attendance-list'),  # List & Create Attendance (bulk support)
    path('attendance/<int:AttendanceID>/', attendance_detail, name='attendance-detail'),  # Retrieve, Update, Delete

    # Subject URLs
    path('subjects/', subject_list, name='subject-list'),
    path('subjects/<str:SubjectID>', subject_detail, name='subject-detail'),

    # TimeTable URLs
    path('timetable/', timetable_list, name='timetable-list'),  # List & Create
    path('timetable/<int:TimeTableID>/', timetable_detail, name='timetable-detail'),  # Retrieve, Update, Delete

    #Syllabus URLs
    path('syllabus/', syllabus_list, name='syllabus-list'),
    path('syllabus/<str:SyllabusID>/', syllabus_detail, name='syllabus-detail'),

    #Chapter URLs
    path('chapters/', chapter_list, name='chapter-list'),
    path('chapters/<str:ChapterID>/', chapter_detail, name='chapter-detail'),

    #Module URLs
    path('modules/', module_list, name='module-list'),
    path('modules/<str:ModuleID>/', module_detail, name='module-detail'),

    #Exam URLs
    path('exams/', exam_list, name='exam-list'),
    path('exams/<str:ExamID>/', exam_detail, name='exam-detail'),

    #Marks URLs
    path('marks/', marks_list, name='marks_list'),  # To list marks with optional filters
    path('marks/<str:MarksID>/', marks_detail, name='marks_detail'),  # To view/update/delete a specific marks entry
]
