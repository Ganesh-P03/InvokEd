from django.db.models import Count
from .models import  LoginInfo,Subject,Teacher,Classroom,Student,Attendance,TimeTable,Syllabus,Chapter,Module,Exam,Marks
from .serializers import  LoginInfoSerializer,SubjectSerializer,TeacherSerializer,ClassroomSerializer, \
                          StudentSerializer,AttendanceSerializer,TimeTableSerializer,SyllabusSerializer, \
                          ChapterSerializer,ModuleSerializer,ExamSerializer,MarksSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import date, timedelta
from apigateway.syllabus_planning import get_module_completion_map, get_chapter_completion_map

# views for LoginInfo
# 📌 URL: /logininfos/
@api_view(['GET', 'POST'])
def logininfo_list(request):
    """
    GET  /logininfos/  -> List all login records  
    POST /logininfos/  -> Create a new login record  
    """
    if request.method == 'GET':
        logininfos = LoginInfo.objects.all()
        serializer = LoginInfoSerializer(logininfos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        TeacherID = data.get('TeacherID')

        if not TeacherID:
            return Response({'error': 'TeacherID is required'}, status=status.HTTP_400_BAD_REQUEST)

        teacher, created = Teacher.objects.get_or_create(
            TeacherID=TeacherID,
            defaults={
                "Name": data.get("Name", "Unknown"),
                "DateofJoining": data.get("DateofJoining", None),
                "Phone": data.get("Phone", None),
                "SubjectID_id": data.get("SubjectID", None),
            }
        )
        serializer = LoginInfoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# 📌 URL: /logininfos/<TeacherID>/
@api_view(['GET', 'PUT', 'DELETE'])
def logininfo_detail(request, TeacherID):
    """
    GET    /logins/<TeacherID>/  -> Retrieve login info by TeacherID  
    PUT    /logins/<TeacherID>/  -> Update login details  
    DELETE /logins/<TeacherID>/  -> Remove login record  
    """
    try:
        login = LoginInfo.objects.get(TeacherID=TeacherID)
    except LoginInfo.DoesNotExist:
        return Response({'error': 'Login not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = LoginInfoSerializer(login)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = LoginInfoSerializer(login, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        login.delete()
        return Response({'message': 'Login record deleted'}, status=status.HTTP_204_NO_CONTENT)

# views for Teacher
# 📌 URL: /teachers/
@api_view(['GET', 'POST'])
def teacher_list(request):
    """
    GET  /teachers/  -> List all teachers  
    POST /teachers/  -> Create a new teacher/teachers  
    """
    if request.method == 'GET':
        teachers = Teacher.objects.all()
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data, list):
            serializer = TeacherSerializer(data=request.data, many=True)
        else:
            serializer = TeacherSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 📌 URL: /teachers/<TeacherID>/
@api_view(['GET', 'PUT', 'DELETE'])
def teacher_detail(request, TeacherID):
    """
    GET    /teachers/<TeacherID>/  -> Retrieve a teacher by TeacherID  
    PUT    /teachers/<TeacherID>/  -> Update teacher details  
    DELETE /teachers/<TeacherID>/  -> Remove a teacher  
    """
    try:
        teacher = Teacher.objects.get(TeacherID=TeacherID)
    except Teacher.DoesNotExist:
        return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TeacherSerializer(teacher, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        teacher.delete()
        return Response({'message': 'Teacher deleted'}, status=status.HTTP_204_NO_CONTENT)
    
# # 📌 URL: /students/
@api_view(['GET', 'POST'])
def student_list(request):
    """
    GET  /students/  -> List all students
    POST /students/  -> Create one or multiple students
    """
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data, list):  # Bulk student creation
            serializer = StudentSerializer(data=request.data, many=True)
        else:  # Single student creation
            serializer = StudentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # views for Student
# 📌 URL: /students/<StudentId>/
@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request, StudentID):
    """
    GET    /students/<StudentID>/  -> Retrieve student details
    PUT    /students/<StudentID>/  -> Update student details
    DELETE /students/<StudentID>/  -> Delete a student
    """
    try:
        student = Student.objects.get(StudentID=StudentID)
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        student.delete()
        return Response({"message": "Student deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# # views for Classroom
# 📌 URL: /classrooms/
@api_view(['GET', 'POST'])
def classroom_list(request):
    """
    GET  /classrooms/  -> List all classrooms
    POST /classrooms/  -> Create one or multiple classrooms
    """
    if request.method == 'GET':
        classrooms = Classroom.objects.all()
        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data, list):  # Bulk creation support
            serializer = ClassroomSerializer(data=request.data, many=True)
        else:
            serializer = ClassroomSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 📌 URL: /classrooms/<ClassroomID>/
@api_view(['GET', 'PUT', 'DELETE'])
def classroom_detail(request, ClassroomID):
    """
    GET    /classrooms/<ClassroomID>/  -> Retrieve classroom details
    PUT    /classrooms/<ClassroomID>/  -> Update classroom details
    DELETE /classrooms/<ClassroomID>/  -> Delete a classroom
    """
    try:
        classroom = Classroom.objects.get(ClassroomID=ClassroomID)
    except Classroom.DoesNotExist:
        return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ClassroomSerializer(classroom)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ClassroomSerializer(classroom, data=request.data, partial=True)  # Partial update allowed
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        classroom.delete()
        return Response({"message": "Classroom deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# views for Subject
# url/subject
@api_view(['GET', 'POST'])
def subject_list(request):
    """
    GET  /subjects/  -> List all subjects
    POST /subjects/  -> Create a new subject/subjects
    """
    if request.method == 'GET':
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data, list):
            serializer = SubjectSerializer(data=request.data, many=True)
        else:
            serializer = SubjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def subject_detail(request, SubjectID):
    """
    GET    /subjects/<id>/  -> Retrieve a specific subject
    PUT    /subjects/<id>/  -> Update a subject
    DELETE /subjects/<id>/  -> Delete a subject
    """
    try:
        subject = Subject.objects.get(SubjectID=SubjectID)
    except Subject.DoesNotExist:
        return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        subject.delete()
        return Response({'message': 'Subject deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

# views for Attendance
# 📌 URL: /attendance/
@api_view(['GET', 'POST'])
def attendance_list(request):
    """
    GET  /attendance/?StudentId=1&StartDate=2025-02-01&EndDate=2025-02-15  -> Get all attendance data (with optional filters)
    GET  /attendance/?ClassroomID=10&StartDate=2025-02-01&EndDate=2025-02-15  -> Get attendance for a class
    POST /attendance/  -> Create one or multiple attendance records
    """
    if request.method == 'GET':
        student_id = request.GET.get('StudentId')
        classroom_id = request.GET.get('ClassroomID')
        start_date = request.GET.get('StartDate')
        end_date = request.GET.get('EndDate')

        attendance = Attendance.objects.all()

        if student_id:
            attendance = attendance.filter(StudentID=student_id)
        elif classroom_id:
            # Get all students in the given classroom
            student_ids = Student.objects.filter(ClassroomID=classroom_id).values_list('StudentID', flat=True)
            attendance = attendance.filter(StudentID__in=student_ids)

        if start_date and end_date:
            attendance = attendance.filter(Date__range=[start_date, end_date])
        elif start_date:
            attendance = attendance.filter(Date__gte=start_date)
        elif end_date:
            attendance = attendance.filter(Date__lte=end_date)

        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data, list):
            serializer = AttendanceSerializer(data=request.data, many=True)
        else:
            serializer = AttendanceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# 📌 URL: /attendance/<AttendanceID>/
@api_view(['GET', 'PUT', 'DELETE'])
def attendance_detail(request, AttendanceID):
    """
    GET    /attendance/<AttendanceID>/  -> Retrieve attendance record
    PUT    /attendance/<AttendanceID>/  -> Update attendance record
    DELETE /attendance/<AttendanceID>/  -> Delete attendance record
    """
    try:
        attendance = Attendance.objects.get(AttendanceID=AttendanceID)
    except Attendance.DoesNotExist:
        return Response({"error": "Attendance record not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AttendanceSerializer(attendance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        attendance.delete()
        return Response({"message": "Attendance record deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# views for TimeTable
# 📌 URL: /timetable/
@api_view(['GET', 'POST'])
def timetable_list(request):
    """
    GET  /timetable/?ClassroomID=<ClassroomID>&Day=<Day>&Slot<Slot> -> Get all timetable entries (with optional filters)
    POST /timetable/ -> Create one or multiple timetable entries
    """
    if request.method == 'GET':
        classroom_id = request.GET.get('ClassroomID')
        day = request.GET.get('Day')
        slot = request.GET.get('Slot')

        timetable = TimeTable.objects.all()

        if classroom_id:
            timetable = timetable.filter(ClassroomID=classroom_id)
        if day:
            timetable = timetable.filter(Day=day)
        if slot:
            timetable = timetable.filter(Slot=slot)

        serializer = TimeTableSerializer(timetable, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if isinstance(request.data, list):
            serializer = TimeTableSerializer(data=request.data, many=True)
        else:
            serializer = TimeTableSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 📌 URL: /timetable/<int:TimeTableID>/
@api_view(['GET', 'PUT', 'DELETE'])
def timetable_detail(request, TimeTableID):
    """
    GET    /timetable/<TimeTableID>/  -> Retrieve a specific timetable entry
    PUT    /timetable/<TimeTableID>/  -> Update a timetable entry
    DELETE /timetable/<TimeTableID>/  -> Delete a timetable entry
    """
    try:
        timetable = TimeTable.objects.get(TimeTableID=TimeTableID)
    except TimeTable.DoesNotExist:
        return Response({'error': 'TimeTable entry not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TimeTableSerializer(timetable)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TimeTableSerializer(timetable, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        timetable.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# views for Syllabus
# 📌 URL: /syllabus/
@api_view(['GET', 'POST'])
def syllabus_list(request):
    """
    GET  /syllabus/?ClassroomID=<ClassroomID>&SubjectID=<SubjectID>&TeacherID=<TeacherID>  
    POST /syllabus/  -> Create a new syllabus (single or bulk)
    """
    if request.method == 'GET':
        classroom_id = request.GET.get('ClassroomID')
        subject_id = request.GET.get('SubjectID')
        teacher_id = request.GET.get('TeacherID')

        filters = {}
        if classroom_id:
            filters['ClassroomID'] = classroom_id
        if subject_id:
            filters['SubjectID'] = subject_id
        if teacher_id:
            filters['TeacherID'] = teacher_id

        syllabus = Syllabus.objects.filter(**filters)
        serializer = SyllabusSerializer(syllabus, many=True)
        # 📌 Get student counts for each classroom
        classroom_counts = Student.objects.values('ClassroomID').annotate(count=Count('StudentID'))
        student_count_map = {entry['ClassroomID']: entry['count'] for entry in classroom_counts}

        # 📌 Add classroom strength to each syllabus entry
        response_data = []
        for entry in serializer.data:
            classroom_id = entry["ClassroomID"]
            entry["ClassroomStrength"] = student_count_map.get(classroom_id, 0)  # Default to 0 if no students
            response_data.append(entry)

        return Response(response_data)

    elif request.method == 'POST':
        if isinstance(request.data, list):  # 📌 Handle bulk syllabus creation
            serializer = SyllabusSerializer(data=request.data, many=True)
        else:  # 📌 Handle single syllabus creation
            serializer = SyllabusSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def syllabus_detail(request, SyllabusID):
    """
    GET    /syllabus/<SyllabusID>/  -> Retrieve a specific syllabus entry
    PUT    /syllabus/<SyllabusID>/  -> Update a specific syllabus entry
    DELETE /syllabus/<SyllabusID>/  -> Delete a specific syllabus entry
    """
    try:
        syllabus = Syllabus.objects.get(SyllabusID=SyllabusID)
    except Syllabus.DoesNotExist:
        return Response({'error': 'Syllabus entry not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SyllabusSerializer(syllabus)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SyllabusSerializer(syllabus, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        syllabus.delete()
        return Response({'message': 'Syllabus entry deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

# views for Chapter
# 📌 URL: /chapters/
@api_view(['GET', 'POST'])
def chapter_list(request):
    """
    GET  /chapters/?SyllabusID=<SyllabusID>  -> List all chapters (optional filter by SyllabusID)
    POST /chapters/  -> Create a new chapter (single or bulk)
    """
    syllabus_id = request.GET.get('SyllabusID')

    if request.method == 'GET':
        chapters = Chapter.objects.all()
        if syllabus_id:
            chapters = chapters.filter(SyllabusID=syllabus_id)

        chapter_completion_map = get_chapter_completion_map()

        chapter_data = [
            {
                "ChapterID": chapter.ChapterID,
                "ChapterName": chapter.ChapterName,
                "SyllabusID": chapter.SyllabusID.SyllabusID,
                "estimated_completion_date": chapter_completion_map.get(chapter.ChapterID),
                "targetDate": chapter.TargetDate
            }
            for chapter in chapters
        ]

        return Response(chapter_data)

    elif request.method == 'POST':
        if isinstance(request.data, list):  # 📌 Handle bulk chapter creation
            serializer = ChapterSerializer(data=request.data, many=True)
        else:  # 📌 Handle single chapter creation
            serializer = ChapterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def chapter_detail(request, ChapterID):
    """
    GET    /chapters/<ChapterID>/  -> Retrieve a specific chapter
    PUT    /chapters/<ChapterID>/  -> Update a specific chapter
    DELETE /chapters/<ChapterID>/  -> Delete a specific chapter
    """
    try:
        chapter = Chapter.objects.get(ChapterID=ChapterID)
    except Chapter.DoesNotExist:
        return Response({'error': 'Chapter not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ChapterSerializer(chapter)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ChapterSerializer(chapter, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        chapter.delete()
        return Response({'message': 'Chapter deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

# views for Module
# 📌 URL: /modules/
@api_view(['GET', 'POST'])
def module_list(request):
    """
    GET  /modules/?ChapterID=<ChapterID>  -> List all modules (optional filter by ChapterID)
    POST /modules/  -> Create a new module (single or bulk)
    """
    chapter_id = request.GET.get('ChapterID')

    if request.method == 'GET':
        modules = Module.objects.all().order_by('-ThisWeek', 'ModuleID')

        # Compute completion dates
        module_completion_map = get_module_completion_map()

        module_data = [
            {
                "ModuleID": module.ModuleID,
                "ModuleName": module.ModuleName,
                "RemainingTime": module.RemainingTime,
                "URL": module.URL,
                "ThisWeek": module.ThisWeek,
                "ChapterID": module.ChapterID.ChapterID,
                "estimated_completion_date": module_completion_map.get(module.ModuleID, date.today())
            }
            for module in modules
        ]

        # Apply ChapterID filter (if given)
        if chapter_id:
            module_data = [module for module in module_data if module["ChapterID"] == chapter_id]

        return Response(module_data)

    elif request.method == 'POST':
        if isinstance(request.data, list):  # 📌 Handle bulk module creation
            serializer = ModuleSerializer(data=request.data, many=True)
        else:  # 📌 Handle single module creation
            serializer = ModuleSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def module_detail(request, ModuleID):
    """
    GET    /modules/<ModuleID>/  -> Retrieve a specific module
    PUT    /modules/<ModuleID>/  -> Update a specific module
    DELETE /modules/<ModuleID>/  -> Delete a specific module
    """
    try:
        module = Module.objects.get(ModuleID=ModuleID)
    except Module.DoesNotExist:
        return Response({'error': 'Module not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ModuleSerializer(module)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ModuleSerializer(module, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        module.delete()
        return Response({'message': 'Module deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

# views for Exam
# 📌 URL: /exams/
@api_view(['GET', 'POST'])
def exam_list(request):
    """
    GET  /exams/  -> List all exams with optional filters
    GET /exams/?StartDate=<StartDate>&EndDate=<EndDate>&ParticularDate=<ParticularDate>&SyllabusID=<SyllabusID>&ChapterID=<ChapterID>&ChapterID=<ChapterID>
    POST /exams/  -> Create one or more exams at once (bulk)
    """
    # Retrieve query parameters
    start_date = request.GET.get('StartDate')
    end_date = request.GET.get('EndDate')
    particular_date = request.GET.get('ParticularDate')
    syllabus_id = request.GET.get('SyllabusID')
    chapter_ids = request.GET.getlist('ChapterID')  # Supports multiple chapter IDs

    if request.method == 'GET':
        exams = Exam.objects.all()

        # Apply filters based on query parameters
        if start_date:
            exams = exams.filter(DateOfExam__gte=start_date)  # Filters exams starting from StartDate
        if end_date:
            exams = exams.filter(DateOfExam__lte=end_date)  # Filters exams until EndDate
        if particular_date:
            exams = exams.filter(DateOfExam=particular_date)  # Filters exams on a specific date
        if syllabus_id:
            exams = exams.filter(SyllabusID=syllabus_id)  # Filters exams by SyllabusID
        if chapter_ids:
            exams = exams.filter(Chapters__ChapterID__in=chapter_ids)  # Filters exams by multiple ChapterIDs

        serializer = ExamSerializer(exams, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Handle bulk exam creation
        if isinstance(request.data, list):  
            for exam_data in request.data:
                chapter_ids = exam_data.get('Chapters', [])
                # Convert chapter_ids list to set to avoid duplication
                chapter_instances = Chapter.objects.filter(ChapterID__in=chapter_ids)
                exam_data['Chapters'] = chapter_instances  # Attach the chapters properly

            serializer = ExamSerializer(data=request.data, many=True)

        else:  # Handle single exam creation
            chapter_ids = request.data.get('Chapters', [])
            chapter_instances = Chapter.objects.filter(ChapterID__in=chapter_ids)
            request.data['Chapters'] = chapter_instances

            serializer = ExamSerializer(data=request.data)

        if serializer.is_valid():
            # Save the exam(s) and return the created data
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def exam_detail(request, ExamID):
    """
    GET    /exams/<ExamID>/  -> Retrieve a specific exam
    PUT    /exams/<ExamID>/  -> Update a specific exam
    DELETE /exams/<ExamID>/  -> Delete a specific exam
    """
    try:
        exam = Exam.objects.get(ExamID=ExamID)
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExamSerializer(exam)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExamSerializer(exam, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        exam.delete()
        return Response({'message': 'Exam deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

# views for Marks
# 📌 URL: /marks/
@api_view(['GET','POST'])
def marks_list(request):
    """
    GET  /marks/?StudentID=<StudentID>&ExamID=<ExamID>  -> Filter Marks by student and exam.
    POST /marks/  -> Create a new Marks entry or multiple entries.
    """
    if request.method == 'GET':
        marks = Marks.objects.all()

        # Optional filtering by StudentID and ExamID
        student_id = request.query_params.get('StudentID', None)
        exam_id = request.query_params.get('ExamID', None)

        if student_id:
            marks = marks.filter(StudentID=student_id)
        
        if exam_id:
            marks = marks.filter(ExamID=exam_id)

        serializer = MarksSerializer(marks, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        if isinstance(request.data, list):  # Bulk create marks entries
            serializer = MarksSerializer(data=request.data, many=True)
        else:  # Create a single marks entry
            serializer = MarksSerializer(data=request.data)

        # Check if the data is valid
        if serializer.is_valid():
            serializer.save()  # Save the marks entry/entries
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# marks_detail
@api_view(['GET', 'PUT', 'DELETE'])
def marks_detail(request, MarksID):
    """
    GET  /marks/<MarksID>/  -> Get a specific Marks entry.
    PUT  /marks/<MarksID>/  -> Update a specific Marks entry.
    DELETE /marks/<MarksID>/  -> Delete a specific Marks entry.
    """
    try:
        marks = Marks.objects.get(MarksID=MarksID)
    except Marks.DoesNotExist:
        return Response({'error': 'Marks entry not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MarksSerializer(marks)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MarksSerializer(marks, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        marks.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
