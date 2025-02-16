# Generated by Django 5.1.6 on 2025-02-16 10:07

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apigateway', '0003_teacher_alter_logininfo_tid'),
    ]

    operations = [
        migrations.CreateModel(
            name='Classroom',
            fields=[
                ('ClassroomID', models.CharField(max_length=255, primary_key=True, serialize=False, unique=True)),
                ('ClassTeacherID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='apigateway.teacher')),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('StudentID', models.CharField(default=uuid.uuid4, max_length=100, primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=255)),
                ('DateofJoining', models.DateField()),
                ('GuardianName', models.CharField(max_length=255)),
                ('GuardianRelation', models.CharField(max_length=100)),
                ('GuardianPhone', models.CharField(max_length=15)),
                ('Email', models.EmailField(max_length=254, unique=True)),
                ('ClassroomID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apigateway.classroom')),
            ],
        ),
    ]
