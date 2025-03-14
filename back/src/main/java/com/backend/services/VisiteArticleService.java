package com.backend.services;

import com.backend.dto.ResponseVisitedArticle;
import com.backend.entities.Product;
import com.backend.entities.VisiteArticle;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.ProductRepository;
import com.backend.repositories.VisiteArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class VisiteArticleService {

    @Autowired
    private VisiteArticleRepository visiteArticleRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<VisiteArticle> getAll() {
        try {
            return (List<VisiteArticle>) visiteArticleRepository.findAll();
        } catch (Exception e) {
            Api.Error(ErrorCode.PREBUILD_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching all Visite Articles", e);
        }
    }

    public VisiteArticle incrementVisiteForComponent(Long componentId) {
        Product product = productRepository.findById(componentId)
                .orElseThrow(() -> new RuntimeException("Component not found with ID: " + componentId));

        VisiteArticle visiteArticle = visiteArticleRepository.findByProduct(product);

        if (visiteArticle == null) {
            visiteArticle = new VisiteArticle();
            visiteArticle.setProduct(product);
            visiteArticle.setCount(1);
        } else {
            visiteArticle.setCount(visiteArticle.getCount() + 1);
        }

        return visiteArticleRepository.save(visiteArticle);
    }

    public void deleteById(Long id) {
        try {
            visiteArticleRepository.deleteById(id);
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_DELETE);
            throw new RuntimeException("Error occurred while deleting the Visite Article by ID", e);
        }
    }

    public List<ResponseVisitedArticle> getMostVisitedArticlesWithDetails() {
        try {
            List<VisiteArticle> mostVisitedArticles = visiteArticleRepository.getAllByOrderByCountDesc();
            if (mostVisitedArticles.isEmpty()) {
                throw new RuntimeException("No visited articles found");
            }

            List<ResponseVisitedArticle> detailedArticles = new ArrayList<>();
            for (VisiteArticle visiteArticle : mostVisitedArticles) {
                Product product = null;

                if (visiteArticle.getProduct() != null) {
                    product = productRepository.findById(visiteArticle.getProduct().getId())
                            .orElse(null);
                }

                detailedArticles.add(new ResponseVisitedArticle(visiteArticle.getId(), visiteArticle.getCount(), product));
            }
            return detailedArticles;
        } catch (Exception e) {
            throw new RuntimeException("No visited articles found", e);
        }
    }

    public void resetCounts() {
        List<VisiteArticle> allVisites = visiteArticleRepository.findAll();

        if (allVisites.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        VisiteArticle mostVisitedArticle = allVisites.stream()
                .max(Comparator.comparingInt(VisiteArticle::getCount))
                .orElseThrow(() -> new RuntimeException("Visited article not found."));

        for (VisiteArticle visiteArticle : allVisites) {
            if (visiteArticle.equals(mostVisitedArticle)) {
                visiteArticle.setCount(1);
            } else {
                visiteArticle.setCount(0);
            }

            visiteArticleRepository.save(visiteArticle);
        }
    }
}
