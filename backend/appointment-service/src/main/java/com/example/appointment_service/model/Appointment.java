package com.example.appointment_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private Long doctorId;

    private LocalDate date;
    private LocalTime time;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String reason;
    private LocalDateTime createdAt;

    public enum Status {
        SCHEDULED,
        CONFIRMED,
        CANCELLED
    }
}
