package com.collegefest.booking.config;

import com.collegefest.booking.entity.*;
import com.collegefest.booking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeederConfig {

        private final UserRepository userRepository;
        private final VenueRepository venueRepository;
        private final EventRepository eventRepository;
        private final PriceTierRepository priceTierRepository;
        private final PasswordEncoder passwordEncoder;

        @Bean
        public CommandLineRunner seedData() {
                return args -> {
                        if (userRepository.count() > 0) {
                                log.info("📊 Database already contains data. Skipping seeding.");
                                return;
                        }

                        log.info("🌱 Starting database seeding...");

                        // Create Admin User
                        User admin = User.builder()
                                        .email("admin@festbook.com")
                                        .password(passwordEncoder.encode("admin123"))
                                        .fullName("Admin User")
                                        .phoneNumber("9876543210")
                                        .role(UserRole.ADMIN)
                                        .isVerified(true)
                                        .createdAt(LocalDateTime.now())
                                        .build();
                        userRepository.save(admin);
                        log.info("✅ Created admin user: admin@festbook.com / admin123");

                        // Create Sample Students
                        List<User> students = Arrays.asList(
                                        User.builder()
                                                        .email("student1@college.edu")
                                                        .password(passwordEncoder.encode("student123"))
                                                        .fullName("Rahul Sharma")
                                                        .phoneNumber("9876543211")
                                                        .role(UserRole.USER)
                                                        .isVerified(true)
                                                        .createdAt(LocalDateTime.now())
                                                        .build(),
                                        User.builder()
                                                        .email("student2@college.edu")
                                                        .password(passwordEncoder.encode("student123"))
                                                        .fullName("Priya Patel")
                                                        .phoneNumber("9876543212")
                                                        .role(UserRole.USER)
                                                        .isVerified(true)
                                                        .createdAt(LocalDateTime.now())
                                                        .build(),
                                        User.builder()
                                                        .email("student3@college.edu")
                                                        .password(passwordEncoder.encode("student123"))
                                                        .fullName("Amit Kumar")
                                                        .phoneNumber("9876543213")
                                                        .role(UserRole.USER)
                                                        .isVerified(true)
                                                        .createdAt(LocalDateTime.now())
                                                        .build());
                        userRepository.saveAll(students);
                        log.info("✅ Created 3 student users (password: student123)");

                        // Create Venues
                        Venue auditorium = Venue.builder()
                                        .venueName("Main Auditorium")
                                        .address("Building A, Ground Floor")
                                        .totalCapacity(500)
                                        .facilities("AC, Projector, Sound System, Stage, Green Room")
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        Venue openAir = Venue.builder()
                                        .venueName("Open Air Theatre")
                                        .address("Central Campus Lawn")
                                        .totalCapacity(1000)
                                        .facilities("Stage, Sound System, Seating Arrangements, Food Stalls")
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        Venue sportsComplex = Venue.builder()
                                        .venueName("Sports Complex")
                                        .address("Athletic Grounds")
                                        .totalCapacity(300)
                                        .facilities("Basketball Court, Badminton Courts, Changing Rooms")
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        venueRepository.saveAll(Arrays.asList(auditorium, openAir, sportsComplex));
                        log.info("✅ Created 3 venues");

                        // Create Events
                        Event concert = Event.builder()
                                        .eventName("Starlight Music Fest 2026")
                                        .description(
                                                        "An electrifying night featuring top indie bands and DJ performances. Get ready to dance under the stars!")
                                        .eventType(EventType.MUSIC)
                                        .venue(openAir)
                                        .eventDate(LocalDateTime.now().plusDays(15))
                                        .durationMinutes(240)
                                        .bannerImageUrl("/images/events/concert.jpg")
                                        .organizerName("Cultural Committee")
                                        .maxCapacity(1000)
                                        .bookingOpensAt(LocalDateTime.now())
                                        .bookingClosesAt(LocalDateTime.now().plusDays(14))
                                        .status(EventStatus.PUBLISHED)
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        Event techTalk = Event.builder()
                                        .eventName("Tech Innovation Summit")
                                        .description(
                                                        "Learn from industry leaders about AI, Web3, and the future of technology. Featuring guest speakers from top tech companies.")
                                        .eventType(EventType.TECH)
                                        .venue(auditorium)
                                        .eventDate(LocalDateTime.now().plusDays(7))
                                        .durationMinutes(180)
                                        .bannerImageUrl("/images/events/tech-summit.jpg")
                                        .organizerName("Technical Society")
                                        .maxCapacity(500)
                                        .bookingOpensAt(LocalDateTime.now())
                                        .bookingClosesAt(LocalDateTime.now().plusDays(6))
                                        .status(EventStatus.PUBLISHED)
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        Event sports = Event.builder()
                                        .eventName("Annual Sports Championship")
                                        .description(
                                                        "Inter-college sports tournament featuring basketball, badminton, and athletics. Show your college spirit!")
                                        .eventType(EventType.SPORTS)
                                        .venue(sportsComplex)
                                        .eventDate(LocalDateTime.now().plusDays(20))
                                        .durationMinutes(480)
                                        .bannerImageUrl("/images/events/sports.jpg")
                                        .organizerName("Sports Committee")
                                        .maxCapacity(300)
                                        .bookingOpensAt(LocalDateTime.now())
                                        .bookingClosesAt(LocalDateTime.now().plusDays(18))
                                        .status(EventStatus.PUBLISHED)
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        Event cultural = Event.builder()
                                        .eventName("Cultural Night: Colors of India")
                                        .description(
                                                        "Celebrate India's diversity with dance, drama, and music performances from various states.")
                                        .eventType(EventType.CULTURAL)
                                        .venue(auditorium)
                                        .eventDate(LocalDateTime.now().plusDays(10))
                                        .durationMinutes(240)
                                        .bannerImageUrl("/images/events/cultural.jpg")
                                        .organizerName("Cultural Committee")
                                        .maxCapacity(500)
                                        .bookingOpensAt(LocalDateTime.now())
                                        .bookingClosesAt(LocalDateTime.now().plusDays(9))
                                        .status(EventStatus.PUBLISHED)
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        Event hackathon = Event.builder()
                                        .eventName("HackFest 2026 - 24hr Coding Marathon")
                                        .description(
                                                        "Build innovative solutions in 24 hours! Cash prizes worth ₹1 lakh. Free food and swag for all participants.")
                                        .eventType(EventType.WORKSHOP)
                                        .venue(auditorium)
                                        .eventDate(LocalDateTime.now().plusDays(12))
                                        .durationMinutes(1440)
                                        .bannerImageUrl("/images/events/hackathon.jpg")
                                        .organizerName("Tech Club")
                                        .maxCapacity(200)
                                        .bookingOpensAt(LocalDateTime.now())
                                        .bookingClosesAt(LocalDateTime.now().plusDays(11))
                                        .status(EventStatus.PUBLISHED)
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        eventRepository.saveAll(Arrays.asList(concert, techTalk, sports, cultural, hackathon));
                        log.info("✅ Created 5 events");

                        // Create Price Tiers for Concert
                        PriceTier concertGeneral = PriceTier.builder()
                                        .event(concert)
                                        .tierName("General Entry")
                                        .price(new BigDecimal("299.00"))
                                        .totalSeats(700)
                                        .availableSeats(700)
                                        .build();

                        PriceTier concertVip = PriceTier.builder()
                                        .event(concert)
                                        .tierName("VIP Seating")
                                        .price(new BigDecimal("799.00"))
                                        .totalSeats(200)
                                        .availableSeats(200)
                                        .build();

                        PriceTier concertPlatinum = PriceTier.builder()
                                        .event(concert)
                                        .tierName("Platinum Experience")
                                        .price(new BigDecimal("1499.00"))
                                        .totalSeats(100)
                                        .availableSeats(100)
                                        .build();

                        // Tech Summit Tiers
                        PriceTier techStudent = PriceTier.builder()
                                        .event(techTalk)
                                        .tierName("Student Pass")
                                        .price(new BigDecimal("199.00"))
                                        .totalSeats(400)
                                        .availableSeats(400)
                                        .build();

                        PriceTier techProfessional = PriceTier.builder()
                                        .event(techTalk)
                                        .tierName("Professional Pass")
                                        .price(new BigDecimal("499.00"))
                                        .totalSeats(100)
                                        .availableSeats(100)
                                        .build();

                        // Sports Tiers
                        PriceTier sportsGeneral = PriceTier.builder()
                                        .event(sports)
                                        .tierName("Spectator Pass")
                                        .price(new BigDecimal("99.00"))
                                        .totalSeats(200)
                                        .availableSeats(200)
                                        .build();

                        PriceTier sportsParticipant = PriceTier.builder()
                                        .event(sports)
                                        .tierName("Participant Entry")
                                        .price(new BigDecimal("399.00"))
                                        .totalSeats(100)
                                        .availableSeats(100)
                                        .build();

                        // Cultural Tiers
                        PriceTier culturalStandard = PriceTier.builder()
                                        .event(cultural)
                                        .tierName("Standard Seating")
                                        .price(new BigDecimal("149.00"))
                                        .totalSeats(350)
                                        .availableSeats(350)
                                        .build();

                        PriceTier culturalPremium = PriceTier.builder()
                                        .event(cultural)
                                        .tierName("Premium Box")
                                        .price(new BigDecimal("499.00"))
                                        .totalSeats(150)
                                        .availableSeats(150)
                                        .build();

                        // Hackathon Tier
                        PriceTier hackathonTeam = PriceTier.builder()
                                        .event(hackathon)
                                        .tierName("Team Registration")
                                        .price(new BigDecimal("999.00"))
                                        .totalSeats(200)
                                        .availableSeats(200)
                                        .build();

                        priceTierRepository.saveAll(Arrays.asList(
                                        concertGeneral, concertVip, concertPlatinum,
                                        techStudent, techProfessional,
                                        sportsGeneral, sportsParticipant,
                                        culturalStandard, culturalPremium,
                                        hackathonTeam));
                        log.info("✅ Created price tiers for all events");

                        log.info("🎉 Database seeding completed successfully!");
                        log.info("📧 Login credentials:");
                        log.info("   Admin: admin@festbook.com / admin123");
                        log.info("   Student: student1@college.edu / student123");
                };
        }
}
