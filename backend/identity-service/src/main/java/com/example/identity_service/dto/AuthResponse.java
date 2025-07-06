package com.example.identity_service.dto;

import java.util.List;

public record AuthResponse(
        String token,
        String email,
        String role,
        List<String> permissions
) {}