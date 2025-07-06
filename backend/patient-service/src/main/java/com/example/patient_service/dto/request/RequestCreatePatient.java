package com.example.patient_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class RequestCreatePatient {
    @NotBlank
    private String fullName;

    @NotNull
    private LocalDate dob;

    @NotBlank
    private String gender;

    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    private String address;
    private String medicalHistory;
}
