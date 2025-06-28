package com.example.billing_service.service;

import java.io.ByteArrayInputStream;

public interface PdfExportService {
    ByteArrayInputStream generatePdf(Long invoiceId);
}
