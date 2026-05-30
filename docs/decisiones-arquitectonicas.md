# Decisiones Arquitectónicas de SupplyChain Pro

## Propósito

Este documento registra las principales decisiones técnicas tomadas para el diseño de SupplyChain Pro. Su objetivo es justificar por qué se eligieron determinadas tecnologías, patrones y restricciones arquitectónicas.

## Decisión 1: arquitectura basada en servicios separados

### Decisión

El sistema se dividirá en cuatro servicios principales: frontend, backend, simulador y base de datos.

### Justificación

Esta separación permite aplicar el principio de responsabilidad única. Cada componente cumple una función específica y puede desarrollarse, probarse y desplegarse de manera independiente.

### Consecuencia

La arquitectura es más clara y defendible académicamente, aunque requiere configurar comunicación entre servicios mediante Docker Compose.

## Decisión 2: uso de Docker Compose

### Decisión

El entorno local y de presentación se ejecutará mediante Docker Compose.

### Justificación

Docker Compose permite definir múltiples servicios, redes y volúmenes en un solo archivo. Esto facilita la reproducción del ambiente y permite demostrar aislamiento de servicios.

### Consecuencia

El proyecto puede levantarse con un comando, pero requiere mantener correctamente los archivos Dockerfile y docker-compose.yml.

## Decisión 3: PostgreSQL como base de datos

### Decisión

Se utilizará PostgreSQL como base de datos relacional.

### Justificación

PostgreSQL ofrece integridad transaccional, claves foráneas, triggers y soporte adecuado para registros críticos. En este proyecto, la base de datos no solo almacena datos, sino que también refuerza reglas de integridad como la inmutabilidad de incidentes.

### Consecuencia

El sistema puede proteger evidencia crítica desde la capa de datos, reduciendo dependencia exclusiva del backend.

## Decisión 4: Node.js para backend

### Decisión

El backend se desarrollará con Node.js.

### Justificación

Node.js permite crear APIs REST de forma rápida, tiene buen soporte para contenedores y facilita el procesamiento de eventos enviados por el simulador.

### Consecuencia

El backend será liviano y adecuado para la recepción de telemetría en intervalos cortos.

## Decisión 5: Node.js para simulador

### Decisión

El simulador también se desarrollará con Node.js.

### Justificación

Usar el mismo ecosistema para backend y simulador reduce complejidad técnica. El simulador solo necesita generar datos periódicos y enviarlos por HTTP.

### Consecuencia

Se simplifica el desarrollo y la ejecución en contenedores.

## Decisión 6: Next.js para frontend

### Decisión

El frontend se desarrollará con Next.js.

### Justificación

Next.js permite crear una interfaz moderna basada en React, organizada por rutas y compatible con despliegue en contenedores.

### Consecuencia

El frontend puede evolucionar de una interfaz básica a un dashboard más completo si el tiempo lo permite.

## Decisión 7: incidentes inmutables

### Decisión

Los incidentes de calidad no podrán modificarse ni eliminarse después de ser registrados.

### Justificación

En un sistema de trazabilidad, los incidentes funcionan como evidencia. Permitir su modificación reduciría la confiabilidad del sistema.

### Consecuencia

Se deberá implementar una restricción o trigger en PostgreSQL que bloquee UPDATE y DELETE sobre la tabla quality_incidents.

## Decisión 8: uso de shipment_state

### Decisión

Además del historial de telemetría, se mantendrá una tabla con el último estado conocido del envío.

### Justificación

Consultar todo el historial para obtener el último estado puede ser menos eficiente. La tabla shipment_state facilita la recuperación rápida después de reinicios.

### Consecuencia

El backend deberá actualizar esta tabla cada vez que reciba telemetría válida.

## Decisión 9: simulador no expuesto al exterior

### Decisión

El simulador no publicará puertos hacia el host.

### Justificación

El simulador es un componente interno de generación de datos. No requiere acceso desde usuarios externos.

### Consecuencia

El simulador se comunicará con el backend mediante la red interna de Docker.

## Decisión 10: PostgreSQL no expuesto en presentación o producción

### Decisión

PostgreSQL no deberá estar expuesto públicamente en ambientes de presentación o despliegue.

### Justificación

La base de datos contiene evidencia crítica. El acceso directo externo representa un riesgo de seguridad.

### Consecuencia

Solo el backend deberá conectarse a PostgreSQL.

## Decisión 11: pipeline CI con GitHub Actions

### Decisión

Se utilizará GitHub Actions para validar la construcción de los servicios.

### Justificación

El criterio de evaluación solicita presencia de un pipeline de CI. Además, permite demostrar prácticas básicas DevOps.

### Consecuencia

El repositorio deberá incluir workflows para validar frontend, backend y simulador.

## Decisión 12: limitar el alcance visual del frontend

### Decisión

La primera versión del frontend no incluirá mapas avanzados ni dashboards complejos.

### Justificación

El valor principal del proyecto está en la arquitectura, persistencia, integridad y recuperación. Invertir demasiado tiempo en visualización puede afectar los requisitos críticos.

### Consecuencia

El frontend mostrará inicialmente tarjetas y tablas con datos reales del backend.

## Conclusión

Las decisiones arquitectónicas priorizan una solución funcional, demostrable y alineada con los criterios de evaluación. La arquitectura resultante permite defender separación de responsabilidades, persistencia, integridad de datos, aislamiento de red y validación mediante CI.
