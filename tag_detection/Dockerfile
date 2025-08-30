# Use a slim Python base image for smaller size
FROM python:3.9-slim-bullseye

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install OpenCV Dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libglib2.0-0 \
    libsm6 libxext6 libxrender-dev libxcb-xinerama0 \
    && rm -rf /var/lib/apt/lists/*

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port your application listens on (if it's a web app)
EXPOSE 8000

# Define the command to run your application when the container starts
CMD ["python", "main.py"]