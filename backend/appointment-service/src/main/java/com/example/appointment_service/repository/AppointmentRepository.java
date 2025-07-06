package com.example.appointment_service.repository;

import com.example.appointment_service.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime >= :start AND a.appointmentDateTime < :end")
    List<Appointment> findByDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
