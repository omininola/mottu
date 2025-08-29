# Use a slim Python base image for smaller size
FROM python:3.9-slim-buster

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port your application listens on (if it's a web app)
# EXPOSE 8000

# Define the command to run your application when the container starts
CMD ["python", "read_tag_file.py"]