# syntax=docker/dockerfile:1

# ---- Stage 1: build dependencies ----
FROM python:3.12-alpine AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---- Stage 2: small runtime image ----
FROM python:3.12-alpine
WORKDIR /app
ENV FLASK_APP=app.py \
    FLASK_RUN_HOST=0.0.0.0 \
    FLASK_RUN_PORT=5000 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
COPY --from=builder /install /usr/local

# Non-root user; flask_session is writable so it can be mounted as a volume
RUN adduser -D -u 10001 appuser \
    && mkdir -p /app/flask_session \
    && chown -R appuser:appuser /app
COPY --chown=appuser:appuser . .
USER appuser

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import socket; socket.create_connection(('127.0.0.1', 5000), 3)" || exit 1
CMD ["flask", "run"]
