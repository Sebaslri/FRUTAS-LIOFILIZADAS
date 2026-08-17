<?php

declare(strict_types=1);

class Fruta
{
    private PDO $conn;
    private string $table = 'fruta';

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function listar(): array
    {
        $query = "SELECT f.frutaId, f.nombreComun, f.nombreCientifico, f.descripcion, f.imagen,
                         GROUP_CONCAT(DISTINCT r.descripcion ORDER BY r.regionId SEPARATOR ', ') AS region,
                         GROUP_CONCAT(DISTINCT p.descripcion ORDER BY p.provinciaId SEPARATOR '||') AS provincias
                  FROM {$this->table} f
                  LEFT JOIN frutaprovincia fp ON fp.frutaId = f.frutaId
                  LEFT JOIN provincia p ON p.provinciaId = fp.provinciaId
                  LEFT JOIN region r ON r.regionId = p.regionId
                  GROUP BY f.frutaId, f.nombreComun, f.nombreCientifico, f.descripcion, f.imagen
                  ORDER BY f.frutaId";

        return $this->normalizarUbicacion($this->conn->query($query)->fetchAll());
    }

    public function frutaPorId(int $frutaId): array
    {
        $query = "SELECT f.frutaId, f.nombreComun, f.nombreCientifico, f.descripcion, f.imagen,
                         GROUP_CONCAT(DISTINCT r.descripcion ORDER BY r.regionId SEPARATOR ', ') AS region,
                         GROUP_CONCAT(DISTINCT p.descripcion ORDER BY p.provinciaId SEPARATOR '||') AS provincias
                  FROM {$this->table} f
                  LEFT JOIN frutaprovincia fp ON fp.frutaId = f.frutaId
                  LEFT JOIN provincia p ON p.provinciaId = fp.provinciaId
                  LEFT JOIN region r ON r.regionId = p.regionId
                  WHERE f.frutaId = :frutaId
                  GROUP BY f.frutaId, f.nombreComun, f.nombreCientifico, f.descripcion, f.imagen
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':frutaId', $frutaId, PDO::PARAM_INT);
        $stmt->execute();

        $fruta = $stmt->fetch(PDO::FETCH_ASSOC);

        return $this->normalizarUbicacion($fruta ? [$fruta] : [])[0] ?? [];
    }

    public function listarMapaBioactivo(): array
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
                         propertyAverages.promedioAntocianinasFF,
                         propertyAverages.promedioAntocianinasFL,
                         propertyAverages.promedioCarotenoides,
                         propertyAverages.promedioFenolesFF,
                         propertyAverages.promedioFenolesFL,
                         propertyAverages.promedioVitaminaC,
                         propertyAverages.promedioCapAntInfusion,
                         propertyAverages.promedioCapAntDigerido,
                         propertyAverages.promedioCarotenoidesInfusion,
                         propertyAverages.promedioCarotenoidesDigerido,
                         propertyAverages.promedioFlavonoidesInfusion,
                         propertyAverages.promedioFlavonoidesDigerido,
                         propertyAverages.promedioAcidoAscInfusion,
                         propertyAverages.promedioAcidoAscDigerido,
                         propertyAverages.promedioBioaccFlavonoides,
                         propertyAverages.promedioAcidez,
                         propertyAverages.promedioFirmeza,
                         propertyAverages.promedioGradosBrix,
                         propertyAverages.promedioIndiceMadurez,
                         propertyAverages.promedioBioaccCarotenoides,
                         propertyAverages.promedioBioaccAcAsc,
                         propertyAverages.promedioHumedad,
                         propertyAverages.promedioPh,
                         propertyAverages.promedioColorL,
                         propertyAverages.promedioColorA,
                         propertyAverages.promedioColorB,
                         propertyAverages.promedioDpphFF,
                         propertyAverages.promedioDpphFL,
                         propertyAverages.promedioFrapFF,
                         propertyAverages.promedioFrapFL,
                         propertyAverages.promedioFlavonoidesFF,
                         propertyAverages.promedioFlavonoidesFL,
                         propertyAverages.promedioActAntioxDpphInf22,
                         propertyAverages.promedioActAntioxDpphInf90,
                         propertyAverages.promedioFenolesTotalesInf22,
                         propertyAverages.promedioFenolesTotalesInf90
                  FROM {$this->table} f
                  LEFT JOIN frutaprovincia fp ON fp.frutaId = f.frutaId
                  LEFT JOIN provincia p ON p.provinciaId = fp.provinciaId
                  LEFT JOIN region r ON r.regionId = p.regionId
                  LEFT JOIN perfilsensorial ps ON ps.frutaId = f.frutaId
                  LEFT JOIN (
                    SELECT fp2.frutaId,
                           AVG(prop.antocianinas_FF) AS promedioAntocianinasFF,
                           AVG(prop.antocianinas_FL) AS promedioAntocianinasFL,
                           AVG(prop.bioacc_carotenoides) AS promedioCarotenoides,
                           AVG(prop.fenolesTotales_FF) AS promedioFenolesFF,
                           AVG(prop.fenolesTotales_FL) AS promedioFenolesFL,
                           AVG(prop.bioacc_acAsc) AS promedioVitaminaC,
                           AVG(prop.cap_ant_infusion) AS promedioCapAntInfusion,
                           AVG(prop.cap_ant_digerido) AS promedioCapAntDigerido,
                           AVG(prop.carotenoides_infusion) AS promedioCarotenoidesInfusion,
                           AVG(prop.carotenoides_digerido) AS promedioCarotenoidesDigerido,
                           AVG(prop.flavonoides_infusion) AS promedioFlavonoidesInfusion,
                           AVG(prop.flavonoides_digerido) AS promedioFlavonoidesDigerido,
                           AVG(prop.acido_asc_infusion) AS promedioAcidoAscInfusion,
                           AVG(prop.acido_asc_digerido) AS promedioAcidoAscDigerido,
                           AVG(prop.bioacc_flavonoides) AS promedioBioaccFlavonoides,
                           AVG(prop.dpph_FF) AS promedioDpphFF,
                           AVG(prop.dpph_FL) AS promedioDpphFL,
                           AVG(prop.frap_FF) AS promedioFrapFF,
                           AVG(prop.frap_FL) AS promedioFrapFL,
                           AVG(prop.flavonoides_FF) AS promedioFlavonoidesFF,
                           AVG(prop.flavonoides_FL) AS promedioFlavonoidesFL,
                           AVG(prop.ActAntiox_dpph_inf22) AS promedioActAntioxDpphInf22,
                           AVG(prop.ActAntiox_dpph_inf90) AS promedioActAntioxDpphInf90,
                           AVG(prop.fenolesTotales_inf22) AS promedioFenolesTotalesInf22,
                           AVG(prop.fenolesTotales_inf90) AS promedioFenolesTotalesInf90,
                           AVG(prop.acidez) AS promedioAcidez,
                           AVG(prop.firmeza) AS promedioFirmeza,
                           AVG(prop.gradosBrix) AS promedioGradosBrix,
                           AVG(prop.indiceMadurez) AS promedioIndiceMadurez,
                           AVG(prop.bioacc_carotenoides) AS promedioBioaccCarotenoides,
                           AVG(prop.bioacc_acAsc) AS promedioBioaccAcAsc,
                           AVG(prop.humedad) AS promedioHumedad,
                           AVG(prop.pH) AS promedioPh,
                           AVG(prop.L) AS promedioColorL,
                           AVG(prop.a) AS promedioColorA,
                           AVG(prop.b) AS promedioColorB
                    FROM frutapropiedad fp2
                    INNER JOIN propiedades prop ON prop.propiedadId = fp2.propiedadId
                    GROUP BY fp2.frutaId
                  ) propertyAverages ON propertyAverages.frutaId = f.frutaId
                  GROUP BY f.frutaId, f.nombreComun, f.nombreCientifico, f.descripcion, f.imagen,
                           ps.dulzor, ps.acidez, ps.aromaFrutal, ps.color, ps.intensidad, ps.aceptacionGlobal,
                           propertyAverages.promedioAntocianinasFF, propertyAverages.promedioAntocianinasFL,
                           propertyAverages.promedioCarotenoides, propertyAverages.promedioFenolesFF,
                           propertyAverages.promedioFenolesFL, propertyAverages.promedioVitaminaC,
                           propertyAverages.promedioCapAntInfusion,
                           propertyAverages.promedioCapAntDigerido,
                           propertyAverages.promedioCarotenoidesInfusion,
                           propertyAverages.promedioCarotenoidesDigerido,
                           propertyAverages.promedioFlavonoidesInfusion,
                           propertyAverages.promedioFlavonoidesDigerido,
                           propertyAverages.promedioAcidoAscInfusion,
                           propertyAverages.promedioAcidoAscDigerido,
                           propertyAverages.promedioBioaccFlavonoides,
                           propertyAverages.promedioAcidez,
                           propertyAverages.promedioFirmeza,
                           propertyAverages.promedioGradosBrix,
                           propertyAverages.promedioIndiceMadurez,
                           propertyAverages.promedioBioaccCarotenoides,
                           propertyAverages.promedioBioaccAcAsc,
                           propertyAverages.promedioHumedad,
                           propertyAverages.promedioPh,
                           propertyAverages.promedioColorL,
                           propertyAverages.promedioColorA,
                           propertyAverages.promedioColorB,
                           propertyAverages.promedioDpphFF,
                           propertyAverages.promedioDpphFL,
                           propertyAverages.promedioFrapFF,
                           propertyAverages.promedioFrapFL,
                           propertyAverages.promedioFlavonoidesFF,
                           propertyAverages.promedioFlavonoidesFL,
                           propertyAverages.promedioActAntioxDpphInf22,
                           propertyAverages.promedioActAntioxDpphInf90,
                           propertyAverages.promedioFenolesTotalesInf22,
                           propertyAverages.promedioFenolesTotalesInf90
                  ORDER BY f.frutaId";

        return $this->normalizarUbicacion($this->conn->query($query)->fetchAll());
    }

    /**
     * Obtiene las propiedades compartidas por dos o más frutas.
     * En la base de datos cada propiedad compartida representa un mix:
     * varias filas de frutapropiedad apuntan al mismo propiedadId.
     */
    public function listarMixes(): array
    {
        $query = "SELECT 
                      MIN(m.propiedadId) AS mixId,
                      CONCAT('Mix ', MIN(m.propiedadId)) AS nombre,
                      m.frutaIds,
                      m.frutas,
                      m.imagen,
                      AVG(prop.densidad) AS densidad,
                      AVG(prop.gradosBrix) AS gradosBrix,
                      AVG(prop.acidez) AS acidez,
                      AVG(prop.indiceMadurez) AS indiceMadurez,
                      AVG(prop.pH) AS pH,
                      AVG(prop.L) AS L,
                      AVG(prop.a) AS a,
                      AVG(prop.b) AS b,
                      AVG(prop.firmeza) AS firmeza,
                      AVG(prop.humedad) AS humedad,
                      AVG(prop.cenizas) AS cenizas,
                      AVG(prop.dpph_FF) AS dpph_FF,
                      AVG(prop.fenolesTotales_FF) AS fenolesTotales_FF,
                      AVG(prop.frap_FF) AS frap_FF,
                      AVG(prop.flavonoides_FF) AS flavonoides_FF,
                      AVG(prop.antocianinas_FF) AS antocianinas_FF,
                      AVG(prop.dpph_FL) AS dpph_FL,
                      AVG(prop.frap_FL) AS frap_FL,
                      AVG(prop.fenolesTotales_FL) AS fenolesTotales_FL,
                      AVG(prop.flavonoides_FL) AS flavonoides_FL,
                      AVG(prop.antocianinas_FL) AS antocianinas_FL,
                      AVG(prop.cap_ant_infusion) AS cap_ant_infusion,
                      AVG(prop.cap_ant_digerido) AS cap_ant_digerido,
                      AVG(prop.carotenoides_infusion) AS carotenoides_infusion,
                      AVG(prop.carotenoides_digerido) AS carotenoides_digerido,
                      AVG(prop.flavonoides_infusion) AS flavonoides_infusion,
                      AVG(prop.flavonoides_digerido) AS flavonoides_digerido,
                      AVG(prop.acido_asc_infusion) AS acido_asc_infusion,
                      AVG(prop.acido_asc_digerido) AS acido_asc_digerido,
                      AVG(prop.bioacc_carotenoides) AS bioacc_carotenoides,
                      AVG(prop.bioacc_flavonoides) AS bioacc_flavonoides,
                      AVG(prop.bioacc_acAsc) AS bioacc_acAsc,
                      AVG(prop.ActAntiox_dpph_inf22) AS ActAntiox_dpph_inf22,
                      AVG(prop.ActAntiox_dpph_inf90) AS ActAntiox_dpph_inf90,
                      AVG(prop.fenolesTotales_inf22) AS fenolesTotales_inf22,
                      AVG(prop.fenolesTotales_inf90) AS fenolesTotales_inf90
                  FROM (
                      SELECT fp.propiedadId,
                             GROUP_CONCAT(DISTINCT f.frutaId ORDER BY f.frutaId SEPARATOR ',') AS frutaIds,
                             GROUP_CONCAT(DISTINCT f.nombreComun ORDER BY f.frutaId SEPARATOR ' + ') AS frutas,
                             SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT f.imagen ORDER BY f.frutaId SEPARATOR '||'), '||', 1) AS imagen,
                             COUNT(DISTINCT fp.frutaId) as num_frutas
                      FROM frutapropiedad fp
                      INNER JOIN fruta f ON f.frutaId = fp.frutaId
                      GROUP BY fp.propiedadId
                      HAVING num_frutas > 1
                  ) m
                  INNER JOIN propiedades prop ON prop.propiedadId = m.propiedadId
                  GROUP BY m.frutaIds, m.frutas, m.imagen
                  ORDER BY mixId";

        $mixes = $this->conn->query($query)->fetchAll();

        return array_map(static function (array $mix): array {
            $mix['frutaIds'] = !empty($mix['frutaIds'])
                ? array_map('intval', explode(',', (string) $mix['frutaIds']))
                : [];
            return $mix;
        }, $mixes);
    }

    private function normalizarUbicacion(array $frutas): array
    {
        return array_map(static function (array $fruta): array {
            $fruta['region'] = $fruta['region'] ?? 'Sin región registrada';
            $fruta['provincias'] = !empty($fruta['provincias'])
                ? explode('||', (string) $fruta['provincias'])
                : [];

            return $fruta;
        }, $frutas);
    }
    public function listarPropiedadesRaw(): array
    {
        $query = "SELECT fp.frutaId, p.* FROM frutapropiedad fp JOIN propiedades p ON fp.propiedadId = p.propiedadId";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
