import mysql.connector
import pandas as pd
import numpy as np
from itertools import combinations
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

print("Conectando a la base de datos...")
try:
    conn = mysql.connector.connect(host="localhost", user="root", password="", database="db_frutas")
    query = """
        SELECT f.frutaId, p.* 
        FROM fruta f
        JOIN frutapropiedad fp ON f.frutaId = fp.frutaId
        JOIN propiedades p ON fp.propiedadId = p.propiedadId
    """
    df_fruits = pd.read_sql(query, conn)
    conn.close()
    print(f"Extraídas {len(df_fruits)} frutas con sus propiedades.")
except Exception as e:
    print(f"Error conectando a la BD: {e}")
    exit(1)

# Llenar valores nulos (NaN) con 0 temporalmente
df_fruits = df_fruits.fillna(0)

# Columnas de entrada (features)
# Tomaremos algunas propiedades físico-químicas como features
input_features = ['densidad', 'gradosBrix', 'acidez', 'pH', 'L', 'a', 'b', 'humedad', 'cenizas', 'fenolesTotales_FF', 'flavonoides_FF']
# Asegurar que todas las features existen
for feature in input_features:
    if feature not in df_fruits.columns:
        df_fruits[feature] = 0.0

# Columnas a predecir (targets)
target_features = ['cap_ant_digerido', 'bioacc_carotenoides', 'bioacc_flavonoides', 'bioacc_acAsc']
for target in target_features:
    if target not in df_fruits.columns:
        df_fruits[target] = 0.0

print("Generando dataset sintético de mezclas...")
synthetic_data = []

# Extraer arreglos para cálculos rápidos
input_vals = df_fruits[input_features].values
target_vals = df_fruits[target_features].values
n_fruits = len(df_fruits)

# Número de mezclas aleatorias a generar
NUM_SAMPLES = 15000

import random

for _ in range(NUM_SAMPLES):
    mix_size = random.choice([2, 3, 4])
    # Elegir índices aleatorios de frutas (sin reemplazo)
    indices = random.sample(range(n_fruits), mix_size)
    
    # Promedios
    avg_inputs = np.mean(input_vals[indices], axis=0)
    avg_targets = np.mean(target_vals[indices], axis=0)
    
    # Sinergia
    synergy_factors = np.random.uniform(0.98, 1.08, size=len(target_features))
    final_targets = avg_targets * synergy_factors
    
    record = np.concatenate([avg_inputs, final_targets])
    synthetic_data.append(record)

# Añadir también las frutas individuales como mezclas de 1 para robustez
for i in range(n_fruits):
    record = np.concatenate([input_vals[i], target_vals[i]])
    synthetic_data.append(record)

df_mixes = pd.DataFrame(synthetic_data, columns=input_features + target_features)
print(f"Dataset generado con {len(df_mixes)} registros de mezclas teóricas.")

# Preparar datos para el entrenamiento
X = df_mixes[input_features].values
y = df_mixes[target_features].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Entrenando Red Neuronal (Multi-Layer Perceptron)...")
model = MLPRegressor(hidden_layer_sizes=(64, 64), activation='relu', solver='adam', max_iter=2000, random_state=42)
model.fit(X_train, y_train)

print("Evaluando el modelo...")
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"MAE: {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"R2 Score: {r2:.4f}")

# Guardar el modelo y sus features
model_data = {
    'model': model,
    'input_features': input_features,
    'target_features': target_features,
    'metrics': {
        'mae': round(mae, 4),
        'rmse': round(rmse, 4),
        'r2': round(r2, 4)
    }
}

joblib.dump(model_data, 'model.pkl')
print("Modelo guardado exitosamente en 'model.pkl'")
