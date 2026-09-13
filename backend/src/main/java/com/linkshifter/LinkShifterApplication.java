package com.linkshifter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class LinkShifterApplication {
    public static void main(String[] args) {
        SpringApplication.run(LinkShifterApplication.class, args);
    }
}
