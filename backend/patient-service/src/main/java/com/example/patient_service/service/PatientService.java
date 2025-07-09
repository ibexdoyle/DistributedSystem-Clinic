package com.example.patient_service.service;

import com.example.patient_service.model.Patient;

import java.util.List;

public interface PatientService {
    Patient createPatient(Patient patient);
    Patient updatePatient(Patient patient, String email);
    Patient getPatientById(Long id);
    List<Patient> getAllPatients();
    void deletePatient(Long id);
//    Patient findByEmail(Long userId);

    Patient findByUserEmail(String email);
}