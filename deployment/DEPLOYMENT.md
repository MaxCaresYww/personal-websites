# Production Deployment Guide

This guide will help you deploy your personal website to a production Ubuntu server as a systemd service.

## Prerequisites

- Ubuntu 22.04 server with public IP
- Domain name pointing to your server IP
- SSH access to the server
- Node.js 18+ installed on the server

## Deployment Options

You have two main deployment options:

### Option 1: Static Export + Nginx (Recommended)
- Build static HTML files
- Serve with Nginx
- Fastest performance
- Lower resource usage

### Option 2: Node.js Service + Nginx Proxy
- Run Next.js in production mode
- Nginx as reverse proxy
- Support for API routes (if added later)
- More flexible for future features

---

## Option 1: Static Export Deployment

### Step 1: Configure Next.js for Static Export

Update your `next.config.ts` file to enable static export:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

### Step 2: Build and Export

```bash
# In your development environment
cd /path/to/personal-website
npm run build

# The static files will be in the 'out' directory
```

### Step 3: Server Setup

#### 3.1 Install Nginx
```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### 3.2 Create Site Directory
```bash
sudo mkdir -p /var/www/yourname.com
sudo chown -R $USER:$USER /var/www/yourname.com
sudo chmod -R 755 /var/www/yourname.com
```

#### 3.3 Upload Files
```bash
# From your development machine
rsync -avz --delete out/ user@your-server:/var/www/yourname.com/
```

#### 3.4 Configure Nginx
Use the provided `nginx-static.conf` configuration.

```bash
sudo cp deployment/nginx-static.conf /etc/nginx/sites-available/yourname.com
sudo ln -s /etc/nginx/sites-available/yourname.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3.5 SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourname.com -d www.yourname.com
```

---

## Option 2: Node.js Service Deployment

### Step 1: Server Setup

#### 1.1 Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 1.2 Create Application User
```bash
sudo useradd --system --create-home --shell /bin/bash nodejs
sudo mkdir -p /opt/personal-website
sudo chown nodejs:nodejs /opt/personal-website
```

### Step 2: Deploy Application

#### 2.1 Upload and Install
```bash
# From your development machine
rsync -avz --exclude node_modules --exclude .git --exclude .next . user@your-server:/tmp/personal-website/

# On the server
sudo mv /tmp/personal-website/* /opt/personal-website/
sudo chown -R nodejs:nodejs /opt/personal-website
sudo -u nodejs bash
cd /opt/personal-website
npm ci --only=production
npm run build
exit
```

#### 2.2 Install and Start Systemd Service
```bash
sudo cp deployment/personal-website.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable personal-website
sudo systemctl start personal-website
sudo systemctl status personal-website
```

### Step 3: Configure Nginx as Reverse Proxy

#### 3.1 Install Nginx
```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### 3.2 Configure Nginx
```bash
sudo cp deployment/nginx-proxy.conf /etc/nginx/sites-available/yourname.com
sudo ln -s /etc/nginx/sites-available/yourname.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 3.3 SSL Certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourname.com -d www.yourname.com
```

---

## Deployment Scripts

Use the provided deployment scripts for easier management:

### For Static Deployment
```bash
# Make executable
chmod +x deployment/deploy-static.sh

# Deploy
./deployment/deploy-static.sh production
```

### For Node.js Service Deployment
```bash
# Make executable
chmod +x deployment/deploy-service.sh

# Deploy
./deployment/deploy-service.sh production
```

---

## Monitoring and Maintenance

### Check Service Status
```bash
# For Node.js service
sudo systemctl status personal-website
sudo journalctl -u personal-website -f

# For Nginx
sudo systemctl status nginx
sudo nginx -t
```

### View Logs
```bash
# Application logs (Node.js service)
sudo journalctl -u personal-website -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Update Deployment
```bash
# For static deployment
./deployment/deploy-static.sh production

# For Node.js service
./deployment/deploy-service.sh production
sudo systemctl restart personal-website
```

---

## Security Considerations

1. **Firewall Setup**
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

2. **Regular Updates**
```bash
sudo apt update && sudo apt upgrade
```

3. **SSL Certificate Renewal**
```bash
sudo certbot renew --dry-run
# Add to crontab: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Troubleshooting

### Common Issues

1. **Service won't start**
   - Check logs: `sudo journalctl -u personal-website -f`
   - Verify file permissions
   - Check Node.js version compatibility

2. **Nginx configuration errors**
   - Test config: `sudo nginx -t`
   - Check syntax in configuration files

3. **SSL certificate issues**
   - Verify domain DNS settings
   - Check certificate expiration: `sudo certbot certificates`

4. **Port conflicts**
   - Check what's using port 3000: `sudo netstat -tulpn | grep :3000`
   - Update port in systemd service if needed

---

## Configuration Files Included

- `personal-website.service` - Systemd service file
- `nginx-static.conf` - Nginx config for static files
- `nginx-proxy.conf` - Nginx config for reverse proxy
- `deploy-static.sh` - Static deployment script
- `deploy-service.sh` - Node.js service deployment script
- `ecosystem.config.js` - PM2 configuration (alternative to systemd)

---

## Next Steps After Deployment

1. Test your website at your domain
2. Set up monitoring (optional)
3. Configure backup strategy
4. Set up automatic deployments (optional)

Your website should now be live and accessible at your domain!