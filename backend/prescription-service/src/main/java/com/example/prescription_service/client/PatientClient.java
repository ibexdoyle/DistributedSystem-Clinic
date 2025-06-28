package com.example.prescription_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name = "patient-service", url = "http://localhost:8081")
public interface PatientClient {

    @GetMapping("/api/patients/{id}")
    PatientResponse getPatientById(@PathVariable("id") Long id);

    record PatientResponse(Long id, String fullName, String email, String phoneNumber) {}
}
