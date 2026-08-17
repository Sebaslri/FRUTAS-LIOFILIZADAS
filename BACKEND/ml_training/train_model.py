import mysql.connector
import pandas as pd
import numpy as np
from itertools import combinations
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
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

from sklearn.model_selection import KFold

print("Iniciando Validación Cruzada (5-Fold CV)...")
kf = KFold(n_splits=5, shuffle=True, random_state=42)

cv_global_metrics = {'mae': [], 'rmse': [], 'r2': [], 'nrmse': []}
cv_target_metrics = {target: {'mae': [], 'rmse': [], 'r2': [], 'nrmse': []} for target in target_features}

for fold, (train_idx, test_idx) in enumerate(kf.split(X)):
    print(f"--- Entrenando Pliegue {fold+1}/5 ---")
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    
    scaler_X_cv = StandardScaler()
    scaler_y_cv = StandardScaler()
    
    X_train_scaled = scaler_X_cv.fit_transform(X_train)
    X_test_scaled = scaler_X_cv.transform(X_test)
    y_train_scaled = scaler_y_cv.fit_transform(y_train)
    
    model_cv = MLPRegressor(hidden_layer_sizes=(64, 64), activation='relu', solver='adam', max_iter=2000, random_state=42)
    model_cv.fit(X_train_scaled, y_train_scaled)
    
    y_pred_scaled = model_cv.predict(X_test_scaled)
    y_pred_unscaled = scaler_y_cv.inverse_transform(y_pred_scaled)
    
    # Global metrics for this fold
    global_rmse = np.sqrt(mean_squared_error(y_test, y_pred_unscaled))
    global_range_y = np.max(y_test) - np.min(y_test)
    
    cv_global_metrics['mae'].append(mean_absolute_error(y_test, y_pred_unscaled))
    cv_global_metrics['rmse'].append(global_rmse)
    cv_global_metrics['r2'].append(r2_score(y_test, y_pred_unscaled))
    cv_global_metrics['nrmse'].append((global_rmse / global_range_y) * 100 if global_range_y != 0 else 0)
    
    # Per-target metrics for this fold
    for i, target_name in enumerate(target_features):
        t_rmse = np.sqrt(mean_squared_error(y_test[:, i], y_pred_unscaled[:, i]))
        t_range_y = np.max(y_test[:, i]) - np.min(y_test[:, i])
        
        cv_target_metrics[target_name]['mae'].append(mean_absolute_error(y_test[:, i], y_pred_unscaled[:, i]))
        cv_target_metrics[target_name]['rmse'].append(t_rmse)
        cv_target_metrics[target_name]['r2'].append(r2_score(y_test[:, i], y_pred_unscaled[:, i]))
        cv_target_metrics[target_name]['nrmse'].append((t_rmse / t_range_y) * 100 if t_range_y != 0 else 0)

# Average metrics across all folds
avg_global_metrics = {k: np.mean(v) for k, v in cv_global_metrics.items()}
avg_target_metrics = {
    target: {k: np.mean(v) for k, v in metrics.items()} 
    for target, metrics in cv_target_metrics.items()
}

print("\n--- MÉTRICAS PROMEDIO (5-FOLD CV) ---")
print(f"Global MAE: {avg_global_metrics['mae']:.4f}")
print(f"Global RMSE: {avg_global_metrics['rmse']:.4f}")
print(f"Global R2 Score: {avg_global_metrics['r2']:.4f}")
print(f"Global NRMSE: {avg_global_metrics['nrmse']:.2f}%")

print("\n--- MÉTRICAS POR VARIABLE (PROMEDIO) ---")
final_target_metrics_dict = {}
for target_name in target_features:
    tm = avg_target_metrics[target_name]
    final_target_metrics_dict[target_name] = {
        'mae': round(float(tm['mae']), 4),
        'rmse': round(float(tm['rmse']), 4),
        'r2': round(float(tm['r2']), 4),
        'nrmse': round(float(tm['nrmse']), 4)
    }
    print(f"[{target_name}] MAE: {tm['mae']:.4f}, RMSE: {tm['rmse']:.4f}, R2: {tm['r2']:.4f}, NRMSE: {tm['nrmse']:.2f}%")

print("\nEntrenando Modelo Final (Producción) con el 100% de los datos...")
scaler_X_final = StandardScaler()
scaler_y_final = StandardScaler()

X_scaled_final = scaler_X_final.fit_transform(X)
y_scaled_final = scaler_y_final.fit_transform(y)

model_final = MLPRegressor(hidden_layer_sizes=(64, 64), activation='relu', solver='adam', max_iter=2000, random_state=42)
model_final.fit(X_scaled_final, y_scaled_final)

print("\nGenerando gráfico de dispersión (Predicho vs Real)...")
import matplotlib.pyplot as plt
import seaborn as sns
import os

sns.set_theme(style="whitegrid")
fig, axes = plt.subplots(2, 2, figsize=(14, 12))
axes = axes.flatten()

# Predicciones finales sobre todo el dataset (para visualización)
y_pred_scaled_final = model_final.predict(X_scaled_final)
y_pred_unscaled_final = scaler_y_final.inverse_transform(y_pred_scaled_final)

target_names_display = ['Capacidad Antioxidante', 'Carotenoides', 'Flavonoides', 'Ácido Ascórbico']

for i, (target, display_name) in enumerate(zip(target_features, target_names_display)):
    ax = axes[i]
    # Scatter plot
    sns.scatterplot(x=y[:, i], y=y_pred_unscaled_final[:, i], ax=ax, color='#3B82F6', alpha=0.3, s=15)
    
    # Linea de identidad (perfect prediction)
    min_val = min(y[:, i].min(), y_pred_unscaled_final[:, i].min())
    max_val = max(y[:, i].max(), y_pred_unscaled_final[:, i].max())
    ax.plot([min_val, max_val], [min_val, max_val], color='#EF4444', linestyle='--', linewidth=2)
    
    ax.set_title(f'{display_name}\nReal vs Predicho', fontsize=12, fontweight='bold', color='#1F2937')
    ax.set_xlabel('Valor Real de Laboratorio', fontsize=10)
    ax.set_ylabel('Predicción de la IA', fontsize=10)

plt.tight_layout()
plot_path = os.path.join(os.path.dirname(__file__), 'evaluation_plot.png')
plt.savefig(plot_path, dpi=120, bbox_inches='tight')
plt.close()
print(f"Gráfico guardado en {plot_path}")

# Guardar el modelo, los scalers y sus features
model_data = {
    'model': model_final,
    'scaler_X': scaler_X_final,
    'scaler_y': scaler_y_final,
    'input_features': input_features,
    'target_features': target_features,
    'metrics': {
        'global': {
            'mae': round(float(avg_global_metrics['mae']), 4),
            'rmse': round(float(avg_global_metrics['rmse']), 4),
            'r2': round(float(avg_global_metrics['r2']), 4),
            'nrmse': round(float(avg_global_metrics['nrmse']), 4)
        },
        'per_target': final_target_metrics_dict
    }
}

joblib.dump(model_data, 'model.pkl')
print("\nModelo guardado exitosamente en 'model.pkl'")

import json
# Exportar pesos para PHP
weights = [w.tolist() for w in model_final.coefs_]
biases = [b.tolist() for b in model_final.intercepts_]

out_json = {
    'weights': weights,
    'biases': biases,
    'scaler_X': {
        'mean': scaler_X_final.mean_.tolist(),
        'scale': scaler_X_final.scale_.tolist()
    },
    'scaler_y': {
        'mean': scaler_y_final.mean_.tolist(),
        'scale': scaler_y_final.scale_.tolist()
    },
    'input_features': input_features,
    'target_features': target_features,
    'metrics': model_data['metrics']
}

json_path = os.path.join(os.path.dirname(__file__), 'model_weights.json')
with open(json_path, 'w') as f:
    json.dump(out_json, f, indent=4)

print(f"Pesos exportados exitosamente para PHP en '{json_path}'")

