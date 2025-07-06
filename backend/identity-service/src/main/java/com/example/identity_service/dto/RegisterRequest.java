package com.example.identity_service.dto;

import com.example.identity_service.model.enums.RoleType;

public record RegisterRequest(String username, String password, RoleType roleType) {}
