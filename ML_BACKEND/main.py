from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import os

app = FastAPI(title="FrutasApp ML API (Red Neuronal)")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar el modelo pre-entrenado
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
if os.path.exists(model_path):
    model_data = joblib.load(model_path)
    model = model_data['model']
    scaler_X = model_data.get('scaler_X')
    scaler_y = model_data.get('scaler_y')
    input_features = model_data['input_features']
    target_features = model_data['target_features']
    metrics = model_data['metrics']
else:
    raise RuntimeError("El archivo model.pkl no existe. Ejecuta train_model.py primero.")

class MixRequest(BaseModel):
    fruit_ids: List[int]
    properties_list: List[dict] = None


class MetricValues(BaseModel):
    mae: float
    rmse: float
    r2: float
    nrmse: float

class TargetMetrics(BaseModel):
    cap_ant_digerido: MetricValues
    bioacc_carotenoides: MetricValues
    bioacc_flavonoides: MetricValues
    bioacc_acAsc: MetricValues

class ModelMetrics(BaseModel):
    global_metrics: MetricValues
    per_target: TargetMetrics

class PredictionResponse(BaseModel):
    capacidad_antioxidante: float
    carotenoides: float
    flavonoides: float
    acido_ascorbico: float
    metrics: ModelMetrics

def get_fruit_properties_from_db(fruit_ids: List[int]):
    """Extrae las propiedades químicas de las frutas llamando a la API de PHP en InfinityFree."""
    try:
        import requests
        # Llama a tu propia API en vivo (PHP) para obtener los datos más recientes
        api_url = os.getenv("API_URL", "https://frutas-backend.onrender.com")
        response = requests.get(f"{api_url}/api/frutas.php?accion=propiedades")
        if response.status_code == 200:
            data = response.json()
            if data.get("isSuccess"):
                all_properties = data.get("data", [])
                # Filtrar solo las frutas solicitadas
                results = [prop for prop in all_properties if prop.get('frutaId') in fruit_ids]
                return results
    except Exception as e:
        print(f"Error HTTP obteniendo propiedades: {e}")
    return []

from fastapi.responses import FileResponse

@app.get("/model-plot")
def get_model_plot():
    """Devuelve la gráfica de evaluación del modelo."""
    plot_path = os.path.join(os.path.dirname(__file__), 'evaluation_plot.png')
    if os.path.exists(plot_path):
        return FileResponse(plot_path, media_type="image/png")
    else:
        raise HTTPException(status_code=404, detail="El gráfico no ha sido generado aún.")

@app.post("/predict-mix", response_model=PredictionResponse)
def predict_mix(request: MixRequest):
    """
    Predice las propiedades de la mezcla utilizando la Red Neuronal (MLP) pre-entrenada.
    """
    if not request.fruit_ids:
        raise HTTPException(status_code=400, detail="Debe enviar al menos el ID de una fruta")
        
    properties_list = request.properties_list
    if not properties_list:
        properties_list = get_fruit_properties_from_db(request.fruit_ids)
    
    if not properties_list:
        raise HTTPException(status_code=404, detail="No se encontraron las propiedades para esas frutas en la BD")
        
    # Extraer y promediar los input features de las frutas seleccionadas
    inputs_matrix = []
    for prop in properties_list:
        row = []
        for feature in input_features:
            val = prop.get(feature)
            row.append(float(val) if val is not None else 0.0)
        inputs_matrix.append(row)
        
    # El vector de entrada para la red neuronal será el promedio de las frutas
    avg_inputs = np.mean(inputs_matrix, axis=0)
    
    # Hacer la inferencia (predicción) con soporte para scalers
    if scaler_X and scaler_y:
        avg_inputs_scaled = scaler_X.transform([avg_inputs])
        prediction_scaled = model.predict(avg_inputs_scaled)
        prediction = scaler_y.inverse_transform(prediction_scaled)[0]
    else:
        # Fallback para modelos antiguos sin scaler (por si acaso)
        prediction = model.predict([avg_inputs])[0]
    
    # Mapear los resultados a las salidas esperadas
    return PredictionResponse(
        capacidad_antioxidante=round(float(prediction[0]), 2),
        carotenoides=round(float(prediction[1]), 2),
        flavonoides=round(float(prediction[2]), 2),
        acido_ascorbico=round(float(prediction[3]), 2),
        metrics=ModelMetrics(
            global_metrics=MetricValues(**metrics['global']),
            per_target=TargetMetrics(
                cap_ant_digerido=MetricValues(**metrics['per_target']['cap_ant_digerido']),
                bioacc_carotenoides=MetricValues(**metrics['per_target']['bioacc_carotenoides']),
                bioacc_flavonoides=MetricValues(**metrics['per_target']['bioacc_flavonoides']),
                bioacc_acAsc=MetricValues(**metrics['per_target']['bioacc_acAsc'])
            )
        )
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
