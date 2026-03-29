#!/bin/bash

# Refresh leaderboard cache script
# This script fetches fresh leaderboard data and updates Redis cache
# Run every 5 minutes via cron

set -euo pipefail

# Configuration
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="leaderboard_cache_2026"
REDIS_DB="0"

# Leaderboard keys
LEADERBOARD_KEY="game:leaderboard:daily"
LEADERBOARD_WEEKLY_KEY="game:leaderboard:weekly"
LEADERBOARD_MONTHLY_KEY="game:leaderboard:monthly"

# Expiration times (in seconds)
DAILY_EXPIRE=86400      # 24 hours
WEEKLY_EXPIRE=604800    # 7 days  
MONTHLY_EXPIRE=2592000  # 30 days

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

# Fetch leaderboard data from your application database
# This is a placeholder function - replace with actual data fetching logic
fetch_leaderboard_data() {
    local period="$1"
    
    # Example: In a real implementation, you would query your database here
    # For demonstration, we'll create sample data
    case "$period" in
        "daily")
            echo "player1:1500"
            echo "player2:1450"
            echo "player3:1400"
            echo "player4:1350"
            echo "player5:1300"
            ;;
        "weekly")
            echo "player1:8500"
            echo "player2:8200"
            echo "player3:7900"
            echo "player4:7600"
            echo "player5:7300"
            ;;
        "monthly")
            echo "player1:32000"
            echo "player2:30500"
            echo "player3:29000"
            echo "player4:27500"
            echo "player5:26000"
            ;;
        *)
            log "ERROR: Unknown period $period"
            return 1
            ;;
    esac
}

# Update Redis sorted set with new leaderboard data
update_leaderboard() {
    local key="$1"
    local period="$2"
    local expire_time="$3"
    
    log "Updating leaderboard: $key"
    
    # Start a transaction
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning MULTI >/dev/null
    
    # Remove existing leaderboard
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning DEL "$key" >/dev/null
    
    # Add new data
    while IFS=: read -r player score; do
        if [[ -n "$player" && -n "$score" ]]; then
            redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning ZADD "$key" "$score" "$player" >/dev/null
        fi
    done < <(fetch_leaderboard_data "$period")
    
    # Set expiration
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning EXPIRE "$key" "$expire_time" >/dev/null
    
    # Execute transaction
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" --no-auth-warning EXEC >/dev/null
    
    log "Leaderboard $key updated successfully"
}

# Main execution
main() {
    log "Starting leaderboard refresh process"
    
    check_redis
    
    # Update daily leaderboard
    update_leaderboard "$LEADERBOARD_KEY" "daily" "$DAILY_EXPIRE"
    
    # Update weekly leaderboard  
    update_leaderboard "$LEADERBOARD_WEEKLY_KEY" "weekly" "$WEEKLY_EXPIRE"
    
    # Update monthly leaderboard
    update_leaderboard "$LEADERBOARD_MONTHLY_KEY" "monthly" "$MONTHLY_EXPIRE"
    
    log "Leaderboard refresh completed successfully"
}

# Handle signals for graceful shutdown
trap 'log "Script interrupted"; exit 0' SIGINT SIGTERM

# Run main function
main "$@"