from apigateway.models import Syllabus, Chapter, Exam, Marks

# Step 1: Create new Syllabus entries with the correct SyllabusID
old_to_new = {}  # Store mapping of old IDs to new IDs

for syllabus in Syllabus.objects.all():
    new_id = f"{syllabus.ClassroomID.ClassroomID}_{syllabus.SubjectID.SubjectID}"
    
    if new_id != syllabus.SyllabusID:  # Only update if needed
        print(f"Creating new Syllabus {new_id} for {syllabus.SyllabusID}")
        
        new_syllabus = Syllabus.objects.create(
            SyllabusID=new_id,
            ClassroomID=syllabus.ClassroomID,
            SubjectID=syllabus.SubjectID,
            TeacherID=syllabus.TeacherID
        )
        
        old_to_new[syllabus.SyllabusID] = new_syllabus.SyllabusID  # Store mapping

# Step 2: Update foreign key references in related tables
for old_id, new_id in old_to_new.items():
    print(f"Updating foreign keys: {old_id} -> {new_id}")
    
    Chapter.objects.filter(SyllabusID=old_id).update(SyllabusID=new_id)
    Exam.objects.filter(SyllabusID=old_id).update(SyllabusID=new_id)

# Step 3: Delete old Syllabus entries
for old_id in old_to_new.keys():
    print(f"Deleting old Syllabus: {old_id}")
    Syllabus.objects.filter(SyllabusID=old_id).delete()

print("✅ SyllabusID updated successfully without FK errors!")

