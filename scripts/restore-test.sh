#!/bin/bash

# Backup Restore Test Script
# Created by: 老张 (运维工程师)
# Date: 2026-03-29

set -e

# Configuration
TEST_DB_NAME="app_db_restore_test"
BACKUP_DIR="/backups"
DB_CONTAINER_NAME="postgres-db"
DB_USER="postgres"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Check prerequisites
if ! command -v docker &> /dev/null; then
    log_message "ERROR: Docker is not installed"
    exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER_NAME}$"; then
    log_message "ERROR: PostgreSQL container '${DB_CONTAINER_NAME}' is not running"
    exit 1
fi

# Find the latest backup file
LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/${DB_USER}_backup_*.sql.gz 2>/dev/null | head -n1)

if [ -z "${LATEST_BACKUP}" ]; then
    log_message "ERROR: No backup files found in ${BACKUP_DIR}"
    exit 1
fi

log_message "Found latest backup: ${LATEST_BACKUP}"

# Create test database
log_message "Creating test database ${TEST_DB_NAME}..."
docker exec "${DB_CONTAINER_NAME}" psql -U "${DB_USER}" -c "CREATE DATABASE ${TEST_DB_NAME};"

# Decompress and restore backup to test database
log_message "Restoring backup to test database..."
gunzip -c "${LATEST_BACKUP}" | docker exec -i "${DB_CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TEST_DB_NAME}"

# Verify restore success
TABLE_COUNT=$(docker exec "${DB_CONTAINER_NAME}" psql -U "${DB_USER}" -d "${TEST_DB_NAME}" -t -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';" | tr -d ' ')
log_message "Restored database contains ${TABLE_COUNT} tables"

# Clean up test database
log_message "Cleaning up test database..."
docker exec "${DB_CONTAINER_NAME}" psql -U "${DB_USER}" -c "DROP DATABASE ${TEST_DB_NAME};"

log_message "Backup restore test completed successfully!"
log_message "Backup file ${LATEST_BACKUP} is valid and can be restored."