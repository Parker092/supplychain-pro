# Seguridad de Red en SupplyChain Pro

## Propósito

Este documento describe las decisiones de seguridad de red aplicadas en la arquitectura de SupplyChain Pro. El objetivo principal es controlar qué servicios pueden comunicarse entre sí y evitar que componentes internos sean accesibles desde el exterior.

## Principio de exposición mínima

La arquitectura aplicará el principio de exposición mínima. Esto significa que solo se publicarán los servicios estrictamente necesarios para la interacción del usuario o para pruebas controladas.

Servicios que pueden exponerse:

- Frontend.
- Backend, únicamente si se requiere para pruebas.

Servicios que no deben exponerse:

- Simulador.
- PostgreSQL.

## Red interna de Docker

Docker Compose permite crear una red interna para que los servicios se comuniquen usando sus nombres de servicio. Esta red evita que todos los componentes tengan que publicar puertos hacia el host.

Ejemplo conceptual:

- El simulador puede comunicarse con `backend`.
- El backend puede comunicarse con `db`.
- El frontend puede comunicarse con el backend.

## Flujo permitido

Comunicación permitida:

- Frontend → Backend.
- Simulador → Backend.
- Backend → PostgreSQL.

## Flujo no permitido

Comunicación no permitida desde el exterior:

- Usuario externo → Simulador.
- Usuario externo → PostgreSQL.
- Frontend → PostgreSQL directamente.
- Simulador → PostgreSQL directamente.

## Justificación arquitectónica

El backend debe ser el único componente responsable de validar datos, aplicar reglas de negocio y controlar operaciones sobre la base de datos. Permitir que el simulador o el frontend escriban directamente en PostgreSQL rompería la separación de responsabilidades y aumentaría el riesgo de datos inválidos o manipulados.

## Seguridad del simulador

El simulador representa una fuente interna de telemetría. No debe estar disponible para usuarios externos, ya que su única función es enviar datos al backend.

Medida aplicada:

- No publicar puertos del simulador en Docker Compose.

Resultado esperado:

- El simulador solo puede comunicarse mediante la red interna.

## Seguridad de PostgreSQL

PostgreSQL almacena datos críticos de trazabilidad. Exponerlo directamente al exterior aumentaría el riesgo de acceso no autorizado, manipulación de datos o eliminación accidental.

Medida recomendada:

- No publicar el puerto 5432 en ambiente de presentación o producción.
- Usar credenciales mediante variables de entorno.
- Permitir acceso únicamente desde el backend.

## Seguridad del backend

El backend es el punto controlado de entrada para la lógica del sistema. Debe validar toda telemetría antes de guardarla.

Responsabilidades de seguridad:

- Validar estructura del payload.
- Rechazar datos incompletos.
- Rechazar tipos de datos incorrectos.
- Aplicar reglas de negocio.
- Evitar escritura directa no controlada.

## Seguridad del frontend

El frontend no debe contener secretos ni credenciales de base de datos. Su responsabilidad es consumir la API del backend.

Buenas prácticas:

- No incluir contraseñas en código frontend.
- No conectarse directamente a PostgreSQL.
- Usar variables públicas solo para URLs de API no sensibles.

## Firewall en despliegue cloud

Si el proyecto se despliega en Google Cloud o en un VPS, el firewall debe restringir puertos.

Permitir:

- 80 para HTTP.
- 443 para HTTPS si aplica.
- 22 para SSH restringido.
- 8080 solo temporalmente si el backend debe ser probado directamente.

Bloquear:

- 5432 para PostgreSQL.
- Cualquier puerto del simulador.
- Puertos no utilizados.

## Riesgos identificados

- Exponer PostgreSQL accidentalmente.
- Subir archivos .env al repositorio.
- Permitir que el frontend acceda directamente a la base de datos.
- No validar telemetría recibida.
- Ejecutar contenedores con configuraciones inseguras.
- Usar contraseñas débiles.

## Medidas de mitigación

- Usar .gitignore para evitar subir .env.
- Documentar variables en .env.example.
- No publicar puertos de servicios internos.
- Validar datos en backend.
- Usar contraseñas seguras en despliegue.
- Mantener separación estricta entre frontend, backend, simulador y base de datos.

## Conclusión

La seguridad de red del proyecto se basa en aislar los servicios internos y exponer solo los puntos necesarios. Esta decisión fortalece la arquitectura, protege la base de datos y mantiene el backend como único punto de control para la lógica de negocio y persistencia.
