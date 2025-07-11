package com.example.appointment_service.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String medicalSpecialty;
    private String reason;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
}