//package com.example.api_gateway.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authorization.AuthorizationDecision;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
//import org.springframework.security.config.web.server.ServerHttpSecurity;
//import org.springframework.security.oauth2.jwt.*;
//import org.springframework.security.web.server.SecurityWebFilterChain;
//import reactor.core.publisher.Mono;
//
//import java.util.List;
//
//@Configuration
//@EnableWebFluxSecurity
//public class GatewaySecurityConfig {
//
//    @Bean
//    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, ReactiveJwtDecoder jwtDecoder) {
//        return http
//                .csrf(ServerHttpSecurity.CsrfSpec::disable)
//                .authorizeExchange(exchanges -> exchanges
//
//                        // Public
//                        .pathMatchers("/api/auth/**").permitAll()
//
//                        // Doctor-only APIs
//                        .pathMatchers("/api/prescriptions/**").access(this.hasPermission("CREATE_PRESCRIPTION"))
//                        .pathMatchers("/api/appointments/**").access(this.hasPermission("VIEW_APPOINTMENT"))
//
//                        // Admin-only APIs
//                        .pathMatchers("/api/staffs/**").access(this.hasPermission("MANAGE_USERS"))
//                        .pathMatchers("/api/reports/**").access(this.hasPermission("GENERATE_REPORT"))
//                        .pathMatchers("/api/medicines/**").access(this.hasPermission("CREATE_MEDICINE"))
//
//                        // Patient access
//                        .pathMatchers("/api/patients/**").access(this.hasPermission("VIEW_PATIENT"))
//
//                        // Default: require authentication
//                        .anyExchange().authenticated()
//                )
//                .oauth2ResourceServer(oauth2 -> oauth2
//                        .jwt(jwt -> jwt
//                                .jwtDecoder(jwtDecoder)
//                        )
//                )
//                .build();
//    }
//
//    /**
//     * Custom permission validator for JWT.
//     */
//    private Customizer<ServerHttpSecurity.AuthorizeExchangeSpec.Access> hasPermission(String requiredPermission) {
//        return (auth, context) -> auth
//                .authentication()
//                .map(authn -> {
//                    List<String> permissions = authn.getAuthorities().stream()
//                            .map(Object::toString)
//                            .toList();
//
//                    boolean granted = permissions.contains(requiredPermission);
//                    return new AuthorizationDecision(granted);
//                });
//    }
//
//    @Bean
//    public ReactiveJwtDecoder jwtDecoder(@Value("${jwt.signer-key}") String key) {
//        return NimbusReactiveJwtDecoder.withSecretKey(Keys.hmacShaKeyFor(key.getBytes())).build();
//    }
//}
