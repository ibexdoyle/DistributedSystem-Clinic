package com.example.identity_service.service;

import com.example.identity_service.dto.AuthRequest;
import com.example.identity_service.dto.AuthResponse;
import com.example.identity_service.dto.RegisterRequest;
import com.example.identity_service.model.Role;
import com.example.identity_service.model.User;
import com.example.identity_service.model.enums.RoleType;
import com.example.identity_service.repository.RoleRepository;
import com.example.identity_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest request) {
        Role role = roleRepository.findByName(request.roleType())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtProvider.generateToken(user);
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().getName().name(),
                user.getRole().getPermissions().stream().map(Enum::name).toList()
        );
    }

    public AuthResponse login(AuthRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.email(), request.password()
        ));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtProvider.generateToken(user);
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().getName().name(),
                user.getRole().getPermissions().stream().map(Enum::name).toList()
        );
    }


}
