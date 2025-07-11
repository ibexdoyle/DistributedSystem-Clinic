package com.example.appointment_service.dto;

import com.example.appointment_service.model.Appointment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String medicalSpecialty;
    private String reason;
    private LocalDateTime appointmentDateTime;
    private Appointment.Status status;
    private LocalDateTime createdAt;
}