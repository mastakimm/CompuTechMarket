package com.backend.services;

import com.backend.dto.stock.StockDto;
import com.backend.entities.Product;
import com.backend.entities.Stock;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.ProductRepository;
import com.backend.repositories.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockById(Long id) {
        return stockRepository.findById(id);
    }

    public Stock createStock(StockDto stockDto) {

        Stock stock = new Stock();

        stock.setSupplier(stockDto.getSupplier());
        stock.setRefillDate(stockDto.getRefillDate());
        stock.setQuantity(stockDto.getQuantity());
        stock.setPurchasePrice(stockDto.getPurchasePrice());
        stock.setSellingPrice(stockDto.getSellingPrice());

        Optional<Product> productOptional = productRepository.findById(stockDto.getProductId());
        if (productOptional.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        stock.setProduct(productOptional.get());

        return stockRepository.save(stock);
    }

    public Stock updateStock(Long id, StockDto stockDetails) {
        Optional<Stock> optionalStock = stockRepository.findById(id);

        if (optionalStock.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        Stock stock = optionalStock.get();

        stock.setSupplier(stockDetails.getSupplier());
        stock.setRefillDate(stockDetails.getRefillDate());
        stock.setQuantity(stockDetails.getQuantity());
        stock.setPurchasePrice(stockDetails.getPurchasePrice());
        stock.setSellingPrice(stockDetails.getSellingPrice());

        return stockRepository.save(stock);
    }

    public void deleteStock(Long id) {
        Optional<Stock> optionalStock = stockRepository.findById(id);

        if (optionalStock.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        Stock stock = optionalStock.get();

        stockRepository.delete(stock);
    }

    public List<Stock> getRefillHistoryByProduct(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);

        if (optionalProduct.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        return stockRepository.findByProductOrderByRefillDateAsc(optionalProduct.get());
    }

    public Optional<Stock> getOldestStockEntryByProduct(Long productId) {
        Optional<Product> optionalProduct = productRepository.findById(productId);

        if (optionalProduct.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        Product product = optionalProduct.get();

        return stockRepository.findFirstByProductOrderByRefillDateAsc(product);
    }
}
