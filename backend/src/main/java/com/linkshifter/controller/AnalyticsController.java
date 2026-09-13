package com.linkshifter.controller;

import com.linkshifter.dto.AnalyticsResponse;
import com.linkshifter.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{alias}")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@PathVariable String alias) {
        try {
            return ResponseEntity.ok(analyticsService.getAnalytics(alias));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
