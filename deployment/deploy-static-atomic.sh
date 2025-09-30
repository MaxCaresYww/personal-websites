#!/bin/bash

# Atomic static deployment script
# Usage: ./deployment/deploy-static-atomic.sh [environment]

set -euo pipefail

ENVIRONMENT=${1:-production}
REMOTE_USER="root"
REMOTE_HOST="112.124.11.229"
BASE_PATH="/var/www/personal-website"
RELEASES_PATH="${BASE_PATH}/releases"
CURRENT_PATH="${BASE_PATH}/current"
BUILD_DIR="out"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${GREEN}Starting atomic static deployment (${ENVIRONMENT})...${NC}"

echo -e "${YELLOW}Cleaning previous build...${NC}"; rm -rf ${BUILD_DIR}
echo -e "${YELLOW}Installing dependencies...${NC}"; npm ci
echo -e "${YELLOW}Building (export)...${NC}"; npm run build

if [ ! -d "${BUILD_DIR}" ]; then
  echo -e "${RED}Build missing ${BUILD_DIR} directory${NC}"; exit 1
fi

TS=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="static-${TS}"

if [ "${ENVIRONMENT}" != "production" ]; then
  echo -e "${YELLOW}Non-production build complete. Directory: ${BUILD_DIR}${NC}"; exit 0
fi

echo -e "${YELLOW}Creating tarball...${NC}"
TAR_FILE="${RELEASE_DIR}.tar.gz"
tar -czf ${TAR_FILE} -C ${BUILD_DIR} .

echo -e "${YELLOW}Uploading release...${NC}"
scp ${TAR_FILE} ${REMOTE_USER}@${REMOTE_HOST}:/tmp/
rm -f ${TAR_FILE}

echo -e "${YELLOW}Activating release on server...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} bash -s <<EOF
set -e
sudo mkdir -p ${RELEASES_PATH}
cd ${RELEASES_PATH}
NEW_DIR=${RELEASE_DIR}
sudo mkdir -p \"\${NEW_DIR}\"
sudo tar -xzf /tmp/${TAR_FILE} -C \"\${NEW_DIR}\"
sudo rm /tmp/${TAR_FILE}
sudo chown -R root:root \"\${NEW_DIR}\"
sudo chmod -R 755 \"\${NEW_DIR}\"
sudo ln -sfn ${RELEASES_PATH}/\${NEW_DIR} ${CURRENT_PATH}
# Optional: cleanup (keep last 5)
ls -1dt ${RELEASES_PATH}/* | tail -n +6 | xargs -r sudo rm -rf --
EOF

echo -e "${YELLOW}Reloading nginx...${NC}"; ssh ${REMOTE_USER}@${REMOTE_HOST} "sudo systemctl reload nginx"

echo -e "${GREEN}Deployment successful! Active release: ${RELEASE_DIR}${NC}"
echo -e "${YELLOW}Rollback: sudo ln -sfn ${RELEASES_PATH}/<older-release> ${CURRENT_PATH} && sudo systemctl reload nginx${NC}"
echo -e "${YELLOW}Access site at: http://${REMOTE_HOST}/ (replace with domain later)${NC}"
