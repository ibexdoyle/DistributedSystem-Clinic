package com.example.api_gateway.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IntrospectRequest {
    private String token;
}
