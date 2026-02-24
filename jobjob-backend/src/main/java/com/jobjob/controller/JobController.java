package com.jobjob.controller;

import com.jobjob.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * JobController — REST endpoints for job search and suggestions.
 *
 * GET /api/jobs/suggest?prefix=java → Trie search suggestions
 */
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final MatchingService matchingService;

    public JobController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    /**
     * Trie-powered job title autocomplete.
     *
     * @param prefix the typed prefix from the frontend TrieSearchInput
     * @return up to 10 matching job title suggestions
     */
    @GetMapping("/suggest")
    public ResponseEntity<List<String>> suggest(@RequestParam String prefix) {
        if (prefix == null || prefix.isBlank()) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(matchingService.suggest(prefix));
    }

    // TODO: Add GET /api/jobs, GET /api/jobs/{id}, POST /api/jobs, etc.
    // These will delegate to JobService → JobRepository (JPA)
}
