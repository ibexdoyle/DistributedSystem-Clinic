package com.example.prescription_service.controller;

import com.example.prescription_service.dto.CreatePrescriptionRequest;
import com.example.prescription_service.dto.PrescriptionResponse;
import com.example.prescription_service.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<PrescriptionResponse> create(@RequestBody CreatePrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.create(request));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getByPatientId(patientId));
    }


}
