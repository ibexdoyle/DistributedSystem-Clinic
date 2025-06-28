package com.example.report_service.controller;

import com.example.report_service.service.ReportService;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/summary/monthly")
    public ResponseEntity<Map<String, Map<String, Integer>>> getMonthlySummary(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String medicineName
    ) {
        Map<String, Map<String, Integer>> result = new HashMap<>();
        result.put("patients", reportService.getPatientsPerMonth(year, doctorId));
        result.put("prescriptions", reportService.getPrescriptionsPerMonth(year, medicineName));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/summary/pdf")
    public ResponseEntity<byte[]> getMonthlySummaryPdf(
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String medicineName
    ) throws Exception {
        Map<String, Map<String, Integer>> result = new HashMap<>();
        result.put("patients", reportService.getPatientsPerMonth(year, doctorId));
        result.put("prescriptions", reportService.getPrescriptionsPerMonth(year, medicineName));

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        document.add(new Paragraph("Clinic Monthly Report"));
        document.add(new Paragraph("Year: " + (year != null ? year : "All")));
        document.add(new Paragraph("Doctor ID: " + (doctorId != null ? doctorId : "All")));
        document.add(new Paragraph("Medicine: " + (medicineName != null ? medicineName : "All")));

        document.add(new Paragraph("\nPatients by Month:"));
        result.get("patients").forEach((month, count) -> {
            try {
                document.add(new Paragraph(month + ": " + count + " patients"));
            } catch (DocumentException e) {
                e.printStackTrace();
            }
        });

        document.add(new Paragraph("\nPrescriptions by Month:"));
        result.get("prescriptions").forEach((month, count) -> {
            try {
                document.add(new Paragraph(month + ": " + count + " prescriptions"));
            } catch (DocumentException e) {
                e.printStackTrace();
            }
        });

        document.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(out.toByteArray());
    }
}


