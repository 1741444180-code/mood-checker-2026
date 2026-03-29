#!/bin/bash

# Cache cleanup script for leaderboard data
# This script removes expired or invalid leaderboard cache entries

set -euo pipefail

# Configuration
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="leaderboard_cache_2026"
REDIS_DB="0"

# Leaderboard keys pattern
LEADERBOARD_PATTERN="game:leaderboard:*"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Check if Redis is available
check_redis() {
    if ! redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning ping &>/dev/null; then
        log "ERROR: Redis server is not available"
        exit 1
    fi
}

# Clean expired keys (Redis should handle this automatically, but this ensures cleanup)
clean_expired_keys() {
    log "Cleaning expired leaderboard keys"
    
    # Get all leaderboard keys
    keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning --scan --pattern "$LEADERBOARD_PATTERN")
    
    if [[ -n "$keys" ]]; then
        # For each key, check if it has TTL and remove if expired or invalid
        while IFS= read -r key; do
            if [[ -n "$key" ]]; then
                ttl=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning TTL "$key")
                if [[ "$ttl" == "-2" ]]; then
                    # Key doesn't exist (already expired)
                    log "Key already expired: $key"
                elif [[ "$ttl" == "-1" ]]; then
                    # Key exists but has no expiration - set one
                    log "Setting expiration for persistent key: $key"
                    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning EXPIRE "$key" 86400 >/dev/null
                elif [[ "$ttl" -lt 0 ]]; then
                    # Shouldn't happen, but just in case
                    log "Removing invalid key: $key"
                    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning DEL "$key" >/dev/null
                fi
            fi
        done <<< "$keys"
    else
        log "No leaderboard keys found"
    fi
}

# Force clean all leaderboard cache (use with caution)
force_clean_all() {
    log "Force cleaning ALL leaderboard cache"
    
    keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning --scan --pattern "$LEADERBOARD_PATTERN")
    
    if [[ -n "$keys" ]]; then
        count=0
        while IFS= read -r key; do
            if [[ -n "$key" ]]; then
                redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning DEL "$key" >/dev/null
                ((count++))
            fi
        done <<< "$keys"
        log "Removed $count leaderboard keys"
    else
        log "No leaderboard keys to remove"
    fi
}

# Display cache statistics
show_stats() {
    log "Leaderboard cache statistics:"
    
    keys=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning --scan --pattern "$LEADERBOARD_PATTERN")
    
    if [[ -n "$keys" ]]; then
        count=0
        total_memory=0
        while IFS= read -r key; do
            if [[ -n "$key" ]]; then
                ((count++))
                memory=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning MEMORY USAGE "$key" 2>/dev/null || echo "0")
                total_memory=$((total_memory + memory))
                ttl=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning TTL "$key")
                log "  $key: TTL=$ttl, Memory=${memory} bytes"
            fi
        done <<< "$keys"
        log "Total keys: $count, Total memory: $total_memory bytes"
    else
        log "No leaderboard keys found"
    fi
}

# Main execution
main() {
    local action="${1:-clean}"
    
    log "Starting cache cleanup process (action: $action)"
    
    check_redis
    
    case "$action" in
        "clean")
            clean_expired_keys
            ;;
        "force-clean")
            force_clean_all
            ;;
        "stats")
            show_stats
            ;;
        *)
            log "Usage: $0 [clean|force-clean|stats]"
            log "  clean        - Clean expired keys and fix missing TTLs"
            log "  force-clean  - Remove ALL leaderboard cache keys"
            log "  stats        - Show cache statistics"
            exit 1
            ;;
    esac
    
    log "Cache cleanup completed"
}

# Handle signals for graceful shutdown
trap 'log "Script interrupted"; exit 0' SIGINT SIGTERM

# Run main function
main "$@"