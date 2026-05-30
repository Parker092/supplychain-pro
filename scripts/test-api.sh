#!/bin/bash

set -e

API_URL="${API_URL:-http://localhost:8080}"

echo "=============================================="
echo " SupplyChain Pro - API Technical Tests"
echo "=============================================="
echo ""

echo "[1/5] Testing backend health..."
curl -s "$API_URL/health"
echo ""
echo ""

echo "[2/5] Testing shipments endpoint..."
curl -s "$API_URL/api/shipments"
echo ""
echo ""

echo "[3/5] Sending valid telemetry..."
curl -s -X POST "$API_URL/api/telemetry" \
  -H "Content-Type: application/json" \
  -d "{
    \"shipmentCode\": \"SHIP-001\",
    \"sequenceNumber\": $(date +%s),
    \"latitude\": 13.9942,
    \"longitude\": -89.5597,
    \"temperature\": 4,
    \"humidity\": 70,
    \"batteryLevel\": 95
  }"
echo ""
echo ""

echo "[4/5] Sending invalid telemetry. Expected: validation error..."
curl -s -X POST "$API_URL/api/telemetry" \
  -H "Content-Type: application/json" \
  -d "{
    \"shipmentCode\": \"SHIP-001\",
    \"sequenceNumber\": \"invalid\",
    \"latitude\": 200,
    \"longitude\": -89.5597,
    \"temperature\": 4,
    \"humidity\": 170,
    \"batteryLevel\": 95
  }"
echo ""
echo ""

echo "[5/5] Sending critical temperature telemetry. Expected: COLD_CHAIN_BREACH..."
curl -s -X POST "$API_URL/api/telemetry" \
  -H "Content-Type: application/json" \
  -d "{
    \"shipmentCode\": \"SHIP-001\",
    \"sequenceNumber\": $(($(date +%s) + 1)),
    \"latitude\": 13.6929,
    \"longitude\": -89.2182,
    \"temperature\": 12,
    \"humidity\": 78,
    \"batteryLevel\": 90
  }"
echo ""
echo ""

echo "=============================================="
echo " API tests completed"
echo "=============================================="