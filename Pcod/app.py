from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import requests
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

model = joblib.load("pcos_model_pipeline.pkl")

new_features = [
    'Age', 'Weight', 'Height(Cm)', 'BMI', 'Cycle(I/R)', 'Cycle length',
    'FSH(mIU/mL)', 'LH(mIU/mL)', 'FSH/LH ratio', 'TSH (mIU/L)',
    'Hair growth', 'Skin darkening', 'Acne', 'Insulin levels (æIU/ml)'
]

API_KEY = os.environ.get("PCOD_API_KEY", "health-checker")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")

@app.route('/')
def home():
    return "PCOS/PCOD Prediction API running successfully"

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        req_key = request.headers.get('x-api-key')
        if req_key != API_KEY:
            return jsonify({"error": "Unauthorized - Invalid API Key"}), 401

        input_data = request.get_json()
        input_df = pd.DataFrame([input_data])
        input_df = input_df[new_features]

        prediction = model.predict(input_df)[0]

        return jsonify({
            "prediction": int(prediction),
            "message": "PCOS/PCOD Positive" if prediction == 1 else "PCOS/PCOD Negative"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "").strip()

        if not user_input:
            return jsonify({"reply": "Please type something."})

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"gemini-2.0-flash:generateContent?key={GEMINI_KEY}"
        )

        response = requests.post(url, json={
            "contents": [{"parts": [{"text": user_input}]}]
        })

        if response.status_code == 429:
            return jsonify({"reply": "I'm getting too many requests. Please try again later."})

        if response.status_code != 200:
            return jsonify({"reply": "Gemini API error occurred."})

        resp_data = response.json()
        reply = (
            resp_data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
        )

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": f"Server error: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)