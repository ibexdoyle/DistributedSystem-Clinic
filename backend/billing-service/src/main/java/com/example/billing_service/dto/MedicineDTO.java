package com.example.billing_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MedicineDTO {
    private String name;
    private BigDecimal unitPrice;
    private int quantity;
}

