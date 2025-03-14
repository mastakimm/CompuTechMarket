package com.backend.controllers;

import com.backend.entities.VisiteArticle;
import com.backend.internal.PublicEndpoint;
import com.backend.services.VisiteArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/visiteArticle")
public class VisiteArticleController {

    @Autowired
    private VisiteArticleService visiteArticleService;

    @PublicEndpoint
    @GetMapping("/all")
    public List<VisiteArticle> getAllVisiteArticles() {
        return visiteArticleService.getAll();
    }

    @PublicEndpoint
    @PostMapping("/incrementComponent")
    public VisiteArticle incrementVisiteForComponent(@RequestParam Long componentId) {
        return visiteArticleService.incrementVisiteForComponent(componentId);
    }

    @PublicEndpoint
    @DeleteMapping("/delete/{id}")
    public void deleteVisiteArticle(@PathVariable Long id) {
        visiteArticleService.deleteById(id);
    }

    @PublicEndpoint
    @GetMapping("/mostVisited")
    public List<Object> getMostVisitedArticles() {
        return Collections.singletonList(visiteArticleService.getMostVisitedArticlesWithDetails());
    }
}
