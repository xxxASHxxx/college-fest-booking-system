package com.collegefest.booking.controller;

import com.collegefest.booking.dto.request.EventRequestDTO;
import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.EventResponseDTO;
import com.collegefest.booking.entity.EventStatus;
import com.collegefest.booking.entity.EventType;
import com.collegefest.booking.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDTO>> createEvent(@Valid @RequestBody EventRequestDTO request) {
        EventResponseDTO event = eventService.createEvent(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", event));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDTO>>> getAllEvents() {
        List<EventResponseDTO> events = eventService.getAllEvents();
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }

    @GetMapping("/published")
    public ResponseEntity<ApiResponse<List<EventResponseDTO>>> getPublishedEvents() {
        List<EventResponseDTO> events = eventService.getPublishedEvents();
        return ResponseEntity.ok(ApiResponse.success("Published events retrieved successfully", events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDTO>> getEventById(@PathVariable Long id) {
        EventResponseDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success("Event retrieved successfully", event));
    }

    @GetMapping("/type/{eventType}")
    public ResponseEntity<ApiResponse<List<EventResponseDTO>>> getEventsByType(@PathVariable EventType eventType) {
        List<EventResponseDTO> events = eventService.getEventsByType(eventType);
        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", events));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDTO>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequestDTO request) {
        EventResponseDTO event = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", event));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDTO>> updateEventStatus(
            @PathVariable Long id,
            @RequestParam EventStatus status) {
        EventResponseDTO event = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Event status updated successfully", event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
