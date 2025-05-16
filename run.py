import cv2
import os

def get_user_name():
    user_name = input("Enter your name: ")
    sanitized_name = user_name.replace(" ", "_")
    return sanitized_name
output_dir = 'captured_faces'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
cap = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

if not cap.isOpened():
    print("Error: Could not access the webcam.")
    exit()
user_name = get_user_name()
image_count = 0

print(f"Starting webcam. Please position your face in front of the camera.")
print("When you're ready, press 'C' to start the capture.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break
    cv2.putText(frame, "Press 'C' to start capture.", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Face Capture", frame)
    key = cv2.waitKey(1) & 0xFF
    if key == ord('c'):
        break
print(f"Capture started for {user_name}. Please ensure your face is visible.")

while image_count < 10:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) > 0:
        for (x, y, w, h) in faces:
            face = frame[y:y+h, x:x+w]
            img_filename = os.path.join(output_dir, f"{user_name}_{image_count+1}.png")
            cv2.imwrite(img_filename, face)
            image_count += 1
            print(f"Captured {image_count}/10 images for {user_name}.")
    cv2.imshow("Face Capture", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

print(f"Image capture complete for {user_name}.")
