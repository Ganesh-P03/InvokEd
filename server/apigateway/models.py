import uuid
from django.db import models

class LoginInfo(models.Model):
    TeacherID = models.OneToOneField('Teacher', on_delete=models.CASCADE, primary_key=True)
    Password = models.CharField(max_length=255)
    Type = models.IntegerField(default=0) #0->teacher,1->admin,2->student
    def __str__(self):
        return self.TeacherID

class Teacher(models.Model):
    TeacherID = models.CharField(primary_key=True, max_length=100,  default=uuid.uuid4)
    Name = models.CharField(max_length=255)
    DateofJoining = models.DateField()
    Phone = models.CharField(max_length=15, unique=True)
    SubjectID = models.ForeignKey('Subject', on_delete=models.CASCADE)
    def __str__(self):
        return self.TeacherID

class Student(models.Model):
    StudentID = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    Name = models.CharField(max_length=255)
    DateofJoining = models.DateField()
    ClassroomID = models.ForeignKey('Classroom', to_field='ClassroomID', on_delete=models.SET_NULL, null=True, blank=True)  # Assuming Classroom model exists
    GuardianName = models.CharField(max_length=255)
    GuardianRelation = models.CharField(max_length=100)
    GuardianPhone = models.CharField(max_length=15)
    Email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.Name} ({self.StudentID})"

class Classroom(models.Model):
    ClassroomID = models.CharField(primary_key=True, max_length=10)
    ClassTeacherID = models.ForeignKey('Teacher', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.ClassroomID

class Attendance(models.Model):
    AttendanceID = models.AutoField(primary_key=True)
    StudentID = models.ForeignKey(Student, on_delete=models.CASCADE)  # Delete attendance if student is removed
    Date = models.DateField()
    Status = models.IntegerField(default=0)  # 0 -> Absent, 1 -> Present

    class Meta:
        unique_together = ('StudentID', 'Date')  # Ensures one attendance record per student per day

    def __str__(self):
        return f"{self.StudentID.Name} - {self.Date} - {'Present' if self.Status == 1 else 'Absent'}"

class Subject(models.Model):
    SubjectID = models.CharField(primary_key=True,max_length=255)

    def __str__(self):
        return self.SubjectID

class TimeTable(models.Model):
    TimeTableID = models.AutoField(primary_key=True)  # Explicit primary key
    ClassroomID = models.ForeignKey('Classroom', on_delete=models.CASCADE)  # Classroom ID
    Day = models.CharField(max_length=10)  # Example: Monday, Tuesday
    Slot = models.IntegerField()  # Example: 1, 2, 3 (Period numbers)
    SubjectID = models.ForeignKey('Subject', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.CID} - {self.Day} - Slot {self.Slot}"

class Syllabus(models.Model):
    SyllabusID = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    ClassroomID = models.ForeignKey('Classroom', on_delete=models.CASCADE)
    SubjectID = models.ForeignKey('Subject', on_delete=models.CASCADE)
    TeacherID = models.ForeignKey('Teacher', on_delete=models.CASCADE)

    def __str__(self):
        return f"Syllabus for {self.ClassroomID} - {self.SubjectID}"

class Chapter(models.Model):
    ChapterID = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    SyllabusID = models.ForeignKey('Syllabus', on_delete=models.CASCADE)
    ChapterName = models.CharField(max_length=255)
    TargetDate = models.DateField()

    def __str__(self):
        return self.ChapterID

class Module(models.Model):
    ModuleID = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    ChapterID = models.ForeignKey('Chapter', on_delete=models.CASCADE)
    ModuleName = models.CharField(max_length=255)
    RemainingTime = models.IntegerField(help_text="Number of teaching hours required")
    URL = models.URLField(blank=True, null=True)
    ThisWeek = models.BooleanField(default=False)

    def __str__(self):
        return self.ModuleName

class Exam(models.Model):
    ExamID = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    ExamName = models.CharField(max_length=255)
    DateOfExam = models.DateField()
    Chapters = models.ManyToManyField('Chapter', blank=True)  # Many-to-many relationship with Chapter
    SyllabusID = models.ForeignKey('Syllabus', on_delete=models.CASCADE)  # Foreign key to Syllabus

    def __str__(self):
        return self.ExamName

class Marks(models.Model):
    MarksID = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4)
    StudentID = models.ForeignKey('Student', on_delete=models.CASCADE)
    ExamID = models.ForeignKey('Exam', on_delete=models.CASCADE)  # Foreign key to Exam
    Marks = models.IntegerField()

    def __str__(self):
        return f"MarksID: {self.MarksID} - {self.StudentID} - {self.ExamID}: {self.Marks}"