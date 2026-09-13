package com.linkshifter.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {
    private String alias;
    private String originalUrl;
    private String shortUrl;
    private long totalClicks;
    private long uniqueVisitors;
    private Map<String, Long> clicksByDay;
    private Map<String, Long> deviceBreakdown;
    private Map<String, Long> browserBreakdown;
    private Map<String, Long> osBreakdown;
    private Map<String, Long> referrerBreakdown;
    private Map<String, Long> countryBreakdown;
}
