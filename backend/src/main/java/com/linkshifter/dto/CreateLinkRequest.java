package com.linkshifter.dto;

import lombok.Data;

@Data
public class CreateLinkRequest {
    private String originalUrl;
    private String alias;
}
