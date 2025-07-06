//package com.example.api_gateway.config;
//
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.security.authentication.AbstractAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.stereotype.Component;
//import reactor.core.publisher.Mono;
//
//import java.util.Collection;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Component
//public class CustomJwtAuthenticationConverter implements Converter<Jwt, Mono<AbstractAuthenticationToken>> {
//
//    @Override
//    public Mono<AbstractAuthenticationToken> convert(Jwt jwt) {
//        List<String> permissions = jwt.getClaimAsStringList("permissions");
//
//        Collection<SimpleGrantedAuthority> authorities = permissions == null
//                ? List.of()
//                : permissions.stream()
//                .map(p -> new SimpleGrantedAuthority("PERMISSION_" + p))
//                .collect(Collectors.toList());
//
//        return Mono.just(new org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken(jwt, authorities));
//    }
//}
//
