//package com.example.api_gateway.filter;
//
//import org.springframework.core.Ordered;
//import org.springframework.stereotype.Component;
//
//import java.util.logging.Logger;
//
//@Component
//public class LoggingFilter implements GlobalFilter, Ordered {
//
//    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        String path = exchange.getRequest().getPath().toString();
//        String method = exchange.getRequest().getMethodValue();
//
//        logger.info("Incoming request: [{}] {}", method, path);
//
//        return chain.filter(exchange)
//                .then(Mono.fromRunnable(() -> {
//                    int statusCode = exchange.getResponse().getStatusCode().value();
//                    logger.info("Response status for [{} {}]: {}", method, path, statusCode);
//                }));
//    }
//
//    @Override
//    public int getOrder() {
//        return -1; // priority (lower = earlier)
//    }
//}
//
