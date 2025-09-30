#!/bin/bash

# Node.js service deployment script for personal website
# Usage: ./deploy-service.sh [environment]

set -e

# Configuration
ENVIRONMENT=${1:-production}
REMOTE_USER="your-username"
REMOTE_HOST="your-server-ip"
REMOTE_PATH="/opt/personal-website"
SERVICE_NAME="personal-website"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Node.js service deployment for ${ENVIRONMENT}...${NC}"

# Step 1: Build locally
echo -e "${YELLOW}Installing dependencies and building...${NC}"
npm ci
npm run build

# Step 2: Create deployment package
echo -e "${YELLOW}Creating deployment package...${NC}"
TEMP_DIR=$(mktemp -d)
rsync -av --exclude=node_modules --exclude=.git --exclude=.next --exclude=out ./ ${TEMP_DIR}/

# Copy built files
cp -r .next ${TEMP_DIR}/
cp package*.json ${TEMP_DIR}/

# Create a simple server.js if it doesn't exist
if [ ! -f "server.js" ]; then
    cat > ${TEMP_DIR}/server.js << 'EOF'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
EOF
fi

# Step 3: Deploy to server
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}Deploying to production server...${NC}"
    
    # Stop the service
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl stop ${SERVICE_NAME} || true"
    
    # Create application directory
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo mkdir -p ${REMOTE_PATH}"
    
    # Sync files to server
    rsync -avz --delete ${TEMP_DIR}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
    
    # Set proper ownership
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo chown -R nodejs:nodejs ${REMOTE_PATH}"
    
    # Install production dependencies
    ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && sudo -u nodejs npm ci --only=production"
    
    # Install systemd service
    scp deployment/personal-website.service ${REMOTE_USER}@${REMOTE_HOST}:/tmp/
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo mv /tmp/personal-website.service /etc/systemd/system/ && sudo systemctl daemon-reload"
    
    # Start and enable the service
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl enable ${SERVICE_NAME} && sudo systemctl start ${SERVICE_NAME}"
    
    # Check service status
    echo -e "${YELLOW}Checking service status...${NC}"
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl status ${SERVICE_NAME} --no-pager -l"
    
    # Reload nginx
    ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl reload nginx || true"
    
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    echo -e "${GREEN}Your website should be live at your domain${NC}"
    echo -e "${YELLOW}To check logs: ssh ${REMOTE_USER}@${REMOTE_HOST} 'sudo journalctl -u ${SERVICE_NAME} -f'${NC}"
else
    echo -e "${YELLOW}Build completed. Package is in ${TEMP_DIR}${NC}"
    echo -e "${YELLOW}To deploy manually, copy the contents to your server${NC}"
fi

# Cleanup
rm -rf ${TEMP_DIR}

echo -e "${GREEN}Done!${NC}"