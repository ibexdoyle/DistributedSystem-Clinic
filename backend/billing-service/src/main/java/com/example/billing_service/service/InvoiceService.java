package com.example.billing_service.service;

import com.example.billing_service.model.Invoice;

import java.util.List;

public interface InvoiceService {
    Invoice createInvoice(Long appointmentId, Long patientId, Long doctorId);
    List<Invoice> getInvoicesByPatient(Long patientId);
}
