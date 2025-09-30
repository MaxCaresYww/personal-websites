#!/bin/bash

# Static deployment script for personal website
# Usage: ./deploy-static.sh [environment]

set -e

# Configuration
ENVIRONMENT=${1:-production}
BUILD_DIR="out"
REMOTE_USER="your-username"
REMOTE_HOST="your-server-ip"
REMOTE_PATH="/var/www/yourname.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting static deployment for ${ENVIRONMENT}...${NC}"

# Step 1: Clean previous build
echo -e "${YELLOW}Cleaning previous build...${NC}"
rm -rf ${BUILD_DIR}

# Step 2: Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci

# Step 3: Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Step 4: Verify build output
if [ ! -d "${BUILD_DIR}" ]; then
    echo -e "${RED}Build failed: ${BUILD_DIR} directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully${NC}"

# Step 5: Deploy to server
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}Deploying to production server...${NC}"
    
    # Create remote directory if it doesn't exist
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo mkdir -p ${REMOTE_PATH} && sudo chown -R ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_PATH}"
    
    # Sync files to server
    rsync -avz --delete ${BUILD_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
    
    # Set proper permissions
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo chown -R www-data:www-data ${REMOTE_PATH} && sudo chmod -R 755 ${REMOTE_PATH}"
    
    # Reload nginx
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl reload nginx"
    
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    echo -e "${GREEN}Your website should be live at your domain${NC}"
else
    echo -e "${YELLOW}Build completed. Files are in ${BUILD_DIR}/ directory${NC}"
    echo -e "${YELLOW}To deploy manually:${NC}"
    echo -e "rsync -avz --delete ${BUILD_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
fi

echo -e "${GREEN}Done!${NC}"