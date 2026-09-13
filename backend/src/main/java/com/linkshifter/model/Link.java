package com.linkshifter.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "links")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Link {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String originalUrl;
    
    @Column(unique = true)
    private String alias;
    
    private LocalDateTime createdAt;
    
    private boolean custom; // true if user provided alias
}
