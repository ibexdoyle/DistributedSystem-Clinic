package com.example.appointment_service.producer;

import com.example.appointment_service.event.AppointmentCreatedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class AppointmentProducer {

    private static final String TOPIC = "appointment-created";

    @Autowired
    private KafkaTemplate<String, AppointmentCreatedEvent> kafkaTemplate;

    public void sendEvent(AppointmentCreatedEvent event) {

        kafkaTemplate.send(TOPIC, event);
    }
}
