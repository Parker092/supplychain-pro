# Pruebas de presentación - SupplyChain Pro

## Prueba de persistencia y recuperación

### Objetivo

Validar que el sistema conserva la información crítica del viaje aunque los contenedores se detengan y se levanten nuevamente.

Esta prueba responde a uno de los requisitos principales del proyecto: el sistema debe ser capaz de recuperar el último estado conocido del camión virtual después de un fallo general del host o reinicio de los servicios.

## Componentes involucrados

- PostgreSQL
- Docker Volume
- Backend Node.js
- Simulador de telemetría
- Docker Compose

## Tabla principal de validación

La tabla utilizada para validar recuperación es:

```text
shipment_state
```

Esta tabla conserva el último estado conocido de cada envío:

- Última secuencia procesada
- Última latitud
- Última longitud
- Última temperatura
- Última humedad
- Último nivel de batería
- Fecha y hora de actualización

## Comando para levantar el sistema

```bash
docker compose up --build
```

## Comando para verificar servicios activos

```bash
docker compose ps
```

Resultado esperado:

```text
supplychainpro-db          Up / healthy
supplychainpro-backend     Up
supplychainpro-simulator   Up
```

## Comando para verificar último estado antes del reinicio

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -c "SELECT * FROM shipment_state;"
```

También puede ejecutarse el script:

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -f /docker-entrypoint-initdb.d/scripts/check_persistence.sql
```

## Apagar contenedores sin eliminar volúmenes

```bash
docker compose down
```

Este comando detiene y elimina los contenedores, pero conserva los volúmenes de Docker.

## Validar que el volumen sigue existiendo

```bash
docker volume ls
```

Debe aparecer un volumen relacionado con el proyecto, por ejemplo:

```text
supplychain-pro_supplychain_pg_data
```

El nombre puede variar según el nombre de la carpeta local del proyecto.

## Levantar nuevamente el sistema

```bash
docker compose up -d
```

## Consultar nuevamente el último estado

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -f /docker-entrypoint-initdb.d/scripts/check_persistence.sql
```

## Resultado esperado

El sistema debe mostrar nuevamente el último estado del envío registrado antes del apagado.

Esto demuestra que:

- PostgreSQL conserva los datos.
- El volumen Docker no fue eliminado.
- La telemetría no se pierde al reiniciar contenedores.
- El backend puede seguir consultando el último estado del viaje.
- La arquitectura cumple el requisito de recuperación después de fallo.

## Prueba fuerte de persistencia

La prueba fuerte consiste en apagar los servicios, listar los volúmenes y levantar nuevamente el sistema.

```bash
docker compose down
docker volume ls
docker compose up -d
```

Mientras no se ejecute el siguiente comando, los datos deben mantenerse:

```bash
docker compose down -v
```

## Advertencia importante

El comando siguiente elimina los volúmenes y borra la base de datos persistida:

```bash
docker compose down -v
```

Este comando solo debe usarse en desarrollo cuando se quiere reiniciar completamente la base de datos.

No debe usarse durante la prueba de persistencia de la presentación.

## Interpretación arquitectónica

La persistencia se garantiza mediante un volumen Docker asociado al servicio PostgreSQL.

En el archivo `docker-compose.yml`, el servicio `db` utiliza el volumen:

```yaml
volumes:
  - supplychain_pg_data:/var/lib/postgresql/data
```

Este volumen desacopla los datos del ciclo de vida del contenedor. Por eso, aunque el contenedor de PostgreSQL sea detenido o recreado, los datos permanecen almacenados en el volumen.

## Validación adicional: incidentes persistentes

Además de `shipment_state`, también debe demostrarse que los incidentes críticos persisten después de reiniciar los contenedores.

Comando:

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -f /docker-entrypoint-initdb.d/scripts/check_incidents.sql
```

Resultado esperado:

```text
COLD_CHAIN_BREACH | CRITICAL
```

Esto confirma que el sistema no solo conserva el estado operativo del viaje, sino también la evidencia crítica asociada a incumplimientos de cadena de frío.

## Validación de inmutabilidad de incidentes

Para comprobar que los incidentes registrados no pueden modificarse ni eliminarse, se debe entrar a PostgreSQL:

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db
```

Luego ejecutar:

```sql
UPDATE quality_incidents SET severity = 'LOW';
```

Resultado esperado:

```text
ERROR: quality_incidents records are immutable and cannot be modified or deleted
```

También se puede probar:

```sql
DELETE FROM quality_incidents;
```

Resultado esperado:

```text
ERROR: quality_incidents records are immutable and cannot be modified or deleted
```

Esta prueba demuestra que la protección de incidentes se aplica directamente en la base de datos mediante triggers, no solo desde la lógica del backend.

## Flujo corto para la presentación

### Paso 1: levantar arquitectura

```bash
docker compose up --build
```

### Paso 2: verificar servicios

```bash
docker compose ps
```

### Paso 3: revisar último estado registrado

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -f /docker-entrypoint-initdb.d/scripts/check_persistence.sql
```

### Paso 4: revisar incidentes registrados

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -f /docker-entrypoint-initdb.d/scripts/check_incidents.sql
```

### Paso 5: apagar contenedores sin borrar volúmenes

```bash
docker compose down
```

### Paso 6: confirmar que el volumen sigue existiendo

```bash
docker volume ls | grep supplychain
```

### Paso 7: levantar nuevamente

```bash
docker compose up -d
```

### Paso 8: consultar nuevamente el último estado

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -f /docker-entrypoint-initdb.d/scripts/check_persistence.sql
```

### Paso 9: consultar nuevamente incidentes

```bash
docker exec -it supplychainpro-db psql -U supplychain -d supplychain_db -f /docker-entrypoint-initdb.d/scripts/check_incidents.sql
```

## Conclusión de la prueba

La prueba confirma que SupplyChain Pro puede recuperar el último estado conocido del transporte después de un reinicio de servicios.

Esto es esencial en un sistema de trazabilidad logística, ya que la pérdida de datos de temperatura, humedad o ubicación podría afectar la responsabilidad operativa y legal de la empresa.

Desde el punto de vista de Diseño de Arquitectura de Sistemas, esta prueba valida tres atributos de calidad:

- Persistencia de datos.
- Recuperabilidad ante fallos.
- Integridad de evidencia crítica.

La arquitectura logra esto mediante PostgreSQL, volúmenes persistentes de Docker, separación de servicios y reglas de inmutabilidad implementadas directamente en la base de datos.
