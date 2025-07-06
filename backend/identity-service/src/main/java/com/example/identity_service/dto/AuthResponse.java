package com.example.identity_service.dto;

import java.util.List;

public record AuthResponse(
        String token,
        String username,
        String role,
        List<String> permissions
) {}