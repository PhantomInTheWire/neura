FROM python:3.12-slim

# Set working directory and environment variables
WORKDIR /app
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.7.1 \
    POETRY_HOME=/opt/poetry \
    POETRY_VIRTUALENVS_CREATE=false

# Install system dependencies and poetry in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apt-get purge -y build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /root/.cache

# Copy poetry files and install dependencies
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-dev --no-root

# Copy application code
COPY . .

# Create non-root user and set permissions
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port and run application
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
