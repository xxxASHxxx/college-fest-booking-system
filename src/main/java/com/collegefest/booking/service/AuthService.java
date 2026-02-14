package com.collegefest.booking.service;

import com.collegefest.booking.dto.request.LoginRequestDTO;
import com.collegefest.booking.dto.request.RegisterRequestDTO;
import com.collegefest.booking.dto.response.AuthResponseDTO;
import com.collegefest.booking.dto.response.UserResponseDTO;
import com.collegefest.booking.entity.User;
import com.collegefest.booking.entity.UserRole;
import com.collegefest.booking.exception.DuplicateResourceException;
import com.collegefest.booking.repository.UserRepository;
import com.collegefest.booking.security.JwtTokenProvider;
import com.collegefest.booking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public UserResponseDTO register(RegisterRequestDTO request) {
        log.info("Registering new user with email: {}", request.getEmail());
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new DuplicateResourceException("Email is already registered");
        }

        // Check if phone number already exists
        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Phone number is already registered");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(UserRole.USER)
                .isVerified(false)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Successfully registered user: {} with ID: {}", savedUser.getEmail(), savedUser.getId());

        return convertToUserResponse(savedUser);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        log.info("Login attempt for user: {}", request.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("User logged in successfully: {} (Role: {})", user.getEmail(), user.getRole());
        return AuthResponseDTO.builder()
                .token(jwt)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    private UserResponseDTO convertToUserResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
