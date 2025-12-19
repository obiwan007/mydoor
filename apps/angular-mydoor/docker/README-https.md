# Enabling HTTPS for the Angular frontend (Nginx)

This container can serve HTTPS using a local certificate. The Nginx config expects the certs at:

- `/etc/nginx/certs/server.crt`
- `/etc/nginx/certs/server.key`

Docker Compose mounts `apps/angular-mydoor/docker/certs` to that path.

## Generate a self-signed certificate (local dev)

On macOS, you can generate a cert with SANs (Subject Alternative Names) for `localhost` and your LAN IP:

```bash
# Replace 192.168.178.60 with your host IP if different
openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
  -keyout apps/angular-mydoor/docker/certs/server.key \
  -out apps/angular-mydoor/docker/certs/server.crt \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:192.168.178.60"
```

Alternatively, use [mkcert](https://github.com/FiloSottile/mkcert) for a trusted local CA:

```bash
brew install mkcert nss # if needed
mkcert -install
mkcert -key-file apps/angular-mydoor/docker/certs/server.key \
       -cert-file apps/angular-mydoor/docker/certs/server.crt \
       localhost 127.0.0.1 192.168.178.60
```

## Run

```bash
docker compose build --no-cache frontend
docker compose up -d
```

Visit:
- HTTP: http://localhost:8080
- HTTPS: https://localhost

If using the LAN IP: https://192.168.178.60 (you may need to accept the self-signed certificate).

## Notes
- Do not commit private keys to version control. The `certs/` directory is mounted but not required to be checked in.
- The `/api` proxy continues to forward to the backend service on the Docker network.
