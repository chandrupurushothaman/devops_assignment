# Use an official Maven image to build the JAR
FROM maven:3.9.9-eclipse-temurin-17 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Set the environment variable for profile (staging/production)
ARG DEPLOY_ENV=staging

# Build the JAR file using the specified profile
RUN mvn clean package -Dspring.profiles.active=${DEPLOY_ENV}

# Second stage: Create a lightweight image to run the JAR
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy the generated JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the application port (8080 for prod, 8081 for staging)
ARG DEPLOY_ENV=staging
EXPOSE 8081

# Set the environment variable inside the container
ENV DEPLOY_ENV=${DEPLOY_ENV}

# Run the JAR file with the correct profile
CMD ["sh", "-c", "java -jar app.jar --spring.profiles.active=$DEPLOY_ENV --server.port=$([ \"$DEPLOY_ENV\" = \"production\" ] && echo 8082 || echo 8081)"]