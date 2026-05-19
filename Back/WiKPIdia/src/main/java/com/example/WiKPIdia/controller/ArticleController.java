package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.User;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository; // Додали доступ до бази користувачів

    public record ArticleRequest(String title, String content, String comment) {}

    // 1. ЧИТАННЯ ВСІХ: Отримати всі опубліковані статті
    @GetMapping
    public List<Article> getPublishedArticles() {
        return articleRepository.findByIsPublishedTrue();
    }

    // 2. ЧИТАННЯ ОДНІЄЇ: Отримання статті за її ID
    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Статтю не знайдено"));
    }

    // 3. СТВОРЕННЯ: Додати нову статтю
    @PostMapping
    public Article createArticle(@RequestBody ArticleRequest request) {
        Article article = new Article();
        article.setTitle(request.title());
        article.setContent(request.content());

        System.out.println("Коментар до статті: " + request.comment());
        article.setIsPublished(true);

        return articleRepository.save(article);
    }

    // 4. ВИДАЛЕННЯ: Видалити статтю (ТІЛЬКИ ДЛЯ АДМІНІСТРАТОРА)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {

        // 1. Перевіряємо, хто зараз сидить на сайті
        String activeUsername = AuthController.currentSessionUser;
        User currentUser = userRepository.findByUsername(activeUsername).orElse(null);

        // 2. БЛОКУЄМО ДОСТУП, якщо це не Адміністратор
        if (currentUser == null || !"Адміністратор".equals(currentUser.getRole())) {
            // Повертаємо помилку 403 Forbidden (Доступ заборонено)
            return ResponseEntity.status(403).body(Map.of("message", "Доступ заборонено! Тільки Адміністратор може видаляти статті."));
        }

        // 3. Якщо перевірка пройдена, шукаємо статтю
        if (!articleRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Статтю не знайдено."));
        }

        // 4. Видаляємо статтю
        articleRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "Статтю успішно видалено адміністратором."));
    }
}