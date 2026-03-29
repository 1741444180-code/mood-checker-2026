#!/bin/bash

# PostgreSQL Database Backup Script for Docker Environment
# Created by: 老张 (运维工程师)
# Date: 2026-03-29

set -e

# Configuration variables
BACKUP_DIR="/backups"
DB_CONTAINER_NAME="postgres-db"  # Docker container name for PostgreSQL
DB_NAME="app_db"                # Database name to backup
DB_USER="postgres"              # Database user
BACKUP_RETENTION_DAYS=7         # Keep backups for 7 days
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    log_message "ERROR: Docker is not installed or not in PATH"
    exit 1
fi

# Check if PostgreSQL container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER_NAME}$"; then
    log_message "ERROR: PostgreSQL container '${DB_CONTAINER_NAME}' is not running"
    log_message "Available containers:"
    docker ps --format '{{.Names}}'
    exit 1
fi

log_message "Starting database backup for ${DB_NAME}..."

# Perform the backup using pg_dump inside the container
docker exec "${DB_CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" > "${BACKUP_FILE}"

# Check if backup was successful
if [ $? -eq 0 ] && [ -s "${BACKUP_FILE}" ]; then
    log_message "Database backup completed successfully: ${BACKUP_FILE}"
    
    # Compress the backup file to save space
    gzip "${BACKUP_FILE}"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    log_message "Backup compressed: ${BACKUP_FILE}"
    
    # Set appropriate permissions
    chmod 600 "${BACKUP_FILE}"
    
    # Clean up old backups
    log_message "Cleaning up backups older than ${BACKUP_RETENTION_DAYS} days..."
    find "${BACKUP_DIR}" -name "${DB_NAME}_backup_*.sql.gz" -mtime +${BACKUP_RETENTION_DAYS} -delete
    
    log_message "Backup process completed successfully!"
else
    log_message "ERROR: Database backup failed or produced empty file"
    if [ -f "${BACKUP_FILE}" ]; then
        rm -f "${BACKUP_FILE}"
    fi
    exit 1
fi