package com.backend.dto;

import com.backend.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class ResponseVisitedArticle {
    private Long id;
    private int count;
    private Product product;
}
