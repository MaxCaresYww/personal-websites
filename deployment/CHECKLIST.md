# Pre-Deployment Checklist

Before deploying your personal website to production, make sure to complete these steps:

## 1. Update Configuration Files

### Replace placeholder values in:

**Nginx configuration file:**
- [ ] Replace `yourname.com` (later when you have a domain) in:
  - `deployment/nginx-static.conf`

**Deployment scripts:**
- [ ] Update `deployment/deploy-static-atomic.sh`:
  ```bash
  REMOTE_USER="your-actual-username"
  REMOTE_HOST="your-actual-server-ip"
  ```

**Website content:**
- [ ] Update personal information in:
  - `src/components/Header.tsx` - Change "Your Name"
  - `src/components/Footer.tsx` - Update email and social links
  - `src/app/page.tsx` - Update name, bio, and skills
  - `src/app/about/page.tsx` - Update personal information
  - `src/app/contact/page.tsx` - Update contact information

## 2. Server Prerequisites

### On your production server:
- [ ] Ubuntu 22.04 installed
- [ ] Domain DNS pointing to server IP
- [ ] SSH access configured
- [ ] User with sudo privileges created

### Server basics:
- [ ] Nginx installed and configured
- [ ] Firewall configured:
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```

## 3. SSL Certificate

- [ ] Install certbot:
  ```bash
  sudo apt install certbot python3-certbot-nginx
  ```
- [ ] Obtain SSL certificate after nginx is configured:
  ```bash
  sudo certbot --nginx -d yourname.com -d www.yourname.com
  ```

## 4. Prepare Static Export

- [ ] `output: 'export'` in `next.config.ts`
- [ ] (Optional) `trailingSlash: true`
- [ ] Use `deploy-static-atomic.sh`

## 5. Test Locally

- [ ] Run `npm run build` to ensure it builds successfully
- [ ] Test the website locally at http://localhost:3001

## 6. Deploy

### Deploy (atomic preferred):
```bash
./deployment/deploy-static-atomic.sh production
```

## 7. Post-Deployment Verification

- [ ] Website loads at your domain
- [ ] All pages work (Home, Blog, About, Contact)
- [ ] Blog posts load correctly
- [ ] SSL certificate is working (https://)
- [ ] Mobile responsiveness
- [ ] Check server logs for errors

## 8. Ongoing Maintenance

- [ ] Set up automatic SSL renewal:
  ```bash
  sudo crontab -e
  # Add: 0 12 * * * /usr/bin/certbot renew --quiet
  ```
- [ ] Regular server updates
- [ ] (Optional) External uptime monitoring
- [ ] Backup strategy for content

## Troubleshooting

If something goes wrong, check:
- [ ] Nginx configuration: `sudo nginx -t`
- [ ] Nginx logs: access & error
- [ ] DNS resolution
- [ ] Firewall settings

---

Your website should be ready for production deployment! 🚀