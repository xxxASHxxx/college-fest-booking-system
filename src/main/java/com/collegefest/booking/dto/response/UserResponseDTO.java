package com.collegefest.booking.dto.response;

import com.collegefest.booking.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private UserRole role;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
