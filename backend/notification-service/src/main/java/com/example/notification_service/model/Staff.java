package com.example.notification_service.model;


import com.example.notification_service.model.enums.StaffRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {


    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private StaffRole staffRole;

    private String department;

    private Boolean isActive;


}
