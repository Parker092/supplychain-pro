#!/bin/bash

set -e

DB_CONTAINER="${DB_CONTAINER:-supplychainpro-db}"
DB_USER="${DB_USER:-supplychain}"
DB_NAME="${DB_NAME:-supplychain_db}"

echo "=============================================="
echo " SupplyChain Pro - Persistence Recovery Test"
echo "=============================================="
echo ""

echo "[1/6] Starting services..."
docker compose up --build -d

echo ""
echo "[2/6] Waiting for simulator to generate telemetry..."
sleep 25

echo ""
echo "[3/6] State before restart:"
docker exec -it "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
  -f /docker-entrypoint-initdb.d/scripts/check_persistence.sql

echo ""
echo "[4/6] Stopping containers without deleting volumes..."
docker compose down

echo ""
echo "[5/6] Confirming Docker volume still exists..."
docker volume ls | grep supplychain || true

echo ""
echo "[6/6] Starting services again..."
docker compose up -d

sleep 15

echo ""
echo "State after restart:"
docker exec -it "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
  -f /docker-entrypoint-initdb.d/scripts/check_persistence.sql

echo ""
echo "Persistence test completed."
echo "Expected: shipment_state must still contain the last known state."
echo "Do not use 'docker compose down -v' for this test."