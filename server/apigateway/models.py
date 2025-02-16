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

class Subject(models.Model):
    SubjectID = models.AutoField(primary_key=True)
    SubjectName = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.SubjectName
    

