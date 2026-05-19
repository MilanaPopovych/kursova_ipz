package com.example.WiKPIdia.controller;

import com.example.WiKPIdia.entity.Article;
import com.example.WiKPIdia.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Kazhemo Spring, shcho tse REST API
@RequestMapping("/api/articles") // Bazova adresa dlia tsoho kontrolera
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor // Lombok avtomatychno stvoryt konstruktor
public class ArticleController {

    private final ArticleRepository articleRepository;

    // DTO (Data Transfer Object) dlia zviazku z frontendom
    public record ArticleRequest(String title, String content, String comment) {}

    // 1. CHYTANNIA VSIKH: Otrymaty vsi opublikovani statti
    // Adresa: GET http://localhost:8081/api/articles
    @GetMapping
    public List<Article> getPublishedArticles() {
        return articleRepository.findByIsPublishedTrue();
    }

    // 2. CHYTANNIA ODNIEI: Otrymannia statti za ii ID (slug)
    // Adresa: GET http://localhost:8081/api/articles/{id}
    @GetMapping("/{id}")
    public Article getArticleById(@PathVariable Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stattiu ne znaildeno"));
    }

    // 3. STVORENNIA: Dodaty novu stattiu
    // Adresa: POST http://localhost:8081/api/articles
    @PostMapping
    public Article createArticle(@RequestBody ArticleRequest request) {
        Article article = new Article();
        article.setTitle(request.title());
        article.setContent(request.content());

        // Komentar do novoi statti vyvodymo v konsol:
        System.out.println("Komentar do statti: " + request.comment());

        article.setIsPublished(true); // Odrazu publikuiemo

        return articleRepository.save(article);
    }

    // 4. VYDALENNIA: Vydalyty stattiu (tilky dlia Admina)
    // Adresa: DELETE http://localhost:8081/api/articles/{id}
    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleRepository.deleteById(id);
    }
}