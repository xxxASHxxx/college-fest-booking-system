package com.collegefest.booking.controller;

import com.collegefest.booking.dto.request.LoginRequestDTO;
import com.collegefest.booking.dto.request.RegisterRequestDTO;
import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.AuthResponseDTO;
import com.collegefest.booking.entity.User;
import com.collegefest.booking.entity.UserRole;
import com.collegefest.booking.repository.UserRepository;
import com.collegefest.booking.security.JwtTokenProvider;
import com.collegefest.booking.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtTokenProvider tokenProvider;

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<AuthResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO request) {
                log.info("POST /api/auth/register - Registration request for email: {}", request.getEmail());
                // Check if email already exists
                if (userRepository.existsByEmail(request.getEmail())) {
                        return ResponseEntity.badRequest()
                                        .body(ApiResponse.error("Email is already registered"));
                }

                // Check if phone number already exists
                if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                        return ResponseEntity.badRequest()
                                        .body(ApiResponse.error("Phone number is already registered"));
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

                // Authenticate the new user
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = tokenProvider.generateToken(authentication);

                AuthResponseDTO authResponse = AuthResponseDTO.builder()
                                .token(jwt)
                                .type("Bearer")
                                .userId(savedUser.getId())
                                .email(savedUser.getEmail())
                                .fullName(savedUser.getFullName())
                                .role(savedUser.getRole())
                                .build();

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.success("User registered successfully", authResponse));
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
                log.info("POST /api/auth/login - Login request for email: {}", request.getEmail());
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = tokenProvider.generateToken(authentication);

                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                User user = userRepository.findById(userPrincipal.getId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                AuthResponseDTO authResponse = AuthResponseDTO.builder()
                                .token(jwt)
                                .type("Bearer")
                                .userId(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .role(user.getRole())
                                .build();

                return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
        }

        @GetMapping("/me")
        public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                User user = userRepository.findById(userPrincipal.getId())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
        }
}
