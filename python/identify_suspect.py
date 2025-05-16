import face_recognition
import cv2
import pickle
import os
import sys
import numpy as np
import locale  


sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale=locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

ENCODINGS_FILE = "python/encodings.pkl"

def load_encodings():
    with open(ENCODINGS_FILE, "rb") as file:
        data = pickle.load(file)
    return data["encodings"], data["names"]

def identify_suspect(image_path):
    known_encodings, known_names = load_encodings()

    if not known_encodings:
        print("⚠️ No known encodings found.")
        return []

    image = face_recognition.load_image_file(image_path)
    rgb_image = image
    face_locations = face_recognition.face_locations(rgb_image)
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

    identified_names = []
    for encoding in face_encodings:
        face_distances = face_recognition.face_distance(known_encodings, encoding)
        if len(face_distances) == 0:
            name = "Unknown"
        else:
            best_match_index = np.argmin(face_distances)
            if face_distances[best_match_index] < 0.6:
                name = known_names[best_match_index]
            else:
                name = "Unknown"
        identified_names.append(name)

    return identified_names.pop(0) if identified_names else "Unknown"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python identify_suspect.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.isfile(image_path):
        print(f"Error: The file {image_path} does not exist.")
        sys.exit(1)

    identified_names = identify_suspect(image_path)
    print(identified_names)