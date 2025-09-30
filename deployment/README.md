# Quick Deployment Reference

## Files

```
deployment/
├── DEPLOYMENT.md              # Full static deployment guide
├── CHECKLIST.md               # Static pre-deployment checklist
├── nginx-static.conf          # Nginx site config (IP or domain)
├── deploy-static-atomic.sh    # Atomic deploy script
├── ROLLBACK.md                # Release & rollback guide
```

## Quick Commands

### Deploy
```bash
./deployment/deploy-static-atomic.sh production
```

### Reload Nginx (after config change)
```bash
sudo systemctl reload nginx
```

### SSL Certificate
```bash
# Get certificate
sudo certbot --nginx -d yourname.com

# Renew certificate
sudo certbot renew
```

## Deployment Mode

Static export only (Next.js `output: 'export'`) served by Nginx.

## Before You Deploy

1. ✅ Replace `yourname.com` with your domain
2. ✅ Update server IP in deployment scripts  
3. ✅ Customize personal information in pages
4. ✅ Test build locally: `npm run build`
5. ✅ Set up server prerequisites (Nginx installed)

## Support

- 📖 Read `DEPLOYMENT.md` for detailed instructions
- ✅ Follow `CHECKLIST.md` step by step
- 🔍 Check troubleshooting section for common issues

Your personal website is ready for production! 🚀