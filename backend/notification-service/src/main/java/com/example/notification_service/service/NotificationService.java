package com.example.notification_service.service;

import com.example.notification_service.model.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getByPatient(Long patientId);
    List<Notification> getByDoctor(Long doctorId);

}
