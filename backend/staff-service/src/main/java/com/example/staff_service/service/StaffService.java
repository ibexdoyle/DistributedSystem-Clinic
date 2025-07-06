package com.example.staff_service.service;

import com.example.staff_service.dto.request.RequestCreateStaff;
import com.example.staff_service.dto.request.RequestUpdateStaff;
import com.example.staff_service.dto.response.ResponseStaff;
import com.example.staff_service.model.Staff;

import java.util.List;

public interface StaffService {
    ResponseStaff createStaff(RequestCreateStaff staff);
    ResponseStaff updateStaff(Long id, RequestUpdateStaff staff);
    ResponseStaff getStaffById(Long id);
    List<ResponseStaff> getAllStaff();
    void deleteStaff(Long id);
}
