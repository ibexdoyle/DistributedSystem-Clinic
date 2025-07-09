package com.example.patient_service.service.impl;

import com.example.patient_service.model.Patient;
import com.example.patient_service.repository.PatientRepository;
import com.example.patient_service.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;



    @Override
    public Patient createPatient(Patient patient) {
        Optional<Patient> userCreated= patientRepository.findByEmail(patient.getEmail());
        if(userCreated.isPresent()){
            return userCreated.get();
        }

        return patientRepository.save(patient);
    }

    @Override
    public Patient updatePatient(Patient updated, String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setFullName(updated.getFullName());
        patient.setDob(updated.getDob());
        patient.setGender(updated.getGender());
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
    public Patient findByUserEmail(String email) {
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found for userId: " + email));
    }

}
