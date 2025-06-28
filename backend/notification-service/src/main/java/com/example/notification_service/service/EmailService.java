package com.example.notification_service.service;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendNotification(String to, String subject, String body) throws MessagingException;
}
