package com.example.medicine_service.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineRequest {
    private String name;
    private String description;
    private String unit;
    private Integer stockQuantity;
    private LocalDate expiryDate;
    private Double price;
    private String provider;
}
