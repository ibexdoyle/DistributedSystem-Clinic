package com.example.notification_service.client;

import com.example.notification_service.dto.StaffDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "staff-service")
public interface StaffClient {

    @GetMapping("/api/staff/{id}")
    StaffDTO getStaffById(@PathVariable("id") Long id);
}

