package com.example.billing_service.controller;

import com.example.billing_service.dto.InvoiceRequest;
import com.example.billing_service.model.Invoice;
import com.example.billing_service.service.InvoiceService;
import com.example.billing_service.service.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfExportService pdfExportService;

    @PostMapping("/create")
    public ResponseEntity<Invoice> createInvoice(@RequestBody InvoiceRequest req) {
        Invoice invoice = invoiceService.createInvoice(req.getAppointmentId(), req.getPatientId(), req.getDoctorId());
        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Invoice>> getInvoicesByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByPatient(patientId));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> exportInvoicePdf(@PathVariable Long id) {
        try {
            ByteArrayInputStream bis = pdfExportService.generatePdf(id);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=invoice_" + id + ".pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}

