package com.example.staff_service.repository;

import com.example.staff_service.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StaffRepository extends JpaRepository<Staff, Long> {
}
