# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port for Flask
ENV PORT=5000
EXPOSE $PORT

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
