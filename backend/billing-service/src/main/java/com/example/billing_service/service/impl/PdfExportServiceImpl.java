package com.example.billing_service.service.impl;

import com.example.billing_service.model.Invoice;
import com.example.billing_service.repository.InvoiceRepository;
import com.example.billing_service.service.PdfExportService;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class PdfExportServiceImpl implements PdfExportService {

    private final InvoiceRepository invoiceRepository;

    public ByteArrayInputStream generatePdf(Long invoiceId) throws Exception {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);
        document.open();

        Font font = FontFactory.getFont(FontFactory.HELVETICA, 14, Font.BOLD);
        Font normal = FontFactory.getFont(FontFactory.HELVETICA, 12);

        document.add(new Paragraph("HÓA ĐƠN KHÁM CHỮA BỆNH", font));
        document.add(new Paragraph("Ngày lập: " + invoice.getIssueDate(), normal));
        document.add(new Paragraph("Mã hóa đơn: " + invoice.getId(), normal));
        document.add(new Paragraph("Bệnh nhân ID: " + invoice.getPatientId(), normal));
        document.add(new Paragraph("Bác sĩ ID: " + invoice.getDoctorId(), normal));
        document.add(new Paragraph("Lịch hẹn ID: " + invoice.getAppointmentId(), normal));
        document.add(new Paragraph("Phí khám: " + invoice.getConsultationFee() + " VND", normal));
        document.add(new Paragraph("Tiền thuốc: " + invoice.getMedicineFee() + " VND", normal));
        document.add(new Paragraph("Tổng cộng: " + invoice.getTotalAmount() + " VND", font));
        document.add(new Paragraph("Trạng thái thanh toán: " + invoice.getPaymentStatus(), normal));

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }
}
