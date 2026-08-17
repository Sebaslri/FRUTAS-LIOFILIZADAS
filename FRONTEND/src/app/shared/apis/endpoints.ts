import { HttpHeaders } from "@angular/common/http"
import { environment } from "../../environments/environment";

export const endpoint = {
    //AUTH MODULE
    LOGIN: "api/auth.php?accion=login",
    REGISTER: "api/auth.php?accion=register",
    LOGOUT: "api/auth.php?accion=logout",

    //FRUTAS MODULE
    LIST_FRUITS: "api/frutas.php?accion=listar",
    FRUIT_BY_ID: "api/frutas.php?accion=frutaPorId&Id=",
    BIOACTIVE_MAP: "api/frutas.php?accion=mapaBioactivo",
    LIST_MIXES: "api/frutas.php?accion=mixes",
    PREDICT_MIX: environment.mlApi + "predict-mix",
    MODEL_PLOT: environment.mlApi + "model-plot",

    // CONDITIONS MODULE
    LIST_CONDITIONS: "api/condiciones.php?accion=listar",
    FRUITS_BY_CONDITION: "api/condiciones.php?accion=frutasPorCondicion&Id=",

    // PROFILE MODULE
    PROFILE: "api/profile.php"
}



export const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json"
    }),
    withCredentials: true

}
