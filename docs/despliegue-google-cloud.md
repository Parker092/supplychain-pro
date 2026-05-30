# Despliegue en Google Cloud

## Propósito

Este documento describe una estrategia de despliegue para SupplyChain Pro utilizando Google Cloud como entorno de demostración. El objetivo es ejecutar la arquitectura completa en una máquina virtual que permita usar Docker Compose, red interna y volumen persistente.

## Enfoque recomendado

Para este proyecto se recomienda utilizar una máquina virtual en Compute Engine. Esta opción permite ejecutar Docker Compose de forma similar al ambiente local, manteniendo los requisitos del proyecto:

- Servicios en contenedores.
- Red interna entre servicios.
- Volumen persistente para PostgreSQL.
- Control de puertos expuestos.
- Simulador no accesible desde el exterior.

## Razón para usar Compute Engine

Aunque existen servicios serverless como Cloud Run, el proyecto requiere demostrar explícitamente persistencia con volúmenes Docker y comunicación interna entre servicios definidos en Docker Compose. Por esa razón, una máquina virtual es más adecuada para la presentación académica.

## Arquitectura de despliegue

La VM ejecutará:

- Docker Engine.
- Docker Compose.
- Frontend.
- Backend.
- Simulador.
- PostgreSQL.

El volumen persistente de PostgreSQL deberá montarse en una ruta del sistema de archivos de la VM, por ejemplo:

/opt/supplychain/db-data

## Servicios expuestos

Servicios que pueden exponerse:

- Frontend en puerto 80 o 3000.
- Backend en puerto 8080 solo si se requiere para pruebas.

Servicios que no deben exponerse:

- Simulador.
- PostgreSQL.

## Reglas de firewall recomendadas

Permitir:

- SSH desde IP autorizada.
- HTTP en puerto 80.
- HTTPS en puerto 443 si se configura certificado.
- Backend en puerto 8080 solo temporalmente para demostración.

Restringir:

- PostgreSQL puerto 5432.
- Cualquier puerto del simulador.
- Acceso SSH abierto a cualquier origen, si es posible evitarlo.

## Variables de entorno

Las claves y parámetros sensibles deben manejarse mediante archivo .env en el servidor, no dentro del repositorio.

Variables mínimas:

- POSTGRES_PASSWORD.
- DATABASE_URL.
- MAX_ALLOWED_TEMPERATURE.
- MIN_ALLOWED_BATTERY.

## Flujo de despliegue propuesto

1. Crear VM en Google Cloud.
2. Instalar Docker y Docker Compose.
3. Clonar el repositorio o copiar archivos de despliegue.
4. Crear archivo .env en la VM.
5. Crear directorio persistente para PostgreSQL.
6. Ejecutar docker compose.
7. Verificar servicios activos.
8. Probar frontend y backend.
9. Validar persistencia.

## Comandos conceptuales de despliegue

Actualizar sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

Instalar dependencias básicas:

```bash
sudo apt install -y ca-certificates curl gnupg git ufw
```

Crear directorio de aplicación:

```bash
sudo mkdir -p /opt/supplychain/app
sudo mkdir -p /opt/supplychain/db-data
```

Levantar servicios:

```bash
cd /opt/supplychain/app
docker compose -f docker-compose.prod.yml up -d
```

Verificar servicios:

```bash
docker compose -f docker-compose.prod.yml ps
```

## Prueba de persistencia en cloud

La prueba debe demostrar que los datos sobreviven al reinicio de contenedores.

Secuencia:

1. Levantar servicios.
2. Esperar telemetría.
3. Consultar shipment_state.
4. Detener servicios.
5. Levantar servicios.
6. Consultar nuevamente shipment_state.

Si los datos siguen presentes, la persistencia está funcionando.

## Riesgos del despliegue cloud

- Costos si se usa una instancia fuera de capa gratuita.
- Exposición accidental de PostgreSQL.
- Uso de claves débiles.
- Falta de control de firewall.
- Pérdida de datos si se elimina el volumen o directorio persistente.
- Reinicios inesperados si la VM se apaga.

## Medidas de mitigación

- Usar una VM pequeña para demostración.
- Configurar alertas de presupuesto.
- No exponer PostgreSQL.
- Usar contraseñas seguras.
- Restringir SSH.
- Mantener datos en volumen persistente.
- Hacer pruebas locales antes de desplegar.

## Conclusión

Google Cloud puede utilizarse como entorno de demostración para validar la arquitectura completa. Sin embargo, el despliegue local con Docker Compose también es válido si la evaluación se enfoca en arquitectura, persistencia y funcionamiento de servicios.
