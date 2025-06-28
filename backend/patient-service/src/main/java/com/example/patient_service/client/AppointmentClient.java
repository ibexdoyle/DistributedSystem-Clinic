package com.example.patient_service.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

//@FeignClient(name = "appointment-service", url = "http://localhost:8082")
//public interface AppointmentClient {
//
//    @GetMapping("/api/appointments/patient/{patientId}")
//    List<Object> getAppointmentsByPatient(@PathVariable("patientId") Long patientId);
//}
