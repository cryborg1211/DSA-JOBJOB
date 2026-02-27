package com.jobjob.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String welcome() {
        return "<h1>Welcome to JobJob API</h1><p>The engine is running! Try <a href='/api/ping'>/api/ping</a></p>";
    }

    @GetMapping("/api/ping")
    public String ping() {
        return "Pong! Connection is stable.";
    }
}