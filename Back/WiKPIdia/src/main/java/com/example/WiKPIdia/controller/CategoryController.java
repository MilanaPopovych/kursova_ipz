package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.entity.Category;
import com.example.WiKPIdia.repository.ArticleRepository;
import com.example.WiKPIdia.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;

    // 1. Метод для створення нової категорії
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }

    // 2. МЕТОД ДОДАВАННЯ СТАТТІ В КАТЕГОРІЮ (Зв'язок Many-to-Many)
    @PostMapping("/{categoryId}/articles/{articleId}")
    public ResponseEntity<?> addArticleToCategory(
            @PathVariable Long categoryId,
            @PathVariable Long articleId) {

        // Шукаємо категорію в базі
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Категорію не знайдено"));

        // Шукаємо статтю в базі
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Статтю не знайдено"));

        // Додаємо статтю до списку статей цієї категорії
        category.getArticles().add(article);

        // Зберігаємо оновлену категорію (Spring Data JPA автоматично внесе запис у таблицю article_categories)
        categoryRepository.save(category);

        return ResponseEntity.ok(Map.of(
                "message", "Статтю '" + article.getTitle() + "' успішно додано до категорії '" + category.getName() + "'"
        ));
    }
}