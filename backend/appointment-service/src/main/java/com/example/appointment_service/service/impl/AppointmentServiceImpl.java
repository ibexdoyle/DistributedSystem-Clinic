package com.example.appointment_service.service.impl;

import com.example.appointment_service.dto.AppointmentRequest;
import com.example.appointment_service.dto.AppointmentResponse;
import com.example.appointment_service.event.AppointmentCreatedEvent;
import com.example.appointment_service.model.Appointment;
import com.example.appointment_service.producer.AppointmentProducer;
import com.example.appointment_service.repository.AppointmentRepository;
import com.example.appointment_service.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentProducer appointmentProducer;

    @Override
    public AppointmentResponse create(AppointmentRequest req) {
        Appointment appointment = Appointment.builder()
                .patientId(req.getPatientId())
                .doctorId(req.getDoctorId())
                .appointmentDateTime(
                        LocalDateTime.of(
                                req.getAppointmentDate(),
                                req.getAppointmentTime())
                )
                .doctorName(req.getDoctorName())
                .medicalSpecialty(req.getMedicalSpecialty())
                .reason(req.getReason())
                .status(Appointment.Status.SCHEDULED)
                .createdAt(LocalDateTime.now())
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        // Gửi event
        appointmentProducer.sendEvent(
                AppointmentCreatedEvent.builder()
                        .appointmentId(saved.getId())
                        .patientId(saved.getPatientId())
                        .doctorId(saved.getDoctorId())
                        .appointmentDateTime(saved.getAppointmentDateTime())
                        .build()
        );

        return map(saved);
    }

    @Override
    public AppointmentResponse updateStatus(Long id, String statusStr) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appt.setStatus(Appointment.Status.valueOf(statusStr.toUpperCase()));
        return map(appointmentRepository.save(appt));
    }

    @Override
    public List<AppointmentResponse> getByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay(); // 00:00
        LocalDateTime end = start.plusDays(1);     // đến trước ngày hôm sau

        return appointmentRepository.findByDateBetween(start, end)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }


    private AppointmentResponse map(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatientId())
                .doctorId(a.getDoctorId())
                .doctorName(a.getDoctorName())
                .medicalSpecialty(a.getMedicalSpecialty())
                .appointmentDateTime(a.getAppointmentDateTime())
                .status(a.getStatus())
                .reason(a.getReason())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
