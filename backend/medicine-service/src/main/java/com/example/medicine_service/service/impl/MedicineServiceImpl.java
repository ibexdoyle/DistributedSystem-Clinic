package com.example.medicine_service.service.impl;

import com.example.medicine_service.dto.MedicineRequest;
import com.example.medicine_service.dto.MedicineResponse;
import com.example.medicine_service.model.Medicine;
import com.example.medicine_service.repository.MedicineRepository;
import com.example.medicine_service.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineServiceImpl implements MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Override
    public MedicineResponse create(MedicineRequest request) {
        Medicine medicine = Medicine.builder()
                .name(request.getName())
                .description(request.getDescription())
                .unit(request.getUnit())
                .stockQuantity(request.getStockQuantity())
                .expiryDate(request.getExpiryDate())
                .price(request.getPrice())
                .provider(request.getProvider())
                .build();

        Medicine saved = medicineRepository.save(medicine);
        return mapToResponse(saved);
    }

    @Override
    public MedicineResponse update(Long id, MedicineRequest request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setName(request.getName());
        medicine.setDescription(request.getDescription());
        medicine.setUnit(request.getUnit());
        medicine.setStockQuantity(request.getStockQuantity());
        medicine.setExpiryDate(request.getExpiryDate());

        return mapToResponse(medicineRepository.save(medicine));
    }

    @Override
    public MedicineResponse getById(Long id) {
        return medicineRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    @Override
    public List<MedicineResponse> getAll() {
        return medicineRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        medicineRepository.deleteById(id);
    }

    private MedicineResponse mapToResponse(Medicine medicine) {
        return MedicineResponse.builder()
                .id(medicine.getId())
                .name(medicine.getName())
                .description(medicine.getDescription())
                .unit(medicine.getUnit())
                .stockQuantity(medicine.getStockQuantity())
                .expiryDate(medicine.getExpiryDate())
                .price(medicine.getPrice())
                .provider(medicine.getProvider())
                .build();
    }
}