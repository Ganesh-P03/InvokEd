import cv2
import pickle
import requests
from datetime import datetime
from sklearn.neighbors import KNeighborsClassifier

video = cv2.VideoCapture(0)
facedetect = cv2.CascadeClassifier('data/haarcascade_frontalface_default.xml')

with open('data/names.pkl', 'rb') as w:
    LABELS = pickle.load(w)
with open('data/faces_data.pkl', 'rb') as f:
    FACES = pickle.load(f)

print('Shape of Faces matrix --> ', FACES.shape)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(FACES, LABELS)

COL_NAMES = ['StudentID', 'Date', 'Status']
API_URL = "http://127.0.0.1:8000/attendance/"

def send_attendance(attendance_list):
    try:
        response = requests.post(API_URL, json=attendance_list)
        if response.status_code in [200, 201]:
            print(f"Attendance submitted: {attendance_list}")
        else:
            print(f"Failed to submit attendance: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print(f"Error sending request: {e}")

attendance_records = {}

while True:
    ret, frame = video.read()
    if not ret or frame is None:
        continue  # Skip processing if frame capture fails

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)
    
    today = datetime.now().strftime("%Y-%m-%d")
    detected_students = set()

    for (x, y, w, h) in faces:
        crop_img = frame[y:y+h, x:x+w, :]
        resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
        student_id = str(knn.predict(resized_img)[0])
        detected_students.add(student_id)

        if student_id not in attendance_records:
            attendance_records[student_id] = (today, 1)

        # Draw bounding box
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Draw dark grey background for text
        cv2.rectangle(frame, (x, y - 50), (x + w, y), (50, 50, 50), -1)

        # Display student ID with increased font size
        cv2.putText(frame, student_id, (x, y - 15), cv2.FONT_HERSHEY_COMPLEX, 1.2, (0, 255, 0), 2)

    # Display attendance records on screen
    y_offset = 50
    for student_id, (date, status) in attendance_records.items():
        text = f"{student_id} - {date} - {'Present' if status == 1 else 'Absent'}"

        # Background for text (dark grey)
        (text_width, text_height), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_COMPLEX, 1, 2)
        cv2.rectangle(frame, (10, y_offset - 30), (10 + text_width + 10, y_offset + 5), (50, 50, 50), -1)

        # Display text in green
        cv2.putText(frame, text, (20, y_offset), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
        y_offset += 40  # Increase spacing

    cv2.imshow("Attendance System", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('o'):
        if attendance_records:
            attendance_list = [{"StudentID": sid, "Date": date, "Status": status} for sid, (date, status) in attendance_records.items()]
            send_attendance(attendance_list)
            attendance_records.clear()

    if key == ord('q'):
        break

video.release()
cv2.destroyAllWindows()
