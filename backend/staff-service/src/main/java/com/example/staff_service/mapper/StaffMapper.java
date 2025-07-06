package com.example.staff_service.mapper;


import com.example.staff_service.dto.request.RequestCreateStaff;
import com.example.staff_service.dto.request.RequestUpdateStaff;
import com.example.staff_service.dto.response.ResponseStaff;
import com.example.staff_service.model.Shift;
import com.example.staff_service.model.Staff;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface StaffMapper {

    @Mapping(target = "shiftIds", expression = "java(mapShiftIds(staff.getShifts()))")
    ResponseStaff toDTO(Staff staff);

    Staff toEntity(RequestCreateStaff request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateStaff(@MappingTarget Staff staff, RequestUpdateStaff request);

    default List<Long> mapShiftIds(List<Shift> shifts) {
        return shifts == null ? null : shifts.stream().map(Shift::getId).collect(Collectors.toList());
    }
//    List<Shift> toShifts(List<Long> shiftIds);
}

