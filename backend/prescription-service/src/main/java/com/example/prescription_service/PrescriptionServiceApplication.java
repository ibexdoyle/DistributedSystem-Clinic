package com.example.prescription_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
public class PrescriptionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrescriptionServiceApplication.class, args);
	}

}
