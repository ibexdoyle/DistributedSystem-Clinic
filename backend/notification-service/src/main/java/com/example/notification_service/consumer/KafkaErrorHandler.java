package com.example.notification_service.consumer;


import org.springframework.kafka.listener.KafkaListenerErrorHandler;
import org.springframework.kafka.listener.ListenerExecutionFailedException;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

@Component("customKafkaErrorHandler")
public class KafkaErrorHandler implements KafkaListenerErrorHandler {

    @Override
    public Object handleError(Message<?> message, ListenerExecutionFailedException exception) {
        System.err.println("❌ Kafka Error: " + exception.getMessage());
        System.err.println("⚠️ Message failed: " + message.getPayload());
        return null;
    }
}

