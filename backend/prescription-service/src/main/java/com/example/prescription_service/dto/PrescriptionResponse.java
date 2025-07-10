package com.example.prescription_service.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String doctorName;
    private String diagnosis;
    private String symptoms;
    private String note;
    private Double totalPrice;

    private LocalDateTime createdAt;
    private List<Item> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Item {
        private String medicineName;
        private String dosage;
        private String instruction;
        private Double price;
    }
}
