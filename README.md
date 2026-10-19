# Wash World – containerised application

A three-tier app run with Docker Compose:

| Service      | Tech                       | Host port            | Purpose |
|--------------|----------------------------|----------------------|---------|
| `frontend`   | Next.js 16 (Node 22 alpine)| 3000                 | Web UI |
| `web`        | Flask (Python 3.12 alpine) | 80 (container: 5000) | REST API / backend |
| `mariadb`    | MariaDB 10.6               | 127.0.0.1:3306       | Database |
| `phpmyadmin` | phpMyAdmin 5.2             | 127.0.0.1:8080       | DB admin UI |

Source: https://github.com/SophiaAnina/docker-eksempel

## What is used (and why)

- **Multi-stage builds** – both Dockerfiles build/install dependencies in a throw-away stage and copy only the result into a small `alpine` runtime image (backend ≈ 110 MB, frontend uses Next.js `standalone` output).
- **Rootless** – backend runs as `appuser` (uid 10001), frontend as `nextjs`; containers also use `cap_drop: ALL`, `no-new-privileges` and a read-only root filesystem (`/tmp` is a tmpfs).
- **Volumes**
  - `backend_mariadb_data` (named) – database files persist across `down`/`up`.
  - `washworld_flask_sessions` (named) – Flask login sessions persist.
  - `./washworld_eksamen_backend_2026 -> /app` (bind mount, read-only) – edit the code on the host and Flask reloads it.
  - `./db/init -> /docker-entrypoint-initdb.d` – database schema loaded the first time the DB volume is empty.
- **Named network** – all services share `washworld_net`; the backend reaches the DB by the host name `mariadb`.
- **Resource limits** – CPU/memory limits per service (`deploy.resources.limits`).
- **Health checks** – MariaDB and the backend have health checks; dependent services wait until they are healthy.
- **Least exposure** – DB and phpMyAdmin are only published on `127.0.0.1`.

## Compose files

| File | Use |
|------|-----|
| `docker-compose.yml` | Base: all services, `washworld_net` network, named volumes, limits, hardening |
| `docker-compose.override.yml` | **Dev**, loaded automatically by `docker compose up`: bind-mounts the backend code and enables Flask debug reload |
| `docker-compose.prod.yml` | **Production-like**: baked code only, `restart: always`, log rotation, no DB port on the host, phpMyAdmin only with `--profile tools` |
| `docker-compose.ngrok.yml` + `ngrok.yml` | Optional ngrok tunnels for the frontend and the API |

```bash
docker compose up -d --build                                                         # dev
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build        # prod-like
docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile tools up -d  # + phpMyAdmin
```

## Run it

Requirements: Docker Desktop / Docker Engine with Compose v2.

```bash
git clone https://github.com/SophiaAnina/docker-eksempel.git
cd docker-eksempel
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
docker compose up -d --build
docker compose ps           # wait until mariadb and web are "healthy"
```

Open:

- App: http://localhost:3000
- API: http://localhost:80
- phpMyAdmin: http://localhost:8080 (user `root`, password from `.env`, default `password`)

Stop:

```bash
docker compose down        # keeps the volumes (data is kept)
docker compose down -v     # also deletes the volumes (fresh database next time)
```

Useful commands: `docker compose logs -f web`, `docker compose build --no-cache`, `docker compose exec mariadb mariadb -uroot -p`.

> The database credentials (`root` / `password`, database `washworld_eksamen`, host `mariadb`) are hardcoded in the backend (`x.py`), so `DB_ROOT_PASSWORD` in `.env` must stay `password`. For a real deployment, read them from environment variables/secrets instead.

## Test the Dockerfiles individually

```bash
docker build -t washworld/backend ./washworld_eksamen_backend_2026
docker build -t washworld/frontend --build-arg NEXT_PUBLIC_API_URL=http://localhost:80 ./washworld_eksame_frontend_2026
docker run --rm washworld/backend id          # shows uid 10001 (not root)
```

## Change the application dynamically

1. `docker compose up -d`
2. Edit any file in `washworld_eksamen_backend_2026/` (e.g. a route in `app.py` or a template). Flask runs with `FLASK_DEBUG=1` and reloads automatically – check `docker compose logs -f web` and refresh the browser.
3. Data changes survive `docker compose down` followed by `docker compose up -d` because of the named DB volume.

The frontend is a production build; after changing frontend code run `docker compose up -d --build frontend`. `NEXT_PUBLIC_API_URL` is baked into the frontend at build time, so rebuild when it changes.

## Monitor resource usage

```bash
docker stats                                  # live CPU / memory / network
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
```

Typical idle numbers: Flask ≈ 70 MB, MariaDB ≈ 65 MB, Next.js ≈ 35 MB, phpMyAdmin ≈ 15 MB — all well below their limits (256–512 MB).

## Optional: remote access

**SSH port forwarding** (run the stack on a remote machine, view it locally):

```bash
ssh -L 3000:127.0.0.1:3000 -L 80:127.0.0.1:80 you@your_remote
```

Then open http://localhost:3000. The browser calls the API on `localhost:80`, so both ports are forwarded.

**ngrok** (public demo): the browser must reach the API too, so both are tunnelled (`ngrok.yml`) and the frontend is rebuilt with the API's public URL:

```bash
# 1. put your token in .env:  NGROK_AUTHTOKEN=...
docker compose -f docker-compose.yml -f docker-compose.ngrok.yml up -d ngrok
# 2. open http://localhost:4040 and copy the public https URL of the "api" tunnel
# 3. put it in .env:  NEXT_PUBLIC_API_URL=https://<api-tunnel>.ngrok-free.app
docker compose -f docker-compose.yml -f docker-compose.ngrok.yml up -d --build frontend
# 4. share the public https URL of the "frontend" tunnel (shown in http://localhost:4040)
```

## Project layout

```
docker-compose.yml                      # services, network, volumes, limits
docker-compose.override.yml             # dev overrides (auto-loaded)
docker-compose.prod.yml                 # production-like overrides
docker-compose.ngrok.yml, ngrok.yml     # optional public tunnel
.env.example                            # copy to .env
db/init/01-schema.sql                   # DB schema (no data) loaded on first start
washworld_eksamen_backend_2026/         # Flask API + Dockerfile (multi-stage, non-root)
washworld_eksame_frontend_2026/         # Next.js UI + Dockerfile (multi-stage, non-root)
```
