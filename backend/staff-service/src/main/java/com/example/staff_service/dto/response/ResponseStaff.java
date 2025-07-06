package com.example.staff_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseStaff {
    private Long id;
    private String fullName;
    private String dob;
    private String gender;
    private String email;
    private String phoneNumber;
    private String department;
    private String staffRole;
    private Boolean isActive;
    private List<Long> shiftIds;
}
