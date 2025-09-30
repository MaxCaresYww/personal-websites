# Rollback & Release Management

This project now uses an atomic, symlink-based deployment strategy for both static and service modes.

## Directory Layout

Static mode:
```
/var/www/personal-website/
  releases/
    static-20250930123045/
    static-20250929114512/
  current -> releases/static-20250930123045
```

Service mode:
```
/opt/personal-website/
  releases/
    personal-website-20250930123110/
  current -> releases/personal-website-20250930123110
  env/.env (optional)
```

## Rollback Procedure (Static)
1. `ssh user@server`
2. `cd /var/www/yourname.com/releases`
3. List releases: `ls -1dt *`
4. Point `current` to an older one:
   ```bash
   sudo ln -sfn /var/www/yourname.com/releases/static-<timestamp> /var/www/yourname.com/current
   sudo systemctl reload nginx
   ```

## Rollback Procedure (Service)
1. `ssh user@server`
2. `cd /opt/personal-website/releases && ls -1dt *`
3. Update symlink:
   ```bash
   sudo ln -sfn /opt/personal-website/releases/personal-website-<timestamp> /opt/personal-website/current
   sudo systemctl restart personal-website
   ```
4. Verify:
   ```bash
   sudo systemctl status personal-website --no-pager
   curl -I https://yourname.com
   ```

## Cleaning Old Releases
Static script already keeps last 5. For service mode (manual cleanup):
```bash
cd /opt/personal-website/releases
ls -1dt * | tail -n +6 | xargs -r sudo rm -rf --
```

## Verifying a Release Before Promotion (Advanced)
1. Deploy to a new folder without switching symlink.
2. Run health checks (curl localhost:3000/health).
3. Switch symlink if healthy.

## Common Issues
| Symptom | Fix |
|---------|-----|
| 404 after deploy (static) | Ensure page exported; re-run build. |
| Service fails ExecStartPre | Build missing: rebuild locally & redeploy. |
| Old assets cached | Invalidate CDN/browser; versioned asset names mitigate this. |

## Notes
- Don’t manually edit inside a release directory—treat releases as immutable.
- Use a new release for every change; never re-use a timestamped folder.
