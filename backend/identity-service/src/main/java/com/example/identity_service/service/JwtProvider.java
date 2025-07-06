package com.example.identity_service.service;

import com.example.identity_service.config.JwtProperties;
import com.example.identity_service.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtProvider {

    private final JwtProperties props;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(props.getSignerKey().getBytes());
    }

    public String generateToken(User user) {
        List<String> permissions = user.getRole().getPermissions()
                .stream()
                .map(Enum::name)
                .toList();

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("permissions", permissions)
                .claim("role", user.getRole().getName().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + props.getExpiration()))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
}