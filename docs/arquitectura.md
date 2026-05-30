# Arquitectura del Sistema SupplyChain Pro

## Enfoque arquitectónico

SupplyChain Pro utiliza una arquitectura distribuida basada en contenedores, donde cada componente tiene una responsabilidad específica. Esta separación permite aplicar principios de diseño de arquitectura de sistemas como separación de responsabilidades, bajo acoplamiento, persistencia controlada, comunicación por red interna y recuperación ante fallos.

La arquitectura está orientada a demostrar cómo un sistema logístico puede conservar evidencias críticas de transporte mediante servicios independientes que interactúan entre sí a través de interfaces definidas.

## Componentes principales

El sistema se compone de cuatro servicios principales:

- Frontend.
- Backend.
- Simulador.
- Base de datos PostgreSQL.

Cada servicio se ejecutará en un contenedor independiente administrado por Docker Compose.

## Vista general de arquitectura

Flujo principal:

1. El simulador representa un camión virtual en ruta.
2. El simulador envía telemetría periódica al backend.
3. El backend valida la información recibida.
4. El backend registra los eventos de telemetría en PostgreSQL.
5. El backend actualiza el último estado conocido del envío.
6. El backend evalúa reglas de negocio.
7. Si existe una anomalía, el backend registra un incidente inmutable.
8. El frontend consulta el backend para mostrar el estado del envío y los incidentes.

Representación lógica:

Frontend → Backend → PostgreSQL  
Simulador → Backend → PostgreSQL

## Frontend

El frontend es la capa de presentación del sistema. Estará desarrollado con Next.js y será responsable de mostrar al usuario la información del monitoreo logístico.

Responsabilidades:

- Consultar la API del backend.
- Mostrar los envíos registrados.
- Mostrar el último estado conocido del envío.
- Mostrar métricas de temperatura, humedad, batería y ubicación.
- Mostrar incidentes de calidad detectados.

El frontend no procesa reglas de negocio críticas. Su función principal es visualización y consulta.

## Backend

El backend es la capa central de procesamiento. Estará desarrollado con Node.js y será responsable de recibir, validar y procesar la telemetría enviada por el simulador.

Responsabilidades:

- Exponer endpoints REST.
- Validar el payload de telemetría.
- Persistir eventos históricos.
- Actualizar el último estado del envío.
- Aplicar reglas de negocio.
- Generar incidentes de calidad.
- Consultar datos para el frontend.

El backend funciona como punto de control entre el simulador, el frontend y la base de datos. Ningún servicio externo debe acceder directamente a la base de datos.

## Simulador

El simulador representa el comportamiento de un camión virtual. Su función es generar datos de telemetría para validar el funcionamiento de la arquitectura sin depender de sensores físicos reales.

Responsabilidades:

- Generar coordenadas GPS ficticias.
- Generar valores de temperatura y humedad.
- Simular nivel de batería.
- Enviar telemetría al backend en intervalos definidos.
- Provocar escenarios de alerta, como temperatura crítica de 12 °C.

El simulador no expone puertos al exterior. Su comunicación ocurre únicamente dentro de la red interna de Docker.

## Base de datos PostgreSQL

PostgreSQL es el componente encargado de almacenar información persistente del sistema.

Responsabilidades:

- Guardar envíos.
- Guardar eventos históricos de telemetría.
- Guardar el último estado del envío.
- Guardar incidentes de calidad.
- Aplicar restricciones de integridad.
- Bloquear modificaciones o eliminaciones de incidentes.

PostgreSQL utilizará un volumen persistente de Docker para conservar los datos después de reinicios.

## Separación de responsabilidades

La arquitectura separa responsabilidades de la siguiente manera:

- El frontend muestra información.
- El backend procesa reglas y coordina operaciones.
- El simulador genera datos.
- PostgreSQL conserva la evidencia persistente.

Esta separación reduce el acoplamiento y permite modificar un componente sin alterar de forma directa los demás.

## Comunicación entre servicios

La comunicación entre componentes será mediante HTTP y red interna Docker.

Comunicación permitida:

- Frontend hacia Backend.
- Simulador hacia Backend.
- Backend hacia PostgreSQL.

Comunicación no permitida:

- Frontend hacia PostgreSQL.
- Simulador hacia PostgreSQL.
- Usuarios externos hacia Simulador.
- Usuarios externos hacia PostgreSQL.

## Decisión de usar Docker Compose

Docker Compose permite ejecutar todos los servicios de la arquitectura desde un único archivo de configuración. Esto facilita la reproducción del ambiente en diferentes equipos y permite demostrar la relación entre contenedores, redes y volúmenes.

Beneficios principales:

- Aislamiento de servicios.
- Red interna para comunicación controlada.
- Volúmenes persistentes para PostgreSQL.
- Facilidad para levantar y detener toda la arquitectura.
- Reproducción del entorno en desarrollo y presentación.

## Decisión de usar PostgreSQL

PostgreSQL se selecciona como motor de base de datos por su estabilidad, soporte para integridad transaccional, restricciones, triggers y persistencia robusta. En este proyecto, la base de datos no solo almacena información, sino que también refuerza reglas de integridad como la inmutabilidad de incidentes.

Justificación:

- Soporte de claves primarias y foráneas.
- Soporte de transacciones.
- Capacidad para triggers.
- Adecuado para información crítica.
- Compatible con Docker.
- Uso extendido en aplicaciones empresariales.

## Decisión de usar Node.js

Node.js se utilizará tanto para el backend como para el simulador. Esto permite mantener consistencia tecnológica en los servicios de aplicación y facilita el desarrollo con un mismo ecosistema.

Justificación:

- Adecuado para APIs REST.
- Buen soporte para servicios livianos.
- Amplio ecosistema de paquetes.
- Compatible con contenedores Docker.
- Permite construir simuladores simples de eventos periódicos.

## Decisión de usar Next.js

Next.js se usará para el frontend por su integración con React, su estructura clara de rutas y su capacidad para crear interfaces web modernas.

Justificación:

- Permite construir una interfaz de monitoreo.
- Facilita el consumo de APIs.
- Puede ejecutarse en contenedor Docker.
- Permite evolucionar posteriormente hacia dashboards más completos.

## Patrón de procesamiento de telemetría

El procesamiento de telemetría seguirá el siguiente flujo:

1. Recibir evento desde simulador.
2. Validar estructura del payload.
3. Buscar el envío asociado.
4. Insertar el evento en telemetry_events.
5. Actualizar shipment_state.
6. Evaluar reglas de negocio.
7. Crear incidente si aplica.
8. Responder al simulador.

Este patrón permite conservar tanto el historial completo como el último estado operativo del envío.

## Persistencia y recuperación

La recuperación del sistema se apoya en la persistencia de PostgreSQL mediante un volumen Docker. Aunque los contenedores se detengan, los datos deben mantenerse en el volumen.

Esto permite demostrar que el sistema puede recuperar:

- Última ubicación conocida.
- Última temperatura registrada.
- Última humedad registrada.
- Último nivel de batería.
- Historial de telemetría.
- Incidentes generados.

## Seguridad de red

La arquitectura usa una red interna de Docker para restringir el acceso entre servicios. El simulador y PostgreSQL no deberán publicar puertos hacia el exterior.

Servicios expuestos:

- Frontend.
- Backend, solo si es necesario para pruebas o presentación.

Servicios no expuestos:

- Simulador.
- PostgreSQL en ambiente de presentación o producción.

## Arquitectura mínima para presentación

La arquitectura mínima defendible en la presentación incluye:

- Cuatro servicios separados.
- Comunicación controlada por red Docker.
- Persistencia con volumen Docker.
- Motor de reglas en backend.
- Incidentes inmutables en PostgreSQL.
- Pipeline de CI con GitHub Actions.

## Posibles mejoras futuras

- Autenticación y autorización.
- Dashboard administrativo avanzado.
- Mapa interactivo.
- Notificaciones automáticas.
- Integración con sensores físicos.
- Despliegue escalable en cloud.
- Separación del backend en microservicios.
- Observabilidad con métricas y logs centralizados.
- Uso de colas de mensajes para telemetría masiva
