package com.example.appointment_service.service;

import com.example.appointment_service.dto.AppointmentRequest;
import com.example.appointment_service.dto.AppointmentResponse;

import java.time.LocalDate;
import java.util.List;


public interface AppointmentService {
    AppointmentResponse create(AppointmentRequest request);
    AppointmentResponse updateStatus(Long id, String status);
    List<AppointmentResponse> getByPatient(Long patientId);
    List<AppointmentResponse> getByDoctor(Long doctorId);
    List<AppointmentResponse> getByDate(LocalDate date);
}
