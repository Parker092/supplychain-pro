# Despliegue y Gestión del Proyecto con GitHub Education

## Propósito

Este documento describe cómo se utilizará GitHub como plataforma de gestión técnica para el proyecto SupplyChain Pro. En el contexto de la materia Diseño de Arquitectura de Sistemas, GitHub funcionará como repositorio, historial de cambios, plataforma de integración continua y evidencia del trabajo realizado.

## Uso de GitHub en el proyecto

GitHub se utilizará para:

- Alojar el código fuente del proyecto.
- Mantener el historial de cambios.
- Organizar ramas de desarrollo.
- Ejecutar pipelines de integración continua.
- Validar construcción de servicios.
- Almacenar documentación técnica.
- Evidenciar el avance del proyecto.

## Repositorio recomendado

Nombre sugerido del repositorio:

supplychain-pro

Tipo recomendado:

- Privado durante el desarrollo.
- Público o compartido solo si el docente lo solicita.

## Estructura esperada del repositorio

El repositorio deberá contener:

- frontend/
- backend/
- simulator/
- database/
- docs/
- deploy/
- scripts/
- .github/workflows/
- docker-compose.yml
- docker-compose.prod.yml
- README.md

## Flujo de trabajo recomendado

Se recomienda utilizar la rama principal `main` como rama estable. Para cambios importantes, se pueden crear ramas específicas:

- feature/backend-api
- feature/database-schema
- feature/simulator
- feature/frontend-dashboard
- feature/docker-compose
- feature/ci-pipeline

Cada rama deberá integrarse a main cuando su funcionalidad esté probada.

## Commits recomendados

Ejemplos de commits útiles:

- Initial project structure.
- Add database schema documentation.
- Add backend health endpoint.
- Add telemetry persistence logic.
- Add cold chain breach rule.
- Add simulator service.
- Add frontend dashboard.
- Add Docker Compose configuration.
- Add GitHub Actions pipeline.
- Add presentation test documentation.

## GitHub Actions

GitHub Actions se utilizará para validar que los servicios principales puedan construirse correctamente antes de la presentación final.

Servicios a validar:

- Frontend.
- Backend.
- Simulador.

El pipeline mínimo deberá ejecutarse cuando se haga push a la rama main o cuando se abra un pull request.

## Objetivo del pipeline CI

El objetivo del pipeline no es desplegar automáticamente en la primera versión, sino validar que la arquitectura puede construirse sin errores.

Validaciones mínimas:

- Instalar dependencias si aplica.
- Construir imagen Docker del frontend.
- Construir imagen Docker del backend.
- Construir imagen Docker del simulador.
- Ejecutar pruebas básicas si están disponibles.

## Evidencia para la presentación

Durante la presentación final se deberá mostrar:

- Repositorio del proyecto.
- Estructura de carpetas.
- Historial de commits.
- Archivo de workflow en .github/workflows.
- Ejecución exitosa de GitHub Actions.

## Relación con Diseño de Arquitectura de Sistemas

El uso de GitHub y GitHub Actions permite demostrar que la arquitectura no solo existe como diseño, sino que también puede validarse mediante prácticas DevOps básicas. Esto refuerza la confiabilidad del proceso de construcción de servicios y reduce errores antes de la entrega.

## Recomendaciones

- No subir archivos .env con claves reales.
- Usar .env.example para documentar variables necesarias.
- No subir node_modules.
- Mantener documentación en docs/.
- Hacer commits pequeños y descriptivos.
- Ejecutar pruebas locales antes de hacer push.
- Verificar que GitHub Actions termine exitosamente antes de la presentación.