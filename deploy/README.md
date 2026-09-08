# Deploy Math Lab to mathlab.engliew.xyz

Math Lab is now a **Node process** (Next.js standalone) plus **SQLite** for
student accounts and topic progress. It is no longer a static export.

Public URL: **https://mathlab.engliew.xyz**

Host path: **`/opt/mathlab`** (new). The old static tree at
`/opt/mathlab.engliew.xyz` can stay unused after nginx switches to `proxy_pass`.

## Scott — first install / migration (read this)

This release **needs a database migration and a process change**.

1. **New app root:** `/opt/mathlab` (not `/opt/mathlab.engliew.xyz`).
2. **SQLite file:** `/opt/mathlab/data/mathlab.sqlite`  
   Created automatically on first start (`001_users_sessions_progress`).
3. **Node + systemd:** the site is no longer static files. Enable `mathlab.service`.
4. **nginx:** switch from `root /opt/mathlab.engliew.xyz` to proxy `127.0.0.1:47821`.
5. **Old browser progress is not imported.** Students register once; progress then
   follows their login on any device.
6. **Do not touch Meridian `AUTH_SECRET`.** Math Lab does not read it. Do not copy
   it into the mathlab unit. Sessions are random tokens stored in SQLite
   (`mathlab_session` cookie). Optional env is only `MATHLAB_DATA_DIR`.

### One-time host steps

```bash
sudo mkdir -p /opt/mathlab/data
sudo tar -xzf mathlab.tar.gz -C /opt
# archive top folder is mathlab/ → /opt/mathlab/server.js

sudo cp /opt/mathlab/deploy/mathlab.service /etc/systemd/system/mathlab.service
sudo cp /opt/mathlab/deploy/nginx-mathlab.engliew.xyz.conf \
  /etc/nginx/conf.d/mathlab.engliew.xyz.conf

sudo systemctl daemon-reload
sudo systemctl enable --now mathlab
sudo nginx -t && sudo systemctl reload nginx

# Confirm migrations (optional):
sudo -E env MATHLAB_DATA_DIR=/opt/mathlab/data \
  node --import tsx /opt/mathlab/scripts/migrate.ts
# or just hit the site — getDb() applies 001_users_sessions_progress on open.
```

If Certbot already issued `mathlab.engliew.xyz`, keep the existing 443 server
block and change its `location /` to the same `proxy_pass` as the HTTP file.

## Build the host tarball

On a machine with Node 22+:

```bash
npm ci
npm test
npm run build
npm run pack:host   # dist/mathlab.tar.gz
```

## Redeploy

Extract over `/opt/mathlab` (keep `/opt/mathlab/data` — do not delete the
SQLite file), then:

```bash
sudo systemctl restart mathlab
```

New migrations apply automatically the next time the process opens the database.

## Environment (Math Lab only)

| Variable | Required | Purpose |
|----------|----------|---------|
| `MATHLAB_DATA_DIR` | yes on host | Directory for `mathlab.sqlite`. Default in the unit: `/opt/mathlab/data`. |
| `PORT` | set by unit | `47821` |
| `HOSTNAME` | set by unit | `127.0.0.1` |
| `AUTH_SECRET` | **do not set** | Meridian only. Math Lab must not use it. |

Locally, omit env vars. SQLite is created at `./data/mathlab.sqlite`.
