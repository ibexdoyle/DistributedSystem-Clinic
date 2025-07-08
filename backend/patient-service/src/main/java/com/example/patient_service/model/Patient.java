package com.example.patient_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    private LocalDate dob;

    private String gender;

    @Column(unique = true)
    private String email;

    private Long userId;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String address;

    @Lob
    @Column(name = "medical_history")
    private String medicalHistory;
}
