package com.example.prescription_service.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePrescriptionRequest {
    private Long patientId;
    private Long doctorId;
    private String doctorName;
    private String diagnosis;
    private String symptoms;
    private Double totalPrice;
    private String note;

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
