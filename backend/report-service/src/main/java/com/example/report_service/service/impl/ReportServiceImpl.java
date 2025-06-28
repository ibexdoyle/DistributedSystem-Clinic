package com.example.report_service.service.impl;

import com.example.report_service.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private PrescriptionClient prescriptionClient;

    @Override
    public Map<String, Integer> getPatientsPerMonth(String year, String doctorId) {
        return patientClient.getPatientCountByMonth(year, doctorId);
    }

    @Override
    public Map<String, Integer> getPrescriptionsPerMonth(String year, String medicineName) {
        return prescriptionClient.getPrescriptionCountByMonth(year, medicineName);
    }
}

