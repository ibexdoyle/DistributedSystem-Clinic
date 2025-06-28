package com.example.report_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "prescription-service")
public interface PrescriptionClient {
    @GetMapping("/api/prescriptions/statistics/monthly")
    Map<String, Integer> getPrescriptionCountByMonth(@RequestParam(required = false) String year,
                                                     @RequestParam(required = false) String medicineName);
}

