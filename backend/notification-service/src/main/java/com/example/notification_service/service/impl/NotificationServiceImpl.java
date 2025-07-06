package com.example.notification_service.service.impl;

import com.example.notification_service.client.PatientClient;
import com.example.notification_service.client.StaffClient;
import com.example.notification_service.dto.PatientDTO;
import com.example.notification_service.dto.StaffDTO;
import com.example.notification_service.model.Notification;
import com.example.notification_service.model.enums.NotificationStatus;
import com.example.notification_service.repository.NotificationRepository;
import com.example.notification_service.service.EmailService;
import com.example.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final EmailService emailService;

    private final PatientClient patientClient;

    private final StaffClient staffClient;

    @Override
    public List<Notification> getByPatient(Long patientId) {

        return notificationRepository.findByPatientId(patientId);
    }

    @Override
    public List<Notification> getByDoctor(Long doctorId) {

        return notificationRepository.findByDoctorId(doctorId);
    }

    @Scheduled(fixedRate = 60000) // mỗi 1 phút
    public void processScheduledNotifications() {
        List<Notification> dueNotis = notificationRepository.findByStatusAndScheduledTimeBefore(
                NotificationStatus.PENDING, LocalDateTime.now()
        );

        for (Notification n : dueNotis) {
            try {
                PatientDTO patient = patientClient.getPatientById(n.getPatientId());
                StaffDTO doctor = staffClient.getStaffById(n.getDoctorId());

                emailService.sendNotification(n); // Hoặc websocket/SMS
                n.setStatus(NotificationStatus.SENT);
                notificationRepository.save(n);
                log.info("Đã gửi thông báo cho receiverId={}", n.getReceiverId());
            } catch (Exception e) {
                log.error("Gửi thông báo thất bại: {}", e.getMessage());
            }
        }
    }
}
