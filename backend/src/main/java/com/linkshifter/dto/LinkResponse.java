package com.linkshifter.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LinkResponse {
    private Long id;
    private String originalUrl;
    private String alias;
    private String shortUrl;
    private LocalDateTime createdAt;
    private boolean custom;
    private long clickCount;
}
