package com.example.api_gateway.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.ReactiveAuthorizationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Configuration
@EnableReactiveMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final Map<String, List<String>> ROUTE_PERMISSIONS = Map.of(
            "/api/patients", List.of("VIEW_PATIENT"),
            "/api/staffs", List.of("VIEW_STAFF"),
            "/api/admin", List.of("MANAGE_ALL")
    );

    private static final Map<String, List<String>> ROUTE_ROLES = Map.of(
            "/api/patients", List.of("USER", "DOCTOR", "ADMIN"),
            "/api/staffs", List.of("DOCTOR", "ADMIN"),
            "/api/admin", List.of("ADMIN")
    );

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/swagger-ui.html", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .anyExchange().access(permissionAuthorizationManager())
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt -> {})
                )
                .build();
    }

    public ReactiveAuthorizationManager<AuthorizationContext> permissionAuthorizationManager() {
        return (Mono<Authentication> authenticationMono, AuthorizationContext context) ->
                authenticationMono
                        .map(auth -> {
                            if (!(auth.getPrincipal() instanceof Jwt jwt)) {
                                return new AuthorizationDecision(false);
                            }

                            String path = context.getExchange().getRequest().getPath().value();
                            List<String> userPermissions = jwt.getClaimAsStringList("permissions");
                            String userRole = jwt.getClaimAsString("role");

                            boolean permissionMatch = ROUTE_PERMISSIONS.entrySet().stream()
                                    .filter(entry -> path.startsWith(entry.getKey()))
                                    .flatMap(entry -> entry.getValue().stream())
                                    .anyMatch(userPermissions::contains);

                            boolean roleMatch = ROUTE_ROLES.entrySet().stream()
                                    .filter(entry -> path.startsWith(entry.getKey()))
                                    .flatMap(entry -> entry.getValue().stream())
                                    .anyMatch(r -> r.equalsIgnoreCase(userRole));

                            return new AuthorizationDecision(permissionMatch && roleMatch);
                        });
    }
}
