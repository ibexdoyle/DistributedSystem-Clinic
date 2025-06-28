package com.example.notification_service.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;


@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String message;

    private LocalDate date;
    private LocalTime time;

    private LocalDateTime createdAt;
}
