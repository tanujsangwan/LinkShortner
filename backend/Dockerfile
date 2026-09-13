# Build stage
FROM eclipse-temurin:23-jdk AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Download Maven wrapper or use system maven
RUN apt-get update && apt-get install -y maven && \
    mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:23-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
