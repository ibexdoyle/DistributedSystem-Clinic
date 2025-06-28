package com.example.billing_service.client;

import com.example.billing_service.dto.MedicineDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "prescription-service")
public interface PrescriptionClient {
    @GetMapping("/api/prescriptions/appointment/{appointmentId}")
    List<MedicineDTO> getPrescriptionByAppointmentId(@PathVariable Long appointmentId);
}

