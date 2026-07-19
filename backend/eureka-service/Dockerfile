# FROM eclipse-temurin:17-jdk

# WORKDIR /app

# COPY target/eureka-service-0.0.1-SNAPSHOT.jar app.jar

# EXPOSE 8761

# ENTRYPOINT ["java", "-jar", "app.jar"]


# ---------- Build ----------
FROM maven:3.9.15-eclipse-temurin-17 AS builder

WORKDIR /build

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests


# ---------- Runtime ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java","-jar","app.jar"]