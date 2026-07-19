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

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]