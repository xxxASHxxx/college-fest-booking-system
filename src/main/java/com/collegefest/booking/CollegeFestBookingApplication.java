package com.collegefest.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class CollegeFestBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollegeFestBookingApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("🎉 College Fest Booking System Started!");
        System.out.println("📡 Server running on: http://localhost:8080");
        System.out.println("📚 Test with Postman or Frontend");
        System.out.println("========================================\n");
    }
}
