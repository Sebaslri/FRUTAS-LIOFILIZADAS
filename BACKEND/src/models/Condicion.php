<?php

declare(strict_types=1);

class Condicion
{
    private PDO $conn;
    private string $table = 'condicion';

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function listar(): array
    {
        $query = "SELECT condicionId, nombre, descripcion
                  FROM {$this->table}
                  ORDER BY descripcion";

        return $this->conn->query($query)->fetchAll();
    }

    public function frutasPorCondicion(int $condicionId): array
    {
        $query = "SELECT f.frutaId, f.nombreComun, f.nombreCientifico, f.descripcion, f.imagen,
                         GROUP_CONCAT(DISTINCT r.descripcion ORDER BY r.regionId SEPARATOR ', ') AS region,
                         GROUP_CONCAT(DISTINCT p.descripcion ORDER BY p.provinciaId SEPARATOR '||') AS provincias,
                         ps.dulzor as psDulzor,
                         ps.acidez as psAcidez,
                         ps.aromaFrutal as psAromaFrutal,
                         ps.color as psColor,
                         ps.intensidad as psIntensidad,
                         ps.aceptacionGlobal as psAceptacionGlobal,
                         propertyAverages.promedioAcidez,
                         propertyAverages.promedioFirmeza,
                         propertyAverages.promedioGradosBrix,
                         propertyAverages.promedioIndiceMadurez,
                         propertyAverages.promedioCapAntInfusion,
                         propertyAverages.promedioCapAntDigerido,
                         propertyAverages.promedioBioaccCarotenoides,
                         propertyAverages.promedioBioaccFlavonoides,
                         propertyAverages.promedioBioaccAcAsc,
                         propertyAverages.promedioDensidad,
                         propertyAverages.promedioPh,
                         propertyAverages.promedioColorL,
                         propertyAverages.promedioColorA,
                         propertyAverages.promedioColorB,
                         propertyAverages.promedioHumedad,
                         propertyAverages.promedioCenizas,
                         propertyAverages.promedioDpphFF,
                         propertyAverages.promedioDpphFL,
                         propertyAverages.promedioFrapFF,
                         propertyAverages.promedioFrapFL,
                         propertyAverages.promedioFenolesFF,
                         propertyAverages.promedioFenolesFL,
                         propertyAverages.promedioFlavonoidesFF,
                         propertyAverages.promedioFlavonoidesFL,
                         propertyAverages.promedioAntocianinasFF,
                         propertyAverages.promedioAntocianinasFL
                  FROM fruta f
                  INNER JOIN frutacondicion fc ON fc.frutaId = f.frutaId
                  LEFT JOIN frutaprovincia fp ON fp.frutaId = f.frutaId
                  LEFT JOIN provincia p ON p.provinciaId = fp.provinciaId
                  LEFT JOIN region r ON r.regionId = p.regionId
                  LEFT JOIN perfilsensorial ps ON ps.frutaId = f.frutaId
                  LEFT JOIN (
                    SELECT fp2.frutaId,
                           AVG(prop.acidez) AS promedioAcidez,
                           AVG(prop.firmeza) AS promedioFirmeza,
                           AVG(prop.gradosBrix) AS promedioGradosBrix,
                           AVG(prop.indiceMadurez) AS promedioIndiceMadurez,
                           AVG(prop.cap_ant_infusion) AS promedioCapAntInfusion,
                           AVG(prop.cap_ant_digerido) AS promedioCapAntDigerido,
                           AVG(prop.bioacc_carotenoides) AS promedioBioaccCarotenoides,
                           AVG(prop.bioacc_flavonoides) AS promedioBioaccFlavonoides,
                           AVG(prop.bioacc_acAsc) AS promedioBioaccAcAsc,
                           AVG(prop.densidad) AS promedioDensidad,
                           AVG(prop.pH) AS promedioPh,
                           AVG(prop.L) AS promedioColorL,
                           AVG(prop.a) AS promedioColorA,
                           AVG(prop.b) AS promedioColorB,
                           AVG(prop.humedad) AS promedioHumedad,
                           AVG(prop.cenizas) AS promedioCenizas,
                           AVG(prop.dpph_FF) AS promedioDpphFF,
                           AVG(prop.dpph_FL) AS promedioDpphFL,
                           AVG(prop.frap_FF) AS promedioFrapFF,
                           AVG(prop.frap_FL) AS promedioFrapFL,
                           AVG(prop.fenolesTotales_FF) AS promedioFenolesFF,
                           AVG(prop.fenolesTotales_FL) AS promedioFenolesFL,
                           AVG(prop.flavonoides_FF) AS promedioFlavonoidesFF,
                           AVG(prop.flavonoides_FL) AS promedioFlavonoidesFL,
                           AVG(prop.antocianinas_FF) AS promedioAntocianinasFF,
                           AVG(prop.antocianinas_FL) AS promedioAntocianinasFL
                    FROM frutapropiedad fp2
                    INNER JOIN propiedades prop ON prop.propiedadId = fp2.propiedadId
                    GROUP BY fp2.frutaId
                  ) propertyAverages ON propertyAverages.frutaId = f.frutaId
                  WHERE fc.condicionId = :condicionId
                  GROUP BY f.frutaId, f.nombreComun, f.nombreCientifico, f.descripcion, f.imagen,
                           ps.dulzor, ps.acidez, ps.aromaFrutal, ps.color, ps.intensidad, ps.aceptacionGlobal,
                           propertyAverages.promedioAcidez, propertyAverages.promedioFirmeza,
                           propertyAverages.promedioGradosBrix, propertyAverages.promedioIndiceMadurez,
                           propertyAverages.promedioCapAntInfusion, propertyAverages.promedioCapAntDigerido,
                           propertyAverages.promedioBioaccCarotenoides, propertyAverages.promedioBioaccFlavonoides,
                           propertyAverages.promedioBioaccAcAsc, propertyAverages.promedioDensidad,
                           propertyAverages.promedioPh, propertyAverages.promedioColorL,
                           propertyAverages.promedioColorA, propertyAverages.promedioColorB,
                           propertyAverages.promedioHumedad, propertyAverages.promedioCenizas,
                           propertyAverages.promedioDpphFF, propertyAverages.promedioDpphFL,
                           propertyAverages.promedioFrapFF, propertyAverages.promedioFrapFL,
                           propertyAverages.promedioFenolesFF, propertyAverages.promedioFenolesFL,
                           propertyAverages.promedioFlavonoidesFF, propertyAverages.promedioFlavonoidesFL,
                           propertyAverages.promedioAntocianinasFF, propertyAverages.promedioAntocianinasFL
                  ORDER BY f.frutaId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':condicionId', $condicionId, PDO::PARAM_INT);
        $stmt->execute();

        return array_map(static function (array $fruta): array {
            $fruta['region'] = $fruta['region'] ?? 'Sin región registrada';
            $fruta['provincias'] = !empty($fruta['provincias'])
                ? explode('||', (string) $fruta['provincias'])
                : [];

            return $fruta;
        }, $stmt->fetchAll());
    }
}
