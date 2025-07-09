package com.example.patient_service.controller;

import com.example.patient_service.model.Patient;
import com.example.patient_service.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

//    @PostMapping
//    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient,
//                                                 JwtAuthenticationToken authToken) {
//        Long userId = extractUserId(authToken);
//        patient.setUserId(userId);
//        return ResponseEntity.ok(patientService.createPatient(patient));
//    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient,
                                                 @RequestHeader("X-User-Id") String userEmail) {
        patient.setEmail(userEmail);
        return ResponseEntity.ok(patientService.createPatient(patient));
    }


    @PutMapping()
    public ResponseEntity<Patient> updatePatient(@RequestBody Patient patient,@RequestHeader("X-User-Id") String userEmail) {
        return ResponseEntity.ok(patientService.updatePatient(patient, userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {

        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/me")
    public ResponseEntity<Patient> getMyInfo(@RequestHeader("X-User-Id") String userEmail) {
        return ResponseEntity.ok(patientService.findByUserEmail(userEmail));
    }


//    private Long extractUserId(JwtAuthenticationToken authToken) {
//        Jwt jwt = authToken.getToken();
//        return Long.valueOf(jwt.getClaimAsString("userId"));
//    }

}
