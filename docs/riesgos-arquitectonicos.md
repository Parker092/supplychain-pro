# Riesgos Arquitectónicos del Proyecto SupplyChain Pro

## Propósito

Este documento identifica riesgos técnicos y arquitectónicos asociados al desarrollo y despliegue de SupplyChain Pro. Su objetivo es anticipar posibles fallos y definir medidas de mitigación que fortalezcan la solución.

## Riesgo 1: pérdida de datos por mala configuración de volúmenes

### Descripción

Si PostgreSQL no se configura con un volumen persistente, los datos podrían perderse al eliminar o recrear el contenedor.

### Impacto

Alto. La pérdida de telemetría e incidentes afectaría la trazabilidad y la validez del sistema.

### Mitigación

- Definir volumen Docker para PostgreSQL.
- Probar reinicio de contenedores.
- Evitar ejecutar docker compose down -v durante la presentación.
- Documentar scripts de reinicio y reset por separado.

## Riesgo 2: exposición de PostgreSQL al exterior

### Descripción

Si el puerto 5432 se publica hacia el exterior, la base de datos podría quedar accesible fuera de la red interna.

### Impacto

Alto. Podría permitir accesos no autorizados o manipulación de datos.

### Mitigación

- No publicar el puerto 5432 en producción o presentación.
- Permitir acceso únicamente desde el backend.
- Usar firewall en despliegue cloud.
- Usar contraseñas seguras.

## Riesgo 3: simulador accesible desde el exterior

### Descripción

El simulador no debe ser un servicio público. Si se expone, podría recibir o emitir datos de forma no controlada.

### Impacto

Medio. Puede generar ruido operacional o confusión en pruebas.

### Mitigación

- No publicar puertos del simulador.
- Comunicarlo con el backend mediante red interna Docker.
- Documentar el flujo de comunicación permitido.

## Riesgo 4: incidentes modificables

### Descripción

Si los incidentes pueden editarse o eliminarse, se pierde la integridad de la evidencia.

### Impacto

Alto. El sistema dejaría de cumplir su propósito de trazabilidad confiable.

### Mitigación

- Implementar trigger en PostgreSQL.
- Bloquear UPDATE y DELETE sobre quality_incidents.
- Probar la restricción durante la presentación.

## Riesgo 5: validación insuficiente de telemetría

### Descripción

Si el backend acepta datos incompletos o inválidos, la base de datos puede almacenar información incorrecta.

### Impacto

Medio o alto, dependiendo del dato afectado.

### Mitigación

- Validar payloads en backend.
- Rechazar campos faltantes.
- Validar tipos de datos.
- Registrar errores de procesamiento.

## Riesgo 6: fallo del backend

### Descripción

Si el backend se detiene, el simulador no podrá registrar telemetría.

### Impacto

Medio. Se interrumpe el procesamiento de eventos.

### Mitigación

- Usar restart: unless-stopped en Docker Compose.
- Registrar errores en el simulador.
- Considerar reintentos en el envío de telemetría.

## Riesgo 7: frontend no disponible

### Descripción

Si el frontend falla, los datos pueden seguir registrándose, pero el usuario no podrá visualizarlos.

### Impacto

Bajo o medio. La operación interna puede continuar, pero afecta la presentación y monitoreo.

### Mitigación

- Separar frontend del backend.
- Mantener endpoints de consulta disponibles.
- Validar datos también mediante consultas directas a PostgreSQL.

## Riesgo 8: volumen lleno

### Descripción

Si el volumen de PostgreSQL se llena, el sistema puede dejar de registrar eventos.

### Impacto

Alto en un sistema real.

### Mitigación

- Monitorear uso de disco.
- Definir políticas de retención.
- Agregar alertas de almacenamiento en versiones futuras.

## Riesgo 9: falta de CI antes de la presentación

### Descripción

Si no existe pipeline de CI, puede ser difícil demostrar que las imágenes de los servicios se construyen correctamente.

### Impacto

Medio. Afecta evidencia DevOps solicitada por criterios de evaluación.

### Mitigación

- Configurar GitHub Actions.
- Validar build de frontend, backend y simulador.
- Mostrar pipeline exitoso durante la presentación.

## Riesgo 10: alcance excesivo

### Descripción

Agregar funcionalidades complejas como autenticación, mapas avanzados o notificaciones puede retrasar el desarrollo de los requisitos centrales.

### Impacto

Alto. Puede impedir completar la versión mínima funcional.

### Mitigación

- Priorizar persistencia, backend, simulador e incidentes.
- Dejar funcionalidades visuales avanzadas como mejora futura.
- Mantener la presentación enfocada en arquitectura.

## Conclusión

Los riesgos principales del proyecto están relacionados con persistencia, seguridad de red, integridad de incidentes y alcance técnico. Las medidas propuestas permiten construir una versión mínima funcional y defendible desde la perspectiva de Diseño de Arquitectura de Sistemas.
