from datetime import timedelta, date
from .models import TimeTable, Module, Chapter

def get_module_completion_map():
    modules = Module.objects.all().order_by('-ThisWeek', 'ModuleID')

    # Keep all modules (even RemainingTime = 0)
    modules_for_calculation = modules.filter(RemainingTime__gt=0).order_by('-ThisWeek', 'ModuleID')

    last_completion_date = date.today()  # Start from today

    if modules.exists():
        timetable_slots = TimeTable.objects.filter(
            SubjectID=modules.first().ChapterID.SyllabusID.SubjectID
        ).order_by('Day', 'Slot')

        unique_days = sorted(set(slot.Day for slot in timetable_slots),
            key=lambda d: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].index(d)
        )
    else:
        unique_days = []

    module_completion_map = {}

    for module in modules_for_calculation:
        estimated_completion = last_completion_date
        remaining_hours = module.RemainingTime

        while remaining_hours > 0:
            estimated_completion += timedelta(days=1)
            if estimated_completion.strftime('%A') in unique_days:
                remaining_hours -= 1  # Deduct 1 hour per teaching day
        
        last_completion_date = estimated_completion  # Update last completion date
        module_completion_map[module.ModuleID] = estimated_completion
    return module_completion_map

def get_chapter_completion_map():
    module_completion_map = get_module_completion_map()

    chapters = Chapter.objects.all()
    chapter_completion_map = {}

    for chapter in chapters:
        # Get all module completion dates for this chapter
        module_dates = [
            module_completion_map[module.ModuleID] 
            for module in Module.objects.filter(ChapterID=chapter.ChapterID)
        ]

        # If there are modules, take the latest completion date as the chapter completion date
        if module_dates:
            chapter_completion_map[chapter.ChapterID] = max(module_dates)
        else:
            chapter_completion_map[chapter.ChapterID] = None  # No modules, no completion date

    return chapter_completion_map