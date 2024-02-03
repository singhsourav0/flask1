from flask import Flask, render_template, request, jsonify
from PIL import Image
import google.generativeai as genai
import textwrap
from IPython.display import Markdown



app = Flask(__name__)

api_key ="AIzaSyDV_q4TyTkdgOTHjhJkeTxruj1KrMbcRjE"
genai.configure(api_key)
import PIL.Image

# Update the x function
def x(y, mood):
    print("Image Path in x:", mood)
    img = PIL.Image.open(y)

    model = genai.GenerativeModel('gemini-pro-vision')
    prompt = f"Compose Fifteen short, medium Instagram captions in only english language designed to complement images. Include curated EMOJIs* and hashtags that aptly capture the essence of the PICTURE* and reflect the current mood, characterized as {mood}. Ensure the captions are visually appealing and resonate with the content."
    response = model.generate_content([prompt, img], stream=True)
    response.resolve()

    return response.text  # Return the text directly without Markdown conversion

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']
    mood_category = request.form.get('mood_category')  # Remove the default value

    if image.filename == '':
        return jsonify({"error": "No image filename"}), 400

    print("Image Path:", image.filename)
    print("Mood Category:", mood_category)

    try:
        captions = x(image, mood_category)
        return jsonify({"captions": captions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
