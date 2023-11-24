import cv2
import numpy as np
from tensorflow.keras.applications import MobileNet
from tensorflow.keras.applications.mobilenet import preprocess_input, decode_predictions

# Load pre-trained MobileNet model
model = MobileNet(weights='imagenet')

def classify_clothing(image_path):
    # Load and preprocess the image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)

    # Make predictions using the MobileNet model
    predictions = model.predict(image)
    decoded_predictions = decode_predictions(predictions)

    # Extract top prediction
    top_prediction = decoded_predictions[0][0]

    # Get the class label and confidence
    class_label = top_prediction[1]
    confidence = top_prediction[2]

    # Classify the type of clothing
    clothing_type = classify_clothing_type(class_label)

    # Detect the color of the clothing
    color = detect_color(image_path)

    # Print the result
    print(f"The image contains {clothing_type} with color {color}. Confidence: {confidence:.2f}")

def classify_clothing_type(class_label):
  clothing_type_mapping = {
        't-shirt': 'T-Shirt',
        'shirt': 'Shirt',
        'coat': 'Coat',
        'pant': 'Pants',
        'jeans': 'Jeans',
    }
    for key, value in clothing_type_mapping.items():
        if key.lower() in class_label.lower():
            return value
    return 'Unknown'

def detect_color(image_path):
  image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Reshape the image to a list of pixels
    pixels = image.reshape((-1, 3))

    # Calculate the mean color of the image
    mean_color = np.mean(pixels, axis=0)

    # Find the closest color from a predefined color list (you can expand the list)
    colors = {
        'black': (0, 0, 0),
        'white': (255, 255, 255),
        'red': (255, 0, 0),
        'green': (0, 255, 0),
        'blue': (0, 0, 255),
    }
    closest_color = min(colors, key=lambda x: np.linalg.norm(np.array(mean_color) - np.array(colors[x])))

    return closest_color

# Example usage
image_path = 'red.png'
classify_clothing(image_path)
