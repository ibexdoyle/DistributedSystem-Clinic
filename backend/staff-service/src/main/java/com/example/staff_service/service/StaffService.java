package com.example.staff_service.service;

import com.example.staff_service.model.Staff;

import java.util.List;

public interface StaffService {
    Staff createStaff(Staff staff);
    Staff updateStaff(Long id, Staff staff);
    Staff getStaffById(Long id);
    List<Staff> getAllStaff();
    void deleteStaff(Long id);
}
