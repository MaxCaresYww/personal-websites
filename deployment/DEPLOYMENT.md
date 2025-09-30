# Production Deployment Guide (Static Export Only)

This guide explains how to deploy the site as a **pure static export** behind Nginx (no Node.js runtime in production).

## Prerequisites

- Ubuntu 22.04 server (public IP OK, domain optional for now)
- SSH access (key-based recommended)
- Node.js 18+ locally (and on server only if you plan to build there — this guide builds locally)
- (Optional later) A domain + DNS A record

## Overview

The site is exported via `next build` (with `output: 'export'`) into a static `out/` directory. We deploy releases atomically using a timestamped folder plus a `current` symlink.

Benefits:
- No runtime Node.js dependencies on the server (after files are uploaded)
- Simple rollback (switch symlink)
- Fast & cache-friendly

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

### Step 3: Server Setup (Atomic Layout, IP-first)

#### 3.1 Install Nginx
```bash
sudo apt update
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### 3.2 Create Site Directory Structure (atomic releases)
```bash
sudo mkdir -p /var/www/personal-website/releases
sudo mkdir -p /var/www/personal-website/current
sudo chown -R $USER:$USER /var/www/personal-website
```

#### 3.3 Upload Files (via atomic script)
Prefer the atomic script `deployment/deploy-static-atomic.sh` which:
1. Builds locally
2. Tars the `out` directory
3. Uploads to `releases/<timestamp>`
4. Updates `current` symlink
5. Cleans old releases

Manual (fallback):
```bash
rsync -avz out/ user@server:/var/www/personal-website/releases/tmp-upload/
ssh user@server 'ln -sfn /var/www/personal-website/releases/tmp-upload /var/www/personal-website/current && sudo systemctl reload nginx'
```

#### 3.4 Configure Nginx
Use `deployment/nginx-static.conf` (serves `/var/www/personal-website/current`). For IP-only deployment leave `server_name _;`.

```bash
sudo cp deployment/nginx-static.conf /etc/nginx/sites-available/personal-website
sudo ln -s /etc/nginx/sites-available/personal-website /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

#### 3.5 (Optional, later) SSL Certificate
Skip until you have a domain:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```
After confirming HTTPS works, add HSTS to the TLS (443) server block only.

---

## Deployment Scripts

Use the provided deployment scripts for easier management:

### Atomic Static Deployment (Only method)
```bash
chmod +x deployment/deploy-static-atomic.sh
./deployment/deploy-static-atomic.sh production
```

---

## Monitoring and Maintenance

### Check Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
```

### View Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Update Deployment
```bash
./deployment/deploy-static-atomic.sh production
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

1. **Nginx configuration errors**
   - Test config: `sudo nginx -t`
   - Check syntax in configuration files

2. **SSL certificate issues**
   - Verify domain DNS settings
   - Check certificate expiration: `sudo certbot certificates`

3. **Stale cache / assets not updating**
   - Hard refresh or clear CDN/browser cache
   - Ensure atomic script removed old release symlink

---

## Configuration Files Included

- `nginx-static.conf` - Nginx config for static files
- `deploy-static-atomic.sh` - atomic static deployment script
- `ROLLBACK.md` - Release / rollback procedure

---

## Next Steps After Deployment

1. Test your website via IP (or domain when ready)
2. Set up basic monitoring (optional)
3. Configure backup strategy (e.g. tar + rsync of content)
4. Automate deployment (optional CI later)

Your website should now be live and accessible at: `http://<SERVER_IP>/`.

---

## IP-Only Deployment (No Domain Yet)

If you do not yet own a domain:

1. Leave `server_name _;` in both Nginx configs.
2. Do NOT run Certbot yet (will fail without DNS records).
3. Access the site via: `http://<SERVER_IP>/`.
4. When you later acquire a domain:
   ```bash
   # Edit configs
   sudo nano /etc/nginx/sites-available/personal-website
   # Change: server_name _;  ->  server_name example.com www.example.com;
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d example.com -d www.example.com
   # After HTTPS works, add HSTS line inside the 443 server block only.
   ```
5. Update deployment scripts (REMOTE_HOST can stay as IP or switch to domain).

No further changes to the application code are required.