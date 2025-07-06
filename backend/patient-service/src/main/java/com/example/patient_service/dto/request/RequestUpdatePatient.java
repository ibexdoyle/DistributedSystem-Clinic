package com.example.patient_service.dto.request;

import java.time.LocalDate;

public class RequestUpdatePatient {
    private String fullName;

    private LocalDate dob;

    private String gender;
    private String phoneNumber;
    private String address;
    private String medicalHistory;
}
