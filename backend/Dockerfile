FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Prevent Python from buffering stdout/err
ENV PYTHONUNBUFFERED 1

# Install system dependencies (if any needed e.g. psycopg2 might need gcc etc, 
# but let's assume psycopg2-binary to avoid compile)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Collect static files (for Swagger UI etc)
RUN python manage.py collectstatic --no-input

# Expose port
EXPOSE 8000

# Start the server using gunicorn
CMD ["gunicorn", "repodar.wsgi:application", "--bind", "0.0.0.0:8000"]
