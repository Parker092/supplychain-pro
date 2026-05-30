# Requerimientos del Proyecto SupplyChain Pro

## Nombre del proyecto

SupplyChain Pro – Trazabilidad Crítica de Mercancía Perecedera

## Materia

Diseño de Arquitectura de Sistemas

## Propósito académico

El proyecto SupplyChain Pro se desarrolla como una propuesta de arquitectura de sistemas distribuida orientada a resolver un problema empresarial de trazabilidad logística. Su finalidad académica es demostrar el diseño, separación de responsabilidades, persistencia de datos, comunicación entre servicios, resiliencia ante fallos, control de red y automatización básica mediante integración continua.

El enfoque principal no es construir una aplicación comercial completa, sino diseñar e implementar una arquitectura funcional que permita validar decisiones técnicas relacionadas con disponibilidad, integridad de datos, aislamiento de servicios y recuperación del sistema después de incidentes operativos.

## Problema empresarial

Una exportadora de alimentos necesita garantizar que la cadena de frío de sus productos perecederos no se rompa durante el transporte terrestre. Para ello, requiere registrar evidencia técnica de temperatura, humedad, ubicación GPS y estado del dispositivo de monitoreo durante todo el recorrido.

Si la temperatura supera el umbral permitido, el sistema debe registrar un incidente de calidad inmutable. Este registro es importante porque la pérdida, alteración o ausencia de información puede generar pérdidas económicas, incumplimientos contractuales, responsabilidad legal y deterioro del producto transportado.

## Objetivo general

Diseñar una arquitectura de software distribuida basada en contenedores Docker que permita monitorear un envío refrigerado mediante telemetría simulada, registrar eventos en una base de datos persistente, detectar incidentes críticos y recuperar el último estado del viaje después de un reinicio del sistema.

## Objetivos específicos

- Definir una arquitectura por servicios separados para frontend, backend, simulador y base de datos.
- Implementar persistencia de datos mediante PostgreSQL y volúmenes de Docker.
- Recibir telemetría generada por un camión virtual.
- Registrar temperatura, humedad, batería y coordenadas GPS.
- Detectar ruptura de cadena de frío cuando la temperatura supere el umbral permitido.
- Generar incidentes de calidad inmutables.
- Aislar el simulador y la base de datos de accesos externos directos.
- Validar que el sistema pueda recuperar el último estado registrado después de reiniciar los contenedores.
- Incorporar un pipeline de integración continua con GitHub Actions.

## Alcance técnico mínimo

La primera versión funcional del sistema incluirá cuatro componentes principales:

- Frontend en Next.js.
- Backend en Node.js.
- Simulador de telemetría en Node.js.
- Base de datos PostgreSQL.

El sistema deberá registrar envíos refrigerados, recibir telemetría desde un camión virtual, guardar temperatura, humedad, batería y ubicación, detectar ruptura de cadena de frío, generar incidentes inmutables y recuperar el último estado del viaje después de reiniciar los contenedores.

## Funcionalidades incluidas

### Registro de envíos refrigerados

El sistema deberá contar con al menos un envío refrigerado registrado en la base de datos. Este envío funcionará como entidad principal sobre la cual se asociarán los eventos de telemetría, el último estado conocido y los incidentes detectados.

Datos mínimos del envío:

- Código del envío.
- Producto transportado.
- Origen.
- Destino.
- Temperatura máxima permitida.
- Temperatura mínima permitida.
- Estado del envío.

Ejemplo:

Código: SHIP-001  
Producto: Carnes congeladas  
Origen: Santa Ana  
Destino: La Unión  
Temperatura máxima permitida: 5 °C  
Temperatura mínima permitida: 0 °C  
Estado: En tránsito

### Recepción de telemetría

El backend deberá recibir datos enviados por el simulador mediante una API REST. Cada evento de telemetría representa una evidencia del recorrido del camión virtual.

Datos mínimos de telemetría:

- Código del envío.
- Número de secuencia.
- Latitud.
- Longitud.
- Temperatura.
- Humedad.
- Nivel de batería.
- Fecha y hora de registro.

### Almacenamiento histórico de telemetría

Cada lectura recibida desde el simulador deberá guardarse en PostgreSQL. El sistema no debe sobrescribir el historial de telemetría, ya que cada lectura funciona como evidencia técnica del recorrido.

Tabla principal relacionada:

- telemetry_events

### Registro del último estado del envío

Además del historial completo, el sistema deberá mantener una tabla con el último estado conocido de cada envío. Esta información permitirá recuperar el viaje después de un reinicio del sistema.

Tabla principal relacionada:

- shipment_state

Datos mínimos del último estado:

- Última secuencia procesada.
- Última latitud.
- Última longitud.
- Última temperatura.
- Última humedad.
- Último nivel de batería.
- Fecha de actualización.

### Detección de ruptura de cadena de frío

El backend deberá validar la temperatura recibida contra el umbral máximo permitido para el envío.

Regla mínima obligatoria:

Si temperatura_actual > temperatura_maxima_permitida, entonces se genera un incidente de ruptura de cadena de frío.

Ejemplo:

Temperatura máxima permitida: 5 °C  
Temperatura recibida: 12 °C  
Resultado: generar incidente crítico.

Tipo de incidente:

- COLD_CHAIN_BREACH

Severidad:

- CRITICAL

### Generación de incidentes inmutables

Cuando el backend detecte una anomalía crítica, deberá registrar un incidente en la base de datos. Los incidentes de calidad deberán ser inmutables. Esto significa que, una vez registrados, no deberán poder modificarse ni eliminarse mediante operaciones normales.

Tabla principal relacionada:

- quality_incidents

La inmutabilidad deberá reforzarse mediante un trigger o mecanismo equivalente en PostgreSQL que bloquee operaciones de actualización y eliminación sobre los incidentes registrados.

Operaciones que deben ser rechazadas:

- UPDATE quality_incidents
- DELETE FROM quality_incidents

### Recuperación después de reinicio

El sistema deberá demostrar que los datos persisten aunque los contenedores se detengan y se levanten nuevamente. PostgreSQL deberá usar un volumen persistente de Docker.

Escenario obligatorio:

1. Levantar los contenedores.
2. Dejar que el simulador envíe telemetría.
3. Confirmar que existe un último estado registrado.
4. Apagar los contenedores.
5. Levantar nuevamente los contenedores.
6. Consultar la base de datos.
7. Confirmar que el último estado del envío no se perdió.

### Aislamiento de red del simulador

El simulador no deberá ser accesible directamente desde el exterior. Únicamente deberá comunicarse con el backend dentro de la red interna de Docker.

Flujo permitido:

- Frontend → Backend.
- Simulador → Backend.
- Backend → PostgreSQL.

Accesos no permitidos desde el exterior:

- Acceso directo al simulador.
- Acceso directo a PostgreSQL.

## Componentes del sistema

### Frontend

Aplicación desarrollada con Next.js.

Responsabilidades mínimas:

- Mostrar envíos registrados.
- Mostrar último estado del envío.
- Mostrar temperatura, humedad, batería y ubicación.
- Mostrar incidentes detectados.

Para el alcance mínimo, el frontend no necesita mapa avanzado. Puede presentar la información mediante tarjetas, tablas e indicadores de estado.

### Backend

API desarrollada con Node.js.

Responsabilidades mínimas:

- Recibir telemetría.
- Validar datos recibidos.
- Guardar eventos de telemetría.
- Actualizar el último estado del envío.
- Ejecutar reglas de negocio.
- Generar incidentes de calidad.
- Exponer endpoints para el frontend.

Endpoints mínimos:

- GET /health
- GET /api/shipments
- GET /api/shipments/:id/state
- GET /api/incidents
- POST /api/telemetry

### Simulador

Servicio desarrollado con Node.js.

Responsabilidades mínimas:

- Simular un camión virtual.
- Enviar datos periódicos al backend.
- Generar al menos un evento donde la temperatura supere el umbral permitido.
- Simular variación de temperatura, humedad, batería y ubicación.

El simulador no tendrá interfaz gráfica ni puerto expuesto al exterior.

### Base de datos

Base de datos PostgreSQL.

Responsabilidades mínimas:

- Guardar envíos.
- Guardar eventos históricos de telemetría.
- Guardar el último estado de cada envío.
- Guardar incidentes de calidad.
- Impedir modificación o eliminación de incidentes.

Tablas mínimas:

- shipments
- telemetry_events
- shipment_state
- quality_incidents

## Casos de alerta incluidos

### Caso de alerta 1: ruptura de cadena de frío

El camión virtual entra en una zona de calor y la temperatura sube a 12 °C cuando el máximo permitido es 5 °C.

Resultado esperado:

- El backend detecta la anomalía.
- Se crea un incidente de tipo COLD_CHAIN_BREACH.
- El incidente queda registrado con fecha y hora.
- El incidente no puede modificarse ni eliminarse.

### Caso de alerta 2: reinicio del sistema

El servidor o los contenedores se apagan durante la simulación.

Resultado esperado:

- Docker Compose levanta nuevamente los servicios.
- PostgreSQL conserva los datos en un volumen persistente.
- El sistema permite consultar el último estado registrado.
- No se pierde el historial de telemetría ni los incidentes.

### Caso de alerta 3: batería baja

El simulador reporta que el dispositivo de monitoreo tiene batería igual o inferior al umbral permitido.

Resultado esperado:

- El backend genera un incidente o advertencia de tipo LOW_BATTERY.

Este caso puede implementarse como funcionalidad secundaria si el tiempo lo permite.

### Caso de alerta 4: geofencing

El simulador envía coordenadas GPS fuera del perímetro permitido.

Resultado esperado:

- El backend genera un incidente de tipo GEOFENCE_VIOLATION.

Este caso puede implementarse como funcionalidad secundaria si el tiempo lo permite.

## Fuera del alcance de la primera versión

La primera versión no incluirá:

- Autenticación de usuarios.
- Roles y permisos.
- Administración avanzada de usuarios.
- Mapa interactivo avanzado.
- Notificaciones por correo.
- Notificaciones SMS.
- Integración con GPS real.
- Integración con sensores físicos reales.
- Panel administrativo complejo.
- Reportes PDF.
- Firma digital de incidentes.
- Blockchain.
- Kubernetes.
- Balanceadores de carga.
- Alta disponibilidad multi-región.

Estas funcionalidades pueden considerarse mejoras futuras.

## Criterios técnicos de éxito

La aplicación será considerada funcional si cumple los siguientes puntos:

1. Los servicios levantan correctamente con Docker Compose.
2. PostgreSQL utiliza volumen persistente.
3. El backend responde correctamente en /health.
4. El simulador envía telemetría al backend.
5. El backend guarda cada evento de telemetría.
6. El backend actualiza el último estado del envío.
7. El backend detecta temperatura superior al umbral permitido.
8. El backend registra un incidente crítico de ruptura de cadena de frío.
9. Los incidentes no pueden ser modificados ni eliminados.
10. Después de reiniciar los contenedores, los datos siguen disponibles.
11. El simulador no está expuesto públicamente.
12. El frontend puede consultar y mostrar datos reales desde el backend.

## Versión mínima entregable

La versión mínima entregable estará compuesta por:

- Next.js Frontend.
- Node.js Backend API.
- Node.js Telemetry Simulator.
- PostgreSQL Database.
- Docker Compose Network.
- Docker Persistent Volume.
- GitHub Actions CI Pipeline.

## Decisión técnica principal

El proyecto prioriza la persistencia, integridad y trazabilidad de datos sobre la complejidad visual de la interfaz. Por esa razón, el desarrollo se enfocará primero en base de datos, backend, reglas de incidentes, persistencia, simulador, pruebas técnicas y frontend básico.
