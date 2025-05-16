import os
import sys
import cv2
import face_recognition
import numpy as np
from PIL import Image

def augment_image(img, num_augments=10):
    augmented = []
    for i in range(num_augments):
        angle = np.random.uniform(-10, 10)
        scale = np.random.uniform(0.95, 1.05)

        pil_img = Image.fromarray(img)
        pil_img = pil_img.rotate(angle)

        w, h = pil_img.size
        pil_img = pil_img.resize((int(w * scale), int(h * scale)))

        aug_img = np.array(pil_img)
        augmented.append(aug_img)
    return augmented

if __name__ == "__main__":
    name = sys.argv[1]
    image_dir = "python/suspects"
    store_dir = os.path.join(image_dir, name)

    if not os.path.exists(store_dir):
        os.makedirs(store_dir)

    for i in range(1, 11):
        img_path = os.path.join(image_dir, f"{name}_{i}.jpg")
        if not os.path.exists(img_path):
            print(f"Image not found: {img_path}")
            continue

        image = face_recognition.load_image_file(img_path)
        face_locations = face_recognition.face_locations(image)

        if not face_locations:
            print(f"No face found in {img_path}")
            continue

        for j, (top, right, bottom, left) in enumerate(face_locations):
            face_img = image[top:bottom, left:right]
            face_img = cv2.resize(face_img, (160, 160))
            augmented_faces = augment_image(face_img, 10)

            for k, aug in enumerate(augmented_faces):
                out_path = os.path.join(store_dir, f"{name}_{i}_{j}_{k+1}.jpg")
                cv2.imwrite(out_path, aug)
        os.remove(img_path)
