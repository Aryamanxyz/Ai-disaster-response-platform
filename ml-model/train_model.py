import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

disaster_data = {
    'disaster_type': [
        'flood', 'flood', 'flood', 'flood', 'flood',
        'earthquake', 'earthquake', 'earthquake', 'earthquake', 'earthquake',
        'cyclone', 'cyclone', 'cyclone', 'cyclone', 'cyclone',
        'landslide', 'landslide', 'landslide', 'landslide', 'landslide',
        'drought', 'drought', 'drought', 'drought', 'drought',
        'fire', 'fire', 'fire', 'fire', 'fire'
    ],
    'affected_people': [
        500, 2000, 8000, 25000, 100000,
        1000, 5000, 15000, 50000, 200000,
        2000, 10000, 30000, 80000, 300000,
        200, 800, 3000, 10000, 40000,
        100, 500, 2000, 8000, 30000,
        300, 1200, 4000, 12000, 50000
    ],
    'area_sqkm': [
        10, 50, 200, 800, 3000,
        5, 25, 100, 400, 1500,
        20, 100, 400, 1600, 6000,
        2, 10, 40, 160, 600,
        50, 200, 800, 3000, 12000,
        5, 20, 80, 300, 1200
    ],
    'duration_hours': [
        6, 24, 72, 168, 720,
        1, 2, 4, 8, 24,
        12, 48, 120, 240, 480,
        2, 8, 24, 72, 168,
        720, 1440, 2160, 4320, 8640,
        3, 12, 36, 96, 240
    ],
    'severity': [
        2, 4, 6, 8, 10,
        3, 5, 7, 8, 10,
        3, 5, 7, 9, 10,
        2, 4, 6, 8, 9,
        2, 3, 5, 7, 9,
        2, 4, 6, 8, 10
    ]
}

df = pd.DataFrame(disaster_data)

le = LabelEncoder()
df['disaster_type_encoded'] = le.fit_transform(df['disaster_type'])

X = df[['disaster_type_encoded', 'affected_people', 'area_sqkm', 'duration_hours']]
y = df['severity']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f'Model Accuracy: {accuracy * 100:.2f}%')

with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('label_encoder.pkl', 'wb') as f:
    pickle.dump(le, f)

print('Model saved!')