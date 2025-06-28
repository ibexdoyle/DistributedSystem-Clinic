package com.example.report_service.service;

import java.util.Map;

public interface ReportService {
    Map<String, Integer> getPatientsPerMonth(String year, String doctorId);
    Map<String, Integer> getPrescriptionsPerMonth(String year, String medicineName);

}
