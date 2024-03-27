from flask import Flask, request, jsonify
from datetime import date
import requests
from PIL import Image
import random
from io import BytesIO
import os
from classifier import single_classification, color_classification, find_combo_by_top  
from classifier2 import integrated_image_processing  # Ensure this is correctly implemented
from flask_cors import CORS
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)


@app.route('/classify-image', methods=['POST'])
def classify_image():
    data = request.json
    image_url = data.get('imageUrl')
    if not image_url:
        return jsonify({"error": "Missing image URL"}), 400

    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Raises an error for bad responses
        image = Image.open(BytesIO(response.content))
        
        temp_path = 'temp_image.jpg'
        image.save(temp_path)

        # Existing classification functionality
        classification_subtype, classification_info, classification_details = single_classification(temp_path)
        color_info = color_classification(temp_path)
        

        # Integrated image processing functionality
        integrated_result = integrated_image_processing(temp_path)
        
        recommended_combo_from_model1 = find_combo_by_top(color_info)  
        
        color_name = integrated_result['Dominant Color']
        recommended_combo_from_model2 = find_combo_by_top(color_name)  
        
        
        os.remove(temp_path)

        return jsonify({
            'classification_subtype': classification_subtype,
            'classification_info': classification_info,
            'classification_details': classification_details,
            'color_info': color_info,
            
            'recommended_bottom_color1': recommended_combo_from_model1[0],
            'recommended_shoes_color1': recommended_combo_from_model1[1],
            
            'recommended_bottom_color2': recommended_combo_from_model2[0],
            'recommended_shoes_color2': recommended_combo_from_model2[1],
            
            'integrated_classification_label': integrated_result['Label'],
            'integrated_dominant_color': integrated_result['Dominant Color'],
            'combined_label_and_color': integrated_result['Combined Label and Color'],
        })
    except requests.HTTPError as http_err:
        return jsonify({"error": f"HTTP error occurred: {http_err}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
