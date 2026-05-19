package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor // Автоматично підключить репозиторій через конструктор
public class UserController {

    private final ArticleRepository articleRepository;

    @GetMapping("/profile")
    public Map<String, Object> getUserProfile() {

        // 1. Інформація про тебе (залишаємо як є, бо повноцінної авторизації ще немає)
        Map<String, Object> userInfo = Map.of(
                "username", "termenatorof",
                "fullName", "Шеремета Артем",
                "email", "sheremeta.a.r.-io46@edu.kpi.ua",
                "role", "Адміністратор",
                "createdAt", "15.02.2026"
        );

        // 2. СТАЄМО ДЕТЕКТИВАМИ: Тягнемо справжні статті з твоєї бази даних!
        List<Article> realArticles = articleRepository.findAll();
        List<Map<String, String>> recentPublications = new ArrayList<>();

        for (Article article : realArticles) {
            // Трансформуємо кожну статтю з БД у формат, який розуміє фронтенд Мілани
            recentPublications.add(Map.of(
                    "id", String.valueOf(article.getId()),
                    "title", article.getTitle(),
                    "type", "Стаття", // Позначаємо тип контенту
                    "date", "19.05.2026" // Можна поставити поточну дату або реальну, якщо є в БД
            ));
        }

        // 3. Збережені статті (для краси теж підтягнемо першу реальну статтю, якщо вона є)
        List<Map<String, String>> savedArticles = new ArrayList<>();
        if (!realArticles.isEmpty()) {
            Article firstArticle = realArticles.get(0);
            savedArticles.add(Map.of(
                    "id", String.valueOf(firstArticle.getId()),
                    "title", firstArticle.getTitle(),
                    "slug", String.valueOf(firstArticle.getId()),
                    "savedAt", "19.05.2026"
            ));
        }

        // Збираємо все докупи і відправляємо на фронтенд
        return Map.of(
                "userInfo", userInfo,
                "recentPublications", recentPublications,
                "savedArticles", savedArticles
        );
    }
}