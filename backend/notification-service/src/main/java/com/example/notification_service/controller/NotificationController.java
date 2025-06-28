package com.example.notification_service.controller;

import com.example.notification_service.model.Notification;
import com.example.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/patient/{patientId}")
    public List<Notification> getByPatient(@PathVariable Long patientId) {
        return notificationService.getByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Notification> getByDoctor(@PathVariable Long doctorId) {
        return notificationService.getByDoctor(doctorId);
    }
}
