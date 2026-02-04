#!/bin/bash
# Build script for Docker Compose with folder names containing spaces

# Copy frontend source to a temp location with no spaces for Docker
FRONTEND_FOLDER="src/Web Interface for AURA Clinic (1)"
TEMP_FRONTEND="frontend-build"

if [ -d "$FRONTEND_FOLDER" ]; then
    echo "Preparing frontend for Docker build..."
    mkdir -p "$TEMP_FRONTEND"
    cp -r "$FRONTEND_FOLDER"/* "$TEMP_FRONTEND/"
    
    echo "Building Docker containers..."
    docker-compose -f docker-compose.yml up -d --build
    
    echo "Cleaning up temp files..."
    rm -rf "$TEMP_FRONTEND"
else
    echo "Frontend folder not found: $FRONTEND_FOLDER"
    exit 1
fi
