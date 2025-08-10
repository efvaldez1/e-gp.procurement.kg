# //
# // Dockerfile
# // This file defines how to build a Docker image for our Spring Boot application.
# // Save this file as `Dockerfile` in the root directory.
# //
# Stage 1: Build the Java application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final, lightweight image
FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/eprocurement-demo-0.0.1-SNAPSHOT.jar eprocurement-demo.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "eprocurement-demo.jar"]