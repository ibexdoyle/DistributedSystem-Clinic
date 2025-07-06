package com.example.notification_service.consumer;

import com.example.notification_service.event.AppointmentEvent;
import com.example.notification_service.model.Notification;
import com.example.notification_service.model.enums.NotificationStatus;
import com.example.notification_service.repository.NotificationRepository;
import com.example.notification_service.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;


@Component
@Slf4j
public class AppointmentConsumer {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @KafkaListener(topics = "appointment-created",
            groupId = "notification-group",
            errorHandler = "customKafkaErrorHandler")
    public void consume(ConsumerRecord<String, AppointmentEvent> record) {
        AppointmentEvent event = record.value();

        Notification forPatient = Notification.builder()
                .appointmentId(event.getAppointmentId())
                .patientId(event.getPatientId())
                .doctorId(event.getDoctorId())
                .type("PATIENT")
                .title("Lịch khám với bác sĩ")
                .message("Bạn có lịch khám vào " + event.getAppointmentDateTime().toLocalDate() + " lúc " +
                        event.getAppointmentDateTime().toLocalTime())
                .status(NotificationStatus.PENDING)
                .scheduledTime(event.getAppointmentDateTime().minusHours(2))
                .createdAt(LocalDateTime.now())
                .build();

        Notification forDoctor = Notification.builder()
                .appointmentId(event.getAppointmentId())
                .patientId(event.getPatientId())
                .doctorId(event.getDoctorId())
                .type("DOCTOR")
                .title("Bệnh nhân mới vừa đặt lịch khám")
                .message("Bạn có lịch khám với bệnh nhân vào " +event.getAppointmentDateTime().toLocalDate() + " lúc " +
                        event.getAppointmentDateTime().toLocalTime())
                .status(NotificationStatus.PENDING)
                .scheduledTime(event.getAppointmentDateTime().minusHours(2))
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(forPatient);
        notificationRepository.save(forDoctor);


        // Gửi thông báo qua WebSocket cho frontend
        String patientTopic = "/topic/patient/" + event.getPatientId();
        String doctorTopic = "/topic/doctor/" + event.getDoctorId();

        String message = "Nhắc lịch khám lúc " + event.getAppointmentDateTime().toLocalTime() + " ngày "
                + event.getAppointmentDateTime().toLocalDate();

        messagingTemplate.convertAndSend(patientTopic, message);
        messagingTemplate.convertAndSend(doctorTopic, message);


        // Gui thông baó qua Gmail
        try {
            String subject = "Nhắc lịch khám bệnh";
            String patientBody = "Bạn có lịch khám vào " + event.getAppointmentDateTime().toLocalDate() + " lúc "
                    + event.getAppointmentDateTime().toLocalTime();
            String doctorBody = "Bạn có lịch hẹn với bệnh nhân vào " + event.getAppointmentDateTime().toLocalDate() + " lúc "
                    + event.getAppointmentDateTime().toLocalTime();

            // Ví dụ giả lập email - bạn cần fetch email thực qua Feign nếu muốn
            emailService.sendNotification("patient@example.com", subject, patientBody);
            emailService.sendNotification("doctor@example.com", subject, doctorBody);
        } catch (Exception e) {
            log.error("Gửi email thất bại: {}", e.getMessage());
        }



        log.info("Đã gửi thông báo nhắc lịch cho bệnh nhân {} và bác sĩ {}", event.getPatientId(), event.getDoctorId());
    }


}
