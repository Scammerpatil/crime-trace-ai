import face_recognition
import cv2
import pickle
import os
import sys
import shutil
import numpy as np
from collections import Counter
import locale  
sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale=locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

ENCODINGS_FILE = "python/encodings.pkl"
OUTPUT_DIR = "python/matched_faces"

def load_encodings():
    with open(ENCODINGS_FILE, "rb") as file:
        data = pickle.load(file)
    return data["encodings"], data["names"]

def save_face_image(image, name, count):
    person_dir = os.path.join(OUTPUT_DIR, name)
    os.makedirs(person_dir, exist_ok=True)
    filename = os.path.join(person_dir, f"{name}_{count}.jpg")
    cv2.imwrite(filename, image)

def merge_faces(name):
    person_dir = os.path.join(OUTPUT_DIR, name)
    face_images = [
        cv2.imread(os.path.join(person_dir, file))
        for file in sorted(os.listdir(person_dir))
        if file.endswith(".jpg")
    ]

    if not face_images:
        return

    size = (160, 160)
    face_images = [cv2.resize(img, size) for img in face_images]

    row_size = 5
    rows = [face_images[i:i + row_size] for i in range(0, len(face_images), row_size)]

    last_row = rows[-1]
    if len(last_row) < row_size:
        padding = [np.zeros((size[1], size[0], 3), dtype=np.uint8)] * (row_size - len(last_row))
        rows[-1] += padding

    merged_rows = [np.hstack(row) for row in rows]
    merged_image = np.vstack(merged_rows)

    final_image_path = os.path.join(OUTPUT_DIR, f"{name}_merged.jpg")
    cv2.imwrite(final_image_path, merged_image)

    shutil.rmtree(person_dir)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python match_faces_from_video.py <video_file_path>")
        sys.exit(1)

    video_path = sys.argv[1]

    known_encodings, known_names = load_encodings()
    matched_names = []

    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    face_counter = {}

    if not cap.isOpened():
        print(f"Error opening video file: {video_path}")
        sys.exit(1)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1

        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for face_encoding, face_location in zip(face_encodings, face_locations):
            matches = face_recognition.compare_faces(known_encodings, face_encoding)
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)

            if any(matches):
                best_match_index = face_distances.argmin()
                name = known_names[best_match_index]
                matched_names.append(name)

                top, right, bottom, left = [v * 4 for v in face_location]
                face_image = frame[top:bottom, left:right]

                face_counter[name] = face_counter.get(name, 0) + 1
                save_face_image(face_image, name, face_counter[name])

    cap.release()
    cv2.destroyAllWindows()
    if matched_names:
        summary = Counter(matched_names)
        for name, count in summary.items():
            print(f"{name}")
            merge_faces(name)
    else:
        print("No known faces matched.")

    # Delete uploaded video
    try:
        os.remove(video_path)
    except Exception as e:
        print(f"⚠️ Failed to delete video: {e}")
