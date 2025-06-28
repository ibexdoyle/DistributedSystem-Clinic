package com.example.notification_service.event;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentEvent{
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private LocalDate date;
    private LocalTime time;
}
