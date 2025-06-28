package com.example.billing_service.service.impl;

import com.example.billing_service.client.PrescriptionClient;
import com.example.billing_service.dto.MedicineDTO;
import com.example.billing_service.model.Invoice;
import com.example.billing_service.repository.InvoiceRepository;
import com.example.billing_service.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;

    private final PrescriptionClient prescriptionClient;

    @Override
    public Invoice createInvoice(Long appointmentId, Long patientId, Long doctorId) {
        List<MedicineDTO> medicines = prescriptionClient.getPrescriptionByAppointmentId(appointmentId);

        BigDecimal medicineFee = medicines.stream()
                .map(med -> med.getUnitPrice().multiply(BigDecimal.valueOf(med.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal consultationFee = new BigDecimal("200000"); // giả định 200k/lượt
        BigDecimal total = consultationFee.add(medicineFee);

        Invoice invoice = Invoice.builder()
                .appointmentId(appointmentId)
                .patientId(patientId)
                .doctorId(doctorId)
                .medicineFee(medicineFee)
                .consultationFee(consultationFee)
                .totalAmount(total)
                .issueDate(LocalDate.now())
                .paymentStatus("PENDING")
                .build();

        return invoiceRepository.save(invoice);
    }

    @Override
    public List<Invoice> getInvoicesByPatient(Long patientId) {
        return invoiceRepository.findByPatientId(patientId);
    }
}

