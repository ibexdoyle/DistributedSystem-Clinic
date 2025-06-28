package com.example.medicine_service.service;

import com.example.medicine_service.dto.MedicineRequest;
import com.example.medicine_service.dto.MedicineResponse;

import java.util.List;

public interface MedicineService {
    MedicineResponse create(MedicineRequest request);
    MedicineResponse update(Long id, MedicineRequest request);
    MedicineResponse getById(Long id);
    List<MedicineResponse> getAll();
    void delete(Long id);
}
