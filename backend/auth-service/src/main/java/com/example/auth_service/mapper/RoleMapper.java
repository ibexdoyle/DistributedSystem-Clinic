package com.example.auth_service.mapper;

import com.example.auth_service.dto.request.RoleRequest;
import com.example.auth_service.dto.response.RoleResponse;
import com.example.auth_service.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
