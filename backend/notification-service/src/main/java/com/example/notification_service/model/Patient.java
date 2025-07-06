package com.example.notification_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    private Long id;

    private String fullName;

    private LocalDate dob;

    private String gender;

    private String email;

    private String phoneNumber;

    private String address;

    private String medicalHistory;
}
