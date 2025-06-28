package com.example.billing_service.dto;

import lombok.Data;

@Data
public class InvoiceRequest {
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
}

