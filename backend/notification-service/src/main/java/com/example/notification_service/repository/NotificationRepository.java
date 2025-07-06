package com.example.notification_service.repository;

import com.example.notification_service.model.Notification;
import com.example.notification_service.model.enums.NotificationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByPatientId(Long patientId);
    List<Notification> findByDoctorId(Long doctorId);
    List<Notification> findByStatusAndScheduledTimeBefore(NotificationStatus status, LocalDateTime time);

}
