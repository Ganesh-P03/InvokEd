from django.shortcuts import render
from .models import  LoginInfo,Subject,Teacher,Classroom,Student
from .serializers import  LoginInfoSerializer,SubjectSerializer,TeacherSerializer,ClassroomSerializer,StudentSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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
        TID = data.get('TID')

        if not TID:
            return Response({'error': 'TID is required'}, status=status.HTTP_400_BAD_REQUEST)

        teacher, created = Teacher.objects.get_or_create(
            TID=TID,
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
    
# 📌 URL: /logininfos/<TID>/
@api_view(['GET', 'PUT', 'DELETE'])
def logininfo_detail(request, TID):
    """
    GET    /logins/<TID>/  -> Retrieve login info by TID  
    PUT    /logins/<TID>/  -> Update login details  
    DELETE /logins/<TID>/  -> Remove login record  
    """
    try:
        login = LoginInfo.objects.get(TID=TID)
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

# 📌 URL: /teachers/<TID>/
@api_view(['GET', 'PUT', 'DELETE'])
def teacher_detail(request, TID):
    """
    GET    /teachers/<TID>/  -> Retrieve a teacher by TID  
    PUT    /teachers/<TID>/  -> Update teacher details  
    DELETE /teachers/<TID>/  -> Remove a teacher  
    """
    try:
        teacher = Teacher.objects.get(TID=TID)
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
