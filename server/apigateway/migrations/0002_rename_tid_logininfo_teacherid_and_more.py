# Generated by Django 5.1.6 on 2025-02-22 10:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apigateway', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='logininfo',
            old_name='TID',
            new_name='TeacherID',
        ),
        migrations.RenameField(
            model_name='syllabus',
            old_name='TID',
            new_name='TeacherID',
        ),
        migrations.RenameField(
            model_name='teacher',
            old_name='TID',
            new_name='TeacherID',
        ),
    ]
