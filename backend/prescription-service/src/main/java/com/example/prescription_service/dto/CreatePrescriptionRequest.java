package com.example.prescription_service.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePrescriptionRequest {
    private Long patientId;
    private Long doctorId;
    private List<Item> items;

    @Data
    public static class Item {
        private String medicineName;
        private String dosage;
        private String instruction;
    }
}
