from rest_framework import serializers
from .models import  LoginInfo,Subject,Teacher,Classroom,Student,Attendance,TimeTable,Syllabus,Chapter,Module,Exam,Marks

class LoginInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginInfo
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class TimeTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeTable
        fields = '__all__'

class SyllabusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Syllabus
        fields = '__all__'

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    Chapters = serializers.PrimaryKeyRelatedField(queryset=Chapter.objects.all(), many=True)  # Many-to-many with Chapters
    
    class Meta:
        model = Exam
        fields = ['ExamID', 'ExamName', 'DateOfExam', 'Chapters', 'SyllabusID']

class MarksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marks
        fields = ['MarksID', 'StudentID', 'ExamID', 'Marks']

