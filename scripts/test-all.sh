#!/bin/bash

set -e

echo "=============================================="
echo " SupplyChain Pro - Full Technical Test Suite"
echo "=============================================="
echo ""

echo "[1/5] Starting full architecture..."
docker compose up --build -d

echo ""
echo "[2/5] Waiting for services to initialize..."
sleep 20

echo ""
echo "[3/5] Current service status:"
docker compose ps

echo ""
echo "[4/5] Running API tests..."
./scripts/test-api.sh

echo ""
echo "[5/5] Running database tests..."
./scripts/test-database.sh

echo ""
echo "=============================================="
echo " All technical tests completed"
echo "=============================================="
echo ""
echo "Validated:"
echo "- Backend health endpoint."
echo "- Valid telemetry ingestion."
echo "- Invalid telemetry rejection."
echo "- Cold chain incident creation."
echo "- Incident immutability."
echo "- Database state visibility."