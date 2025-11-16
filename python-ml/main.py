from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

with open("pcos_model_pipeline.pkl", "rb") as f:
    model = pickle.load(f)

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}}, supports_credentials=True)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        features = data['features']

        prediction = model.predict([features])[0]
        probability = model.predict_proba([features])[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability": round(float(probability), 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
