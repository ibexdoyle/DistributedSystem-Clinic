package com.example.api_gateway.controller;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class JwtTestController {

    @GetMapping("/jwt-info")
    public Map<String, Object> jwtInfo(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
                "subject", jwt.getSubject(),
                "permissions", jwt.getClaimAsStringList("permissions"),
                "role", jwt.getClaimAsString("role"),
                "expiresAt", jwt.getExpiresAt()
        );
    }
}