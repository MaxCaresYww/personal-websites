# Quick Deployment Reference

## Files Created

```
deployment/
├── DEPLOYMENT.md           # Complete deployment guide
├── CHECKLIST.md           # Pre-deployment checklist
├── personal-website.service # Systemd service file
├── nginx-static.conf      # Nginx config for static files
├── nginx-proxy.conf       # Nginx config for reverse proxy
├── deploy-static.sh       # Static deployment script
├── deploy-service.sh      # Node.js service deployment script
└── ecosystem.config.js    # PM2 config (alternative)
```

## Quick Commands

### Static Deployment
```bash
# Build and deploy static files
./deployment/deploy-static.sh production
```

### Node.js Service Deployment  
```bash
# Deploy as Node.js service
./deployment/deploy-service.sh production
```

### Server Management
```bash
# Check service status
sudo systemctl status personal-website

# View logs
sudo journalctl -u personal-website -f

# Restart service
sudo systemctl restart personal-website

# Reload nginx
sudo systemctl reload nginx
```

### SSL Certificate
```bash
# Get certificate
sudo certbot --nginx -d yourname.com

# Renew certificate
sudo certbot renew
```

## Two Deployment Options

| Feature | Static Export | Node.js Service |
|---------|---------------|-----------------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Resource Usage | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Complexity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| API Routes | ❌ | ✅ |
| Build Process | Static HTML | Server-side |
| Updates | Re-deploy files | Restart service |

**Recommendation: Use Static Export** for better performance and simpler maintenance.

## Before You Deploy

1. ✅ Replace `yourname.com` with your domain
2. ✅ Update server IP in deployment scripts  
3. ✅ Customize personal information in pages
4. ✅ Test build locally: `npm run build`
5. ✅ Set up server prerequisites

## Support

- 📖 Read `DEPLOYMENT.md` for detailed instructions
- ✅ Follow `CHECKLIST.md` step by step
- 🔍 Check troubleshooting section for common issues

Your personal website is ready for production! 🚀