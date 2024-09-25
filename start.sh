#!/bin/bash

# Constants
URL="http://localhost:7002"
DOMAIN=$(echo ${URL#*//})
PORT=7002
APPLICATION_NAME="Application Name"

# Function to add more interesting logs
log_action() {
    echo "- $1"
}

# Function to kill process in a cool way
kill_port() {
    log_action "Gracefully stopping Application..."
    PID=$(netstat -ano | findstr :7002 | awk '{print $5}' | head -n 1)
    log_action "Stopping PID: $PID"
    if [ -n "$PID" ]; then
        taskkill //PID $PID //F
    fi
}

# Change directory to where the script is located
SCRIPT_DIR="$(dirname "$0")"
cd "$SCRIPT_DIR"

log_action "Starting $APPLICATION_NAME..."
trap kill_port EXIT

check_dependency() {
    if ! command -v $1 &> /dev/null
    then
        log_action "$1 could not be found. Please install it and try again."
        exit
    fi
}
check_dependency npm
check_dependency curl

log_action "Installing necessary packages..."
START_TIME=$(date +%s)
npm install
END_TIME=$(date +%s)
TIME_TAKEN=$(( $END_TIME - $START_TIME ))
log_action "$APPLICATION_NAME setup completed in $TIME_TAKEN seconds."

log_action "Initiating Application Services..."
nohup npm run start:prod > /dev/null 2>&1 &

log_action "Connecting to Application Services..."

while ! curl --output /dev/null --silent --head --fail "$URL"; do
    # This will print a '#' for loading bar effect
    echo -n "#"
    sleep 5
done

echo -e "\n$APPLICATION_NAME started"
npm run open:desktop
