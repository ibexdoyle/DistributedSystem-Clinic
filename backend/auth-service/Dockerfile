## Sử dụng image Java runtime tối ưu
#FROM openjdk:17-jdk-slim
#
## Tạo thư mục làm việc trong container
#WORKDIR /app
#
## Copy file jar vào container
#COPY target/*.jar app.jar
#
## Khai báo port
#EXPOSE 8081
#
## Lệnh chạy service
#ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
