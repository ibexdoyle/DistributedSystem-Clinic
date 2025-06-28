package com.example.medicine_service.repository;

import com.example.medicine_service.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findByCode(String code);
}
