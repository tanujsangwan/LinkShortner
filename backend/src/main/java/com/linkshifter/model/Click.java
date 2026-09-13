package com.linkshifter.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "clicks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Click {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String alias;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String country;
    private String device;    // Mobile / Desktop / Tablet
    private String browser;   // Chrome / Firefox / Safari / Edge / Other
    private String os;        // Windows / macOS / Linux / Android / iOS / Other
    private String referrer;
}
