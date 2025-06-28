package com.example.notification_service.repository;

import com.example.notification_service.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByPatientId(Long patientId);
    List<Notification> findByDoctorId(Long doctorId);
}
