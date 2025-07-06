package com.example.prescription_service.repository;

import com.example.prescription_service.model.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {
}
