# --- Stage 1: Build the Spring Boot application ---
# Use a JDK image to build the project.
FROM eclipse-temurin:21-jdk-jammy AS builder

# Set the working directory.
WORKDIR /app

# Copy Maven/Gradle files and download dependencies. This step is cached if not changed.
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code.
COPY src src

# Package the application into a JAR file, skipping tests.
RUN ./mvnw package -DskipTests

# --- Stage 2: Create the final, lightweight runtime image ---
# Use a minimal JRE image.
FROM eclipse-temurin:21-jre-jammy

# Set up a non-root user for security.
RUN groupadd --system springboot && useradd --system --gid springboot springboot
USER springboot

# Set environment variables for the JVM and active Spring profiles.
ENV SPRING_PROFILES_ACTIVE=prod

# Expose the application's default port.
EXPOSE 8080

# Copy the packaged JAR file from the 'builder' stage.
COPY --from=builder /app/target/*.jar app.jar

# Define the command to run the application.
ENTRYPOINT ["java", "-jar", "/app.jar"]
