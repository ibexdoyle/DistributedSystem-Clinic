package com.example.notification_service.service.impl;

import com.example.notification_service.model.Notification;
import com.example.notification_service.repository.NotificationRepository;
import com.example.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<Notification> getByPatient(Long patientId) {
        return notificationRepository.findByPatientId(patientId);
    }

    @Override
    public List<Notification> getByDoctor(Long doctorId) {
        return notificationRepository.findByDoctorId(doctorId);
    }
}
