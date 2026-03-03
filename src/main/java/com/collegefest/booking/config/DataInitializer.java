package com.collegefest.booking.config;

import com.collegefest.booking.entity.User;
import com.collegefest.booking.entity.UserRole;
import com.collegefest.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Database initializer that creates default admin user on application startup
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting database initialization...");
        createDefaultAdminUser();
        log.info("Database initialization completed");
    }

    private void createDefaultAdminUser() {
        String adminEmail = "admin@festbook.com";

        // Check if admin user already exists
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            log.info("Admin user already exists: {}", adminEmail);
            return;
        }

        // Create admin user using builder
        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .fullName("Admin User")
                .phoneNumber("9876543210")
                .role(UserRole.ADMIN)
                .isVerified(true)
                .build();

        userRepository.save(admin);

        log.info("✅ Default admin user created successfully!");
        log.info("   Email: {}", adminEmail);
        log.info("   Password: admin123");
        log.info("   Role: ADMIN");
        log.info("⚠️  IMPORTANT: Change the default password after first login!");
    }
}
