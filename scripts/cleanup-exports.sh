#!/bin/sh

# Cleanup script for export files
# This script removes export files older than 24 hours

EXPORT_DIR="/export-data"
LOG_FILE="/proc/1/fd/1"  # Output to container stdout

# Create export directory if it doesn't exist
if [ ! -d "$EXPORT_DIR" ]; then
    mkdir -p "$EXPORT_DIR"
    echo "$(date): Created export directory: $EXPORT_DIR" >> "$LOG_FILE"
fi

echo "$(date): Starting cleanup of export files older than 24 hours..." >> "$LOG_FILE"

# Find and remove files older than 24 hours (86400 seconds)
# Using find with -delete is more efficient than piping to rm
deleted_count=0
if command -v find >/dev/null 2>&1; then
    # Count files before deletion
    count_before=$(find "$EXPORT_DIR" -type f -mmin +1440 2>/dev/null | wc -l)
    
    # Delete files older than 24 hours (1440 minutes)
    find "$EXPORT_DIR" -type f -mmin +1440 -delete 2>/dev/null
    
    # Log the cleanup
    echo "$(date): Cleaned up $count_before expired export files" >> "$LOG_FILE"
else
    echo "$(date): Warning: 'find' command not available, skipping cleanup" >> "$LOG_FILE"
fi

echo "$(date): Cleanup completed" >> "$LOG_FILE"