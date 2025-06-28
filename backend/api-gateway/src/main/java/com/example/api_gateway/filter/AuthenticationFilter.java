package com.example.api_gateway.filter;

//@Component
//public class AuthenticationFilter implements GlobalFilter, Ordered {
//
//    private final JwtService jwtService;
//
//    public AuthenticationFilter(JwtService jwtService) {
//        this.jwtService = jwtService;
//    }
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        ServerHttpRequest request = exchange.getRequest();
//
//        if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
//            return unauthorized(exchange, "Missing Authorization Header");
//        }
//
//        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return unauthorized(exchange, "Invalid Authorization Header");
//        }
//
//        String token = authHeader.substring(7);
//
//        try {
//            jwtService.validateToken(token); // validate signature, expiration, etc.
//        } catch (Exception e) {
//            return unauthorized(exchange, "Invalid JWT: " + e.getMessage());
//        }
//
//        return chain.filter(exchange);
//    }
//
//    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
//        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//        DataBuffer buffer = exchange.getResponse()
//                .bufferFactory().wrap(message.getBytes(StandardCharsets.UTF_8));
//        return exchange.getResponse().writeWith(Mono.just(buffer));
//    }
//
//    @Override
//    public int getOrder() {
//        return 0; // chạy sau Logging
//    }
//}

