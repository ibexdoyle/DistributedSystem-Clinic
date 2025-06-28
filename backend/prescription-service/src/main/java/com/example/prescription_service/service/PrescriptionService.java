package com.example.prescription_service.service;

import com.example.prescription_service.dto.CreatePrescriptionRequest;
import com.example.prescription_service.dto.PrescriptionResponse;

import java.util.List;

public interface PrescriptionService {
    PrescriptionResponse create(CreatePrescriptionRequest request);
    List<PrescriptionResponse> getByPatientId(Long patientId);
}
