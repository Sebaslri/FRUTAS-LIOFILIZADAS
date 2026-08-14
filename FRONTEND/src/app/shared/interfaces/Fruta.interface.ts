export interface Fruta {
    frutaId: number,
    nombreComun: string,
    nombreCientifico: string,
    descripcion: string,
    imagen: string | null,
    region: string,
    provincias: string[],
    promedioAcidez?: number | null,
    promedioFirmeza?: number | null,
    promedioGradosBrix?: number | null,
    promedioIndiceMadurez?: number | null,
    promedioCapAntInfusion?: number | null,
    promedioCapAntDigerido?: number | null,
    promedioBioaccCarotenoides?: number | null,
    promedioBioaccFlavonoides?: number | null,
    promedioBioaccAcAsc?: number | null,
    promedioAntocianinasFF?: number | null,
    promedioAntocianinasFL?: number | null,
    promedioCarotenoides?: number | null,
    promedioFenolesFF?: number | null,
    promedioFenolesFL?: number | null,
    promedioVitaminaC?: number | null,
    promedioDensidad?: number | null,
    promedioPh?: number | null,
    promedioColorL?: number | null,
    promedioColorA?: number | null,
    promedioColorB?: number | null,
    promedioHumedad?: number | null,
    promedioCenizas?: number | null,
    promedioDpphFF?: number | null;
    promedioDpphFL?: number | null;
    promedioFrapFF?: number | null;
    promedioFrapFL?: number | null;
    promedioFlavonoidesFF?: number | null;
    promedioFlavonoidesFL?: number | null;
    promedioActAntioxDpphInf22?: number | null;
    promedioActAntioxDpphInf90?: number | null;
    promedioFenolesTotalesInf22?: number | null;
    promedioFenolesTotalesInf90?: number | null;
    psDulzor?: number | null;
    psAcidez?: number | null;
    psAromaFrutal?: number | null;
    psColor?: number | null;
    psIntensidad?: number | null;
    psAceptacionGlobal?: number | null;
}
