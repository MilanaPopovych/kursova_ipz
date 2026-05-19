package com.example.WiKPIdia.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    // Обробка входу на сайт
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        System.out.println("Хтось намагається увійти з логіном: " + credentials.get("username"));

        // Повертаємо фейковий токен і дані, як просила Мілана в коментарі
        return Map.of(
                "token", "fake-jwt-token-12345",
                "username", credentials.getOrDefault("username", "termenatorof"),
                "role", "Адміністратор"
        );
    }

    // Обробка реєстрації
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> userData) {
        System.out.println("Нова реєстрація: " + userData.get("username"));

        // Просто відповідаємо, що все добре
        return Map.of("message", "Реєстрація успішна!");
    }
}