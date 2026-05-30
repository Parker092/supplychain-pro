#!/bin/bash

set -e

DB_CONTAINER="${DB_CONTAINER:-supplychainpro-db}"
DB_USER="${DB_USER:-supplychain}"
DB_NAME="${DB_NAME:-supplychain_db}"

echo "=============================================="
echo " SupplyChain Pro - Database Technical Tests"
echo "=============================================="
echo ""

echo "[1/4] Checking shipment_state..."
docker exec -it "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
  -f /docker-entrypoint-initdb.d/scripts/check_persistence.sql

echo ""
echo "[2/4] Checking quality_incidents..."
docker exec -it "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
  -f /docker-entrypoint-initdb.d/scripts/check_incidents.sql

echo ""
echo "[3/4] Testing UPDATE immutability. Expected: ERROR..."
set +e
docker exec -it "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
  -f /docker-entrypoint-initdb.d/scripts/test_incident_immutability.sql
UPDATE_EXIT_CODE=$?
set -e

if [ "$UPDATE_EXIT_CODE" -eq 0 ]; then
  echo "ERROR: UPDATE immutability test did not fail."
  exit 1
else
  echo "OK: UPDATE was blocked by database trigger."
fi

echo ""
echo "[4/4] Testing DELETE immutability. Expected: ERROR..."
set +e
docker exec -it "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
  -f /docker-entrypoint-initdb.d/scripts/test_incident_delete_immutability.sql
DELETE_EXIT_CODE=$?
set -e

if [ "$DELETE_EXIT_CODE" -eq 0 ]; then
  echo "ERROR: DELETE immutability test did not fail."
  exit 1
else
  echo "OK: DELETE was blocked by database trigger."
fi

echo ""
echo "=============================================="
echo " Database tests completed"
echo "=============================================="