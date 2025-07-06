package com.example.identity_service.dto;

import com.example.identity_service.model.enums.RoleType;

public record RegisterRequest(String email, String password, RoleType roleType) {}
