package com.example.staff_service.service.impl;

import com.example.staff_service.model.Shift;
import com.example.staff_service.model.Staff;
import com.example.staff_service.repository.ShiftRepository;
import com.example.staff_service.repository.StaffRepository;
import com.example.staff_service.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Override
    public Staff createStaff(Staff staff) {
        List<Shift> shifts = shiftRepository.findAllById(staff.getShifts().stream().map(Shift::getId).collect(Collectors.toList()));
        staff.setShifts(shifts);

        staff.setIsActive(true);
        return staffRepository.save(staff);
    }

    @Override
    public Staff updateStaff(Long id, Staff updated) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        staff.setFullName(updated.getFullName());
        staff.setEmail(updated.getEmail());
        staff.setPhoneNumber(updated.getPhoneNumber());
        staff.setRole(updated.getRole());
        staff.setDepartment(updated.getDepartment());
        staff.setIsActive(updated.getIsActive());

        List<Shift> shifts = shiftRepository.findAllById(updated.getShifts().stream().map(Shift::getId).collect(Collectors.toList()));
        staff.setShifts(shifts);


        return staffRepository.save(staff);
    }

    @Override
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}