package com.example.prescription_service.service.impl;

import com.example.prescription_service.client.PatientClient;
import com.example.prescription_service.dto.CreatePrescriptionRequest;
import com.example.prescription_service.dto.PrescriptionResponse;
import com.example.prescription_service.model.Prescription;
import com.example.prescription_service.model.PrescriptionItem;
import com.example.prescription_service.repository.PrescriptionRepository;
import com.example.prescription_service.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientClient patientClient;


    @Override
    public PrescriptionResponse create(CreatePrescriptionRequest request) {

//        try {
//            patientClient.getPatientById(request.getPatientId());
//        } catch (Exception e) {
//            throw new RuntimeException("Invalid patient ID: " + request.getPatientId());
//        }



        Prescription prescription = Prescription.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .doctorName(request.getDoctorName())
                .note(request.getNote())
                .totalPrice(request.getTotalPrice())
                .diagnosis(request.getDiagnosis())
                .symptoms(request.getSymptoms())
                .createdAt(LocalDateTime.now())
                .build();

        List<PrescriptionItem> items = request.getItems().stream()
                .map(i -> PrescriptionItem.builder()
                        .medicineName(i.getMedicineName())
                        .dosage(i.getDosage())
                        .instruction(i.getInstruction())
                        .prescription(prescription)
                        .price(i.getPrice())
                        .build())
                .collect(Collectors.toList());

        prescription.setItems(items);
        Prescription saved = prescriptionRepository.save(prescription);

        return mapToResponse(saved);
    }

    @Override
    public List<PrescriptionResponse> getByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponse> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        return prescriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }



    private PrescriptionResponse mapToResponse(Prescription p) {
        List<PrescriptionResponse.Item> items = p.getItems().stream()
                .map(i -> PrescriptionResponse.Item.builder()
                        .medicineName(i.getMedicineName())
                        .dosage(i.getDosage())
                        .instruction(i.getInstruction())
                        .price(i.getPrice())
                        .build())
                .collect(Collectors.toList());

        return PrescriptionResponse.builder()
                .id(p.getId())
                .patientId(p.getPatientId())
                .doctorId(p.getDoctorId())
                .createdAt(p.getCreatedAt())
                .doctorName(p.getDoctorName())
                .diagnosis(p.getDiagnosis())
                .symptoms(p.getSymptoms())
                .note(p.getNote())
                .totalPrice(p.getTotalPrice())
                .items(items)
                .build();
    }

}