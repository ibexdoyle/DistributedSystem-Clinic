package com.example.identity_service.config;


import com.example.identity_service.model.Role;
import com.example.identity_service.model.enums.Permission;
import com.example.identity_service.model.enums.RoleType;
import com.example.identity_service.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void init() {
        if (roleRepository.findAll().isEmpty()) {
            Role admin = Role.builder()
                    .name(RoleType.ADMIN)
                    .permissions(Set.of(Permission.values()))
                    .build();

            Role doctor = Role.builder()
                    .name(RoleType.DOCTOR)
                    .permissions(Set.of(
                            Permission.VIEW_PATIENT,
                            Permission.VIEW_STAFF,
                            Permission.CREATE_PRESCRIPTION,
                            Permission.VIEW_APPOINTMENT
                    ))
                    .build();

            Role user = Role.builder()
                    .name(RoleType.USER)
                    .permissions(Set.of(
                            Permission.VIEW_APPOINTMENT,
                            Permission.CREATE_APPOINTMENT,
                            Permission.VIEW_PRESCRIPTION,
                            Permission.VIEW_PATIENT,
                            Permission.VIEW_NOTIFICATION

                    ))
                    .build();

            roleRepository.saveAll(List.of(admin, doctor, user));
        }
    }
}

