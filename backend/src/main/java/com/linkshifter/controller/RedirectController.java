package com.linkshifter.controller;

import com.linkshifter.model.Link;
import com.linkshifter.service.LinkService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.net.URI;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class RedirectController {

    private final LinkService linkService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/{alias}")
    public ResponseEntity<Void> redirect(@PathVariable String alias, HttpServletRequest request) {
        Optional<Link> optionalLink = linkService.getLinkByAlias(alias);
        
        if (optionalLink.isPresent()) {
            Link link = optionalLink.get();
            linkService.recordClick(alias, request);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(link.getOriginalUrl()))
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(frontendUrl + "/not-found"))
                    .build();
        }
    }
}
