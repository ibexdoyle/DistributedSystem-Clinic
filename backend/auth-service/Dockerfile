# Sử dụng image Java runtime tối ưu
FROM openjdk:17-jdk-slim

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file jar vào container
COPY target/*.jar app.jar

# Khai báo port
EXPOSE 8081

# Lệnh chạy service
ENTRYPOINT ["java", "-jar", "app.jar"]
