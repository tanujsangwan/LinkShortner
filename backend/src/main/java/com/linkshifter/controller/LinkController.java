package com.linkshifter.controller;

import com.linkshifter.dto.CreateLinkRequest;
import com.linkshifter.dto.LinkResponse;
import com.linkshifter.service.LinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class LinkController {

    private final LinkService linkService;

    @GetMapping
    public ResponseEntity<List<LinkResponse>> getAllLinks() {
        return ResponseEntity.ok(linkService.getAllLinks());
    }

    @PostMapping
    public ResponseEntity<LinkResponse> createLink(@RequestBody CreateLinkRequest request) {
        return ResponseEntity.ok(linkService.createLink(request));
    }

    @DeleteMapping("/{alias}")
    public ResponseEntity<Void> deleteLink(@PathVariable String alias) {
        linkService.deleteLink(alias);
        return ResponseEntity.noContent().build();
    }
}
