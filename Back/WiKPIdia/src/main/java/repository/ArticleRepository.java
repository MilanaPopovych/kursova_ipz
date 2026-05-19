package com.example.WiKPIdia.repository;

import com.example.WiKPIdia.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // Spring: сам згенерує SQL-запит "SELECT * FROM articles WHERE is_published = true"
    List<Article> findByIsPublishedTrue();
}