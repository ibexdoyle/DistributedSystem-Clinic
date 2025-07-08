package com.example.patient_service.service.impl;

import com.example.patient_service.model.Patient;
import com.example.patient_service.repository.PatientRepository;
import com.example.patient_service.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;



    @Override
    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public Patient updatePatient(Long id, Patient updated) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setFullName(updated.getFullName());
        patient.setDob(updated.getDob());
        patient.setGender(updated.getGender());
        patient.setEmail(updated.getEmail());
        patient.setPhoneNumber(updated.getPhoneNumber());
        patient.setAddress(updated.getAddress());
        patient.setMedicalHistory(updated.getMedicalHistory());
        return patientRepository.save(patient);
    }

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }


    @Override
    public Patient findByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found for userId: " + userId));
    }

}
