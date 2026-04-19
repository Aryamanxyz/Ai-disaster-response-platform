from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('label_encoder.pkl', 'rb') as f:
    le = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        disaster_type = data.get('disaster_type', 'flood')
        affected_people = int(data.get('affected_people', 1000))
        area_sqkm = float(data.get('area_sqkm', 100))
        duration_hours = int(data.get('duration_hours', 24))

        known_types = list(le.classes_)
        if disaster_type not in known_types:
            disaster_type = 'flood'

        disaster_type_encoded = le.transform([disaster_type])[0]

        features = np.array([[disaster_type_encoded, affected_people, area_sqkm, duration_hours]])
        predicted_severity = model.predict(features)[0]

        risk_level = 'low'
        if predicted_severity >= 8:
            risk_level = 'critical'
        elif predicted_severity >= 6:
            risk_level = 'high'
        elif predicted_severity >= 4:
            risk_level = 'medium'

        return jsonify({
            'success': True,
            'predicted_severity': int(predicted_severity),
            'risk_level': risk_level,
            'disaster_type': disaster_type,
            'affected_people': affected_people
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML Model running!'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)