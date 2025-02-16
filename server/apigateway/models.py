import uuid
from django.db import models

class LoginInfo(models.Model):
    TID = models.OneToOneField('Teacher', on_delete=models.CASCADE, primary_key=True)
    Password = models.CharField(max_length=255)
    Type = models.IntegerField(default=0) #0->teacher,1->admin,2->student
    def __str__(self):
        return self.TID

class Teacher(models.Model):
    TID = models.CharField(primary_key=True, max_length=100,  default=uuid.uuid4)
    Name = models.CharField(max_length=255)
    DateofJoining = models.DateField()
    Phone = models.CharField(max_length=15, unique=True)
    SubjectID = models.ForeignKey('Subject', on_delete=models.CASCADE)
    def __str__(self):
        return self.TID

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
    SubjectID = models.AutoField(primary_key=True)
    SubjectName = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.SubjectName

class TimeTable(models.Model):
    TimeTableID = models.AutoField(primary_key=True)  # Explicit primary key
    ClassroomID = models.ForeignKey('Classroom', on_delete=models.CASCADE)  # Classroom ID
    Day = models.CharField(max_length=10)  # Example: Monday, Tuesday
    Slot = models.IntegerField()  # Example: 1, 2, 3 (Period numbers)
    SubjectID = models.ForeignKey('Subject', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.CID} - {self.Day} - Slot {self.Slot}"

