package com.example.report_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "patient-service")
public interface PatientClient {
    @GetMapping("/api/patients/statistics/monthly")
    Map<String, Integer> getPatientCountByMonth(@RequestParam(required = false) String year,
                                                @RequestParam(required = false) String doctorId);
}

