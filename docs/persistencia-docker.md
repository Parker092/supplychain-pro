# Persistencia con Docker en SupplyChain Pro

## Propósito

Este documento explica cómo SupplyChain Pro utilizará persistencia de datos mediante volúmenes Docker. Este punto es central para el proyecto porque uno de los criterios principales de evaluación es que el sistema pueda retomar la simulación en el punto donde quedó después de un fallo general del host o reinicio de contenedores.

## Problema de persistencia

Los contenedores Docker son entornos efímeros. Si un contenedor se elimina y los datos solo estaban guardados dentro de su sistema de archivos interno, la información puede perderse.

En un sistema de trazabilidad logística, perder información de temperatura, humedad, ubicación o incidentes puede generar consecuencias graves. Por eso, la base de datos debe almacenar la información en un volumen persistente.

## Solución propuesta

PostgreSQL utilizará un volumen Docker para almacenar los archivos reales de la base de datos fuera del ciclo de vida del contenedor.

De esta forma:

- El contenedor puede detenerse.
- El contenedor puede reiniciarse.
- El contenedor puede recrearse.
- Los datos permanecen en el volumen.

## Información que debe persistir

El sistema debe conservar:

- Envíos registrados.
- Eventos históricos de telemetría.
- Último estado del envío.
- Incidentes de calidad.
- Marcas de tiempo.
- Coordenadas GPS.
- Valores de temperatura, humedad y batería.

## Tablas críticas

Las tablas más importantes para persistencia son:

- shipments.
- telemetry_events.
- shipment_state.
- quality_incidents.

## Volumen Docker

En desarrollo local se recomienda usar un volumen nombrado de Docker, por ejemplo:

supplychain_pg_data

Este volumen se conecta con la ruta interna de PostgreSQL:

/var/lib/postgresql/data

## Persistencia en despliegue

En un ambiente de presentación o despliegue cloud, también se puede usar un bind mount hacia una ruta fija del servidor:

/opt/supplychain/db-data

Esto permite identificar claramente dónde se almacenan los datos persistentes.

## Prueba obligatoria de persistencia

La prueba mínima debe seguir estos pasos:

1. Levantar los servicios con Docker Compose.
2. Esperar que el simulador envíe telemetría.
3. Consultar la tabla shipment_state.
4. Detener los contenedores con docker compose down.
5. Levantar nuevamente los contenedores.
6. Consultar otra vez shipment_state.
7. Confirmar que el último estado sigue disponible.

## Comandos conceptuales

Levantar servicios:

```bash
docker compose up --build
```

Consultar último estado:

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -c "SELECT * FROM shipment_state;"
```

Detener servicios:

```bash
docker compose down
```

Levantar servicios nuevamente:

```bash
docker compose up -d
```

Consultar datos otra vez:

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -c "SELECT * FROM shipment_state;"
```

## Diferencia entre down y down -v

Es importante distinguir entre estos comandos:

```bash
docker compose down
```

Este comando detiene y elimina contenedores, pero normalmente conserva los volúmenes.

```bash
docker compose down -v
```

Este comando elimina contenedores y también elimina volúmenes asociados. Si se usa, los datos de PostgreSQL pueden perderse.

## Riesgos

- Ejecutar accidentalmente docker compose down -v.
- No definir correctamente el volumen en docker-compose.yml.
- Guardar información crítica dentro del contenedor en lugar del volumen.
- Usar rutas de montaje incorrectas.
- No probar recuperación antes de la presentación.

## Medidas de mitigación

- Documentar claramente el uso de volúmenes.
- Evitar usar down -v salvo para reiniciar desde cero.
- Crear scripts separados para detener y resetear.
- Probar persistencia antes de la entrega.
- Verificar que PostgreSQL use /var/lib/postgresql/data como ruta persistente.

## Relación con la arquitectura

La persistencia con Docker permite que la arquitectura sea resiliente ante reinicios básicos. Aunque no representa alta disponibilidad completa, sí demuestra una decisión arquitectónica adecuada para conservar datos críticos en un sistema distribuido contenerizado.

## Conclusión

El uso de volúmenes Docker es un elemento central en SupplyChain Pro. Permite garantizar que la evidencia de trazabilidad no se pierda cuando los contenedores se detienen o reinician, cumpliendo uno de los criterios más importantes de evaluación del proyecto.
