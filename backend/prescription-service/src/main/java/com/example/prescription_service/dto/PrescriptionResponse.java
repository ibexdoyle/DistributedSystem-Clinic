package com.example.prescription_service.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime createdAt;
    private List<Item> items;

    @Data
    @AllArgsConstructor
    public static class Item {
        private String medicineName;
        private String dosage;
        private String instruction;
    }
}
