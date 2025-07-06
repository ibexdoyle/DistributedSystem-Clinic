package com.example.identity_service.repository;

import com.example.identity_service.model.Role;
import com.example.identity_service.model.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}