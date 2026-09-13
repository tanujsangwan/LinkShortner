package com.linkshifter.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Supports comma-separated list of origins, e.g. "http://localhost:5173,https://linkshifter.vercel.app"
    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = frontendUrl.split(",");
        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
