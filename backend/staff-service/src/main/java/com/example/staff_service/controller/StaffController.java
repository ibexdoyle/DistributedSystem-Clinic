package com.example.staff_service.controller;

import com.example.staff_service.dto.request.RequestCreateStaff;
import com.example.staff_service.dto.request.RequestUpdateStaff;
import com.example.staff_service.dto.response.ResponseStaff;
import com.example.staff_service.model.Staff;
import com.example.staff_service.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/staffs")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping
    public ResponseEntity<ResponseStaff> createStaff(@RequestBody RequestCreateStaff staff) {
        return ResponseEntity.ok(staffService.createStaff(staff));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseStaff> updateStaff(@PathVariable Long id, @RequestBody RequestUpdateStaff staff) {
        return ResponseEntity.ok(staffService.updateStaff(id, staff));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseStaff> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @GetMapping
    public ResponseEntity<List<ResponseStaff>> getAllStaff() {

        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}
