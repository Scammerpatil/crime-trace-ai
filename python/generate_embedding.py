import face_recognition
import sys
import json
import os

def get_face_embedding(image_path):
    try:
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        if not encodings:
            return None

        return encodings[0].tolist()

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Image path required"}))
        sys.exit(1)

    image_path = sys.argv[1]
    embedding = get_face_embedding(image_path)

    if embedding is None:
        print(json.dumps({"error": "No face detected in the image"}))
        sys.exit(1)

    print(json.dumps(embedding))
