package com.example.prescription_service.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "prescription_items")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicineName;

    private String dosage;

    private String instruction;

    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;
}
