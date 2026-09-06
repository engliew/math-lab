# Deploy Math Lab to mathlab.engliew.xyz

Math Lab is a **static export**. There is no Node server and **no environment variables** on the host. Student progress stays in the browser (`localStorage`).

This matches the engliew.xyz lab box pattern (Amazon Linux + nginx + Let’s Encrypt), except the vhost serves files instead of `proxy_pass` to a local port.

## Build the host tarball

On a machine with Node 20+:

```bash
npm ci
npm test
npm run build      # writes ./out
npm run pack:host  # writes dist/mathlab.engliew.xyz.tar.gz
```

The archive top folder is `mathlab.engliew.xyz/` (the static site plus `DEPLOY.txt`).

## Scott — drop on the lab host

```bash
sudo mkdir -p /opt/mathlab.engliew.xyz
sudo tar -xzf mathlab.engliew.xyz.tar.gz -C /opt
# results in /opt/mathlab.engliew.xyz/index.html
sudo cp deploy/nginx-mathlab.engliew.xyz.conf \
  /etc/nginx/conf.d/mathlab.engliew.xyz.conf
sudo nginx -t && sudo systemctl reload nginx
```

DNS (same Elastic IP as meridian / srshoot / the other `*.engliew.xyz` labs):

| Name | Type | Value |
|------|------|--------|
| `mathlab` | A | lab box public IP |

Then HTTPS, same Certbot flow as the other labs:

```bash
sudo certbot --nginx -d mathlab.engliew.xyz
```

Public URL: **https://mathlab.engliew.xyz**

## Redeploy

Rebuild the tarball, extract over `/opt/mathlab.engliew.xyz`, reload nginx. No process restart.

## Why not a Node server

Every page is a client component. Lessons and scores run in the browser. A static `out/` tree is enough for nginx and avoids another systemd unit on the lab box.
