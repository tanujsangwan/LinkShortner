package com.linkshifter.service;

import com.linkshifter.dto.AnalyticsResponse;
import com.linkshifter.model.Click;
import com.linkshifter.model.Link;
import com.linkshifter.repository.ClickRepository;
import com.linkshifter.repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final LinkRepository linkRepository;
    private final ClickRepository clickRepository;

    @Value("${app.base.url}")
    private String baseUrl;

    public AnalyticsResponse getAnalytics(String alias) {
        Link link = linkRepository.findByAlias(alias)
                .orElseThrow(() -> new IllegalArgumentException("Link not found"));

        List<Click> clicks = clickRepository.findByAlias(alias);

        long totalClicks = clicks.size();
        long uniqueVisitors = clicks.stream()
                .map(Click::getIpAddress)
                .distinct()
                .count();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, Long> clicksByDay = clicks.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getTimestamp().format(formatter),
                        Collectors.counting()
                ));
        
        // Sort clicksByDay by key (date)
        Map<String, Long> sortedClicksByDay = clicksByDay.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (e1, e2) -> e1, LinkedHashMap::new));

        Map<String, Long> deviceBreakdown = sortByValueDesc(clicks.stream()
                .collect(Collectors.groupingBy(Click::getDevice, Collectors.counting())));

        Map<String, Long> browserBreakdown = sortByValueDesc(clicks.stream()
                .collect(Collectors.groupingBy(Click::getBrowser, Collectors.counting())));

        Map<String, Long> osBreakdown = sortByValueDesc(clicks.stream()
                .collect(Collectors.groupingBy(Click::getOs, Collectors.counting())));

        Map<String, Long> referrerBreakdown = sortByValueDesc(clicks.stream()
                .collect(Collectors.groupingBy(c -> c.getReferrer() != null ? c.getReferrer() : "Direct", Collectors.counting())));

        Map<String, Long> countryBreakdown = sortByValueDesc(clicks.stream()
                .collect(Collectors.groupingBy(Click::getCountry, Collectors.counting())));

        return AnalyticsResponse.builder()
                .alias(alias)
                .originalUrl(link.getOriginalUrl())
                .shortUrl(baseUrl + "/" + alias)
                .totalClicks(totalClicks)
                .uniqueVisitors(uniqueVisitors)
                .clicksByDay(sortedClicksByDay)
                .deviceBreakdown(deviceBreakdown)
                .browserBreakdown(browserBreakdown)
                .osBreakdown(osBreakdown)
                .referrerBreakdown(referrerBreakdown)
                .countryBreakdown(countryBreakdown)
                .build();
    }

    private Map<String, Long> sortByValueDesc(Map<String, Long> map) {
        return map.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (e1, e2) -> e1, LinkedHashMap::new));
    }
}
