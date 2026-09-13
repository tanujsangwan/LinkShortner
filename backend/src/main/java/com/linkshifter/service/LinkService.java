package com.linkshifter.service;

import com.linkshifter.dto.CreateLinkRequest;
import com.linkshifter.dto.LinkResponse;
import com.linkshifter.model.Click;
import com.linkshifter.model.Link;
import com.linkshifter.repository.ClickRepository;
import com.linkshifter.repository.LinkRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LinkService {

    private final LinkRepository linkRepository;
    private final ClickRepository clickRepository;

    @Value("${app.base.url}")
    private String baseUrl;

    public LinkResponse createLink(CreateLinkRequest request) {
        String alias = request.getAlias();
        boolean custom = true;

        if (alias == null || alias.trim().isEmpty()) {
            alias = generateAlias();
            custom = false;
        } else if (linkRepository.existsByAlias(alias)) {
            throw new IllegalArgumentException("Alias already exists");
        }

        Link link = Link.builder()
                .originalUrl(request.getOriginalUrl())
                .alias(alias)
                .createdAt(LocalDateTime.now())
                .custom(custom)
                .build();

        Link saved = linkRepository.save(link);
        return mapToResponse(saved);
    }

    public List<LinkResponse> getAllLinks() {
        return linkRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<Link> getLinkByAlias(String alias) {
        return linkRepository.findByAlias(alias);
    }

    public void deleteLink(String alias) {
        linkRepository.findByAlias(alias).ifPresent(linkRepository::delete);
    }

    @Async
    public void recordClick(String alias, HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }

        String referrer = request.getHeader("Referer");
        if (referrer == null) referrer = "Direct";

        Click click = Click.builder()
                .alias(alias)
                .timestamp(LocalDateTime.now())
                .ipAddress(ipAddress)
                .country("Unknown") // Country detection could be added here
                .device(UserAgentParser.detectDevice(userAgent))
                .browser(UserAgentParser.detectBrowser(userAgent))
                .os(UserAgentParser.detectOS(userAgent))
                .referrer(referrer)
                .build();

        clickRepository.save(click);
    }

    private LinkResponse mapToResponse(Link link) {
        long clickCount = clickRepository.countByAlias(link.getAlias());
        return LinkResponse.builder()
                .id(link.getId())
                .originalUrl(link.getOriginalUrl())
                .alias(link.getAlias())
                .shortUrl(baseUrl + "/" + link.getAlias())
                .createdAt(link.getCreatedAt())
                .custom(link.isCustom())
                .clickCount(clickCount)
                .build();
    }

    private String generateAlias() {
        String alias;
        do {
            alias = UUID.randomUUID().toString().substring(0, 6);
        } while (linkRepository.existsByAlias(alias));
        return alias;
    }
}
