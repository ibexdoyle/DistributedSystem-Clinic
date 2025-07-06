package com.example.staff_service.service.impl;

import com.example.staff_service.dto.request.RequestCreateStaff;
import com.example.staff_service.dto.request.RequestUpdateStaff;
import com.example.staff_service.dto.response.ResponseStaff;
import com.example.staff_service.mapper.StaffMapper;
import com.example.staff_service.model.Shift;
import com.example.staff_service.model.Staff;
import com.example.staff_service.repository.ShiftRepository;
import com.example.staff_service.repository.StaffRepository;
import com.example.staff_service.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final ShiftRepository shiftRepository;
    private final StaffMapper staffMapper;

    @Override
    public ResponseStaff createStaff(RequestCreateStaff request) {
        Staff staff = staffMapper.toEntity(request);
        if (request.getShiftIds() != null) {
            List<Shift> shifts = shiftRepository.findAllById(request.getShiftIds());
            staff.setShifts(shifts);
        }
        staff.setIsActive(true);
        return staffMapper.toDTO(staffRepository.save(staff));
    }

    @Override
    public ResponseStaff updateStaff(Long id, RequestUpdateStaff request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        staffMapper.updateStaff(staff, request);
        if (request.getShiftIds() != null) {
            List<Shift> shifts = shiftRepository.findAllById(request.getShiftIds());
            staff.setShifts(shifts);
        }
        return staffMapper.toDTO(staffRepository.save(staff));
    }

    @Override
    public ResponseStaff getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        return staffMapper.toDTO(staff);
    }

    @Override
    public List<ResponseStaff> getAllStaff() {
        return staffRepository.findAll().stream().map(staffMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public void deleteStaff(Long id) {

        staffRepository.deleteById(id);
    }
}