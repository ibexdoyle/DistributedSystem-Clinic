package com.example.notification_service.model;

import com.example.notification_service.model.enums.NotificationStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private String title;
    private String message;

    private String type;
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;

    private LocalDateTime scheduledTime;

    private LocalDateTime createdAt;

    private NotificationStatus status;
}
