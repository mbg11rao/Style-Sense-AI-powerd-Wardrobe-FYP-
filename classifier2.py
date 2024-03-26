import cv2
import numpy as np
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.models import load_model
from skimage.color import rgb2lab, deltaE_cie76
from sklearn.cluster import KMeans
import webcolors

classes = ['Blazer', 'Body', 'Dress', 'Hat', 'Hoodie', 'Longsleeve', 'Outwear', 'Pants', 'Polo', 'Shirt', 'Shoes', 'Shorts', 'Skirt', 'T-Shirt', 'Top', 'Undershirt']

def closest_color(rgb):
    min_distance = float('inf')
    closest_name = None
    input_color = rgb2lab(np.uint8([[rgb]]))[0][0]

    for hex_code, name in webcolors.CSS3_HEX_TO_NAMES.items():
        color_rgb = webcolors.hex_to_rgb(hex_code)
        color_lab = rgb2lab(np.uint8([[color_rgb]]))[0][0]
        distance = deltaE_cie76(input_color, color_lab)

        if distance < min_distance:
            min_distance = distance
            closest_name = name

    return closest_name

# def remove_background_and_identify_color(image_path):
#     image = cv2.imread(image_path)
#     image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

#     mask = np.zeros(image.shape[:2], np.uint8)
#     bgdModel = np.zeros((1, 65), np.float64)
#     fgdModel = np.zeros((1, 65), np.float64)

#     rect = (50, 50, image.shape[1] - 50, image.shape[0] - 50)
#     cv2.grabCut(image, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)

#     mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
#     result = image * mask2[:, :, np.newaxis]
#     result[mask2 == 0] = 255

#     pixels = result.reshape(-1, 3)
#     pixels = pixels[(pixels != [255, 255, 255]).all(axis=1)]

#     color_info = []

#     if len(pixels) > 0:
#         kmeans = KMeans(n_clusters=3)
#         kmeans.fit(pixels)
#         colors = kmeans.cluster_centers_
#         labels = kmeans.labels_

#         label_counts = np.bincount(labels)
#         max_label_count_index = np.argmax(label_counts)
#         dominant_color = colors[max_label_count_index]
#         color_name = closest_color([int(c) for c in dominant_color])
#     else:
#         color_name = 'No dominant color identified'

#     return color_name
def resize_image(image, max_size=400):
    """Reduce image size for faster processing."""
    h, w = image.shape[:2]
    scaling_factor = max_size / float(max(h, w))
    if scaling_factor < 1:
        image = cv2.resize(image, None, fx=scaling_factor, fy=scaling_factor, interpolation=cv2.INTER_AREA)
    return image

def quick_color_approximation(pixels):
    """Approximate the most frequent color in the image."""
    # Convert to a simpler color space with fewer colors
    simple_pixels = pixels // 64 * 64  # Reduce color resolution to speed up mode calculation
    unique_colors, counts = np.unique(simple_pixels, axis=0, return_counts=True)
    dominant_color = unique_colors[counts.argmax()]
    return dominant_color

def remove_background_and_identify_color(image_path):
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = resize_image(image, max_size=400)  # Resize image for faster processing

    mask = np.zeros(image.shape[:2], np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    rect = (50, 50, image.shape[1] - 50, image.shape[0] - 50)
    cv2.grabCut(image, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)

    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    image = image * mask2[:, :, np.newaxis]
    image[mask2 == 0] = 255

    pixels = image.reshape(-1, 3)
    pixels = pixels[(pixels != [255, 255, 255]).all(axis=1)]

    if len(pixels) > 0:
        dominant_color = quick_color_approximation(pixels)
        color_name = closest_color([int(c) for c in dominant_color])
    else:
        color_name = 'No dominant color identified'

    return color_name

def predict_image_with_labels(image_path, model):
    img = keras_image.load_img(image_path, target_size=(224, 224))
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    predictions = model.predict(img_array)
    top_index = np.argmax(predictions[0])
    top_label = classes[top_index]

    return top_label

def integrated_image_processing(image_path):
    model = load_model('my_model.h5')  # Ensure you have loaded your model correctly
    label_name = predict_image_with_labels(image_path, model)
    color_name = remove_background_and_identify_color(image_path)

    combined_result = {
        'Label': label_name,
        'Dominant Color': color_name,
        'Combined Label and Color': f"{label_name} with dominant color {color_name}"
    }

    return combined_result
