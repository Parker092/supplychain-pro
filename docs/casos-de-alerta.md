# Casos de Alerta del Sistema SupplyChain Pro

## Propósito

Este documento describe los principales escenarios de alerta que deberá manejar SupplyChain Pro. Los casos están orientados a demostrar cómo la arquitectura responde ante condiciones críticas de transporte, fallos de sistema y eventos relevantes para la trazabilidad de mercancía perecedera.

Desde la perspectiva de Diseño de Arquitectura de Sistemas, estos casos permiten validar el comportamiento de la solución bajo eventos anómalos, así como la correcta separación entre generación de datos, procesamiento, persistencia y visualización.

## Caso de alerta 1: ruptura de cadena de frío

### Descripción

El camión virtual entra en una zona de calor durante el recorrido. La temperatura del contenedor sube a 12 °C, aunque la temperatura máxima permitida para el producto es de 5 °C.

### Condición de activación

La alerta se activa cuando:

Temperatura recibida > Temperatura máxima permitida

Ejemplo:

- Temperatura máxima permitida: 5 °C.
- Temperatura recibida: 12 °C.

### Flujo esperado

1. El simulador envía un evento de telemetría al backend.
2. El backend valida la estructura del evento.
3. El backend guarda el evento en telemetry_events.
4. El backend actualiza el último estado en shipment_state.
5. El backend compara la temperatura recibida con el umbral permitido.
6. El backend detecta ruptura de cadena de frío.
7. El backend genera un incidente de calidad.
8. El incidente se guarda en quality_incidents.
9. El frontend muestra el incidente.

### Tipo de incidente

COLD_CHAIN_BREACH

### Severidad

CRITICAL

### Resultado esperado

El sistema debe registrar el incidente con fecha, hora, coordenadas, valor medido, umbral permitido y descripción del problema. El incidente no debe poder modificarse ni eliminarse posteriormente.

## Caso de alerta 2: reinicio del sistema durante el viaje

### Descripción

El servidor o el host donde se ejecutan los contenedores se apaga accidentalmente mientras el camión virtual está enviando telemetría.

### Condición de activación

El escenario se prueba deteniendo los servicios con Docker Compose y levantándolos nuevamente.

### Flujo esperado

1. El sistema está ejecutándose con Docker Compose.
2. El simulador envía telemetría.
3. PostgreSQL guarda eventos y último estado.
4. Se detienen los contenedores.
5. Se levantan nuevamente los contenedores.
6. PostgreSQL recupera sus datos desde el volumen persistente.
7. El backend puede consultar el último estado registrado.
8. El frontend vuelve a mostrar la información previa.

### Resultado esperado

El sistema no debe perder el último estado ni el historial de telemetría. Los incidentes registrados antes del reinicio deben permanecer disponibles.

### Valor arquitectónico

Este caso demuestra resiliencia básica y persistencia mediante volúmenes Docker. La recuperación no depende de memoria temporal del contenedor, sino de almacenamiento persistente.

## Caso de alerta 3: batería baja del dispositivo

### Descripción

El simulador reporta que el dispositivo de monitoreo tiene 5 % de batería. Esto representa un riesgo porque el dispositivo podría apagarse y dejar de enviar evidencia de trazabilidad.

### Condición de activación

La alerta se activa cuando:

Nivel de batería <= Umbral mínimo permitido

Ejemplo:

- Umbral mínimo permitido: 10 %.
- Batería recibida: 5 %.

### Flujo esperado

1. El simulador envía una lectura con batería baja.
2. El backend registra el evento de telemetría.
3. El backend evalúa la regla de batería.
4. El backend genera un incidente o advertencia.
5. El frontend muestra el evento como riesgo operativo.

### Tipo de incidente

LOW_BATTERY

### Severidad

WARNING

### Resultado esperado

El sistema debe registrar una advertencia de batería baja. Este caso puede implementarse después de la ruptura de cadena de frío.

## Caso de alerta 4: geofencing

### Descripción

El simulador envía coordenadas GPS fuera del perímetro permitido para el camión. Esto podría representar desviación de ruta, robo, error operativo o incumplimiento del plan logístico.

### Condición de activación

La alerta se activa cuando las coordenadas recibidas están fuera del área definida como permitida.

### Flujo esperado

1. El simulador envía coordenadas GPS.
2. El backend guarda el evento de telemetría.
3. El backend compara las coordenadas con el perímetro permitido.
4. Si las coordenadas están fuera del perímetro, se genera un incidente.
5. El frontend muestra el incidente.

### Tipo de incidente

GEOFENCE_VIOLATION

### Severidad

WARNING o CRITICAL, según la distancia o política definida.

### Resultado esperado

El sistema debe registrar una desviación de ruta. Este caso puede tratarse como mejora posterior si el tiempo de desarrollo es limitado.

## Caso de alerta 5: volumen de datos lleno

### Descripción

El volumen donde se almacenan los datos de PostgreSQL llega al 100 % de capacidad. Esto representa un riesgo crítico porque el sistema podría dejar de registrar telemetría o incidentes.

### Condición de activación

La alerta se considera cuando el almacenamiento disponible es insuficiente para continuar escribiendo datos.

### Flujo esperado conceptual

1. El sistema intenta registrar un evento.
2. PostgreSQL no puede escribir por falta de espacio.
3. El backend recibe un error de persistencia.
4. El sistema registra o reporta el fallo operacional.
5. El administrador debe liberar espacio o ampliar almacenamiento.

### Resultado esperado

Para el alcance mínimo, este caso puede documentarse como riesgo arquitectónico, no necesariamente implementarse. Se recomienda mencionarlo en la presentación como una mejora relacionada con observabilidad y monitoreo de infraestructura.

## Priorización de casos

Para la primera versión se priorizan:

1. Ruptura de cadena de frío.
2. Reinicio del sistema y recuperación de datos.
3. Batería baja.

Como casos secundarios o mejoras futuras:

1. Geofencing.
2. Volumen lleno.
3. Alertas automáticas externas.

## Relación con los criterios de evaluación

Los casos de alerta permiten demostrar:

- Persistencia de datos.
- Integridad de registros críticos.
- Procesamiento de reglas en backend.
- Separación de servicios.
- Recuperación después de fallos.
- Uso correcto de red interna.
- Valor práctico de la arquitectura propuesta.