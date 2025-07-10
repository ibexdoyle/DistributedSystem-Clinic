package com.example.prescription_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientEmail;

    private Long doctorId;

    private String doctorName;

    private String diagnosis;

    private String symptoms;

    private String note;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL)
    private List<PrescriptionItem> items;
}