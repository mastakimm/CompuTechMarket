package com.backend.services;

import com.backend.dto.ResponseProductDto;
import com.backend.dto.component.RequestNewComponent;
import com.backend.dto.promotion.PromotionDto;
import com.backend.dto.stock.StockDto;
import com.backend.entities.*;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductReservationRepository productReservationRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private ProductSubCategoryRepository productSubCategoryRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    private ResponseProductDto mapToResponseProductDto(Product product) {
        try {
            List<Promotion> promotions = promotionRepository.findAllByProductId(product.getId());

            Promotion activePromotion = promotions.stream()
                    .filter(this::isPromotionActive)
                    .findFirst()
                    .orElse(null);

            List<PromotionDto> promotionDtos = promotions.stream()
                    .filter(this::isPromotionActive)
                    .map(this::mapToDto)
                    .collect(Collectors.toList());

            return new ResponseProductDto(product, promotionDtos);
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("An error occurred while mapping the product to a ResponseProductDto. Product ID: "
                    + product.getId() + ". Please check the product details and associated promotions.", e);
        }
    }
    private PromotionDto mapToDto(Promotion promotion) {
        PromotionDto dto = new PromotionDto();
        dto.setProductId(promotion.getProduct().getId());
        dto.setPromotion(promotion.getPromotion());
        dto.setStarted_at(promotion.getStarted_at());
        dto.setEnd_at(promotion.getEnd_at());
        dto.setStock(promotion.getStock());
        return dto;
    }

    public List<ProductReservation> decrementOldestStock(Long productId, int quantityToDecrement) {
        Optional<Product> optionalProduct = productRepository.findById(productId);

        if (optionalProduct.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }
        if (quantityToDecrement < 0) {
            Api.Error(ErrorCode.INVALID_QUANTITY);
        }
        Product product = optionalProduct.get();

        int totalQuantityInStock = product.getStockEntries().stream()
                .mapToInt(Stock::getQuantity)
                .sum();

        if (quantityToDecrement > totalQuantityInStock) {
            Api.Error(ErrorCode.EXCEEDS_TOTAL_STOCK);
        }

        List<Stock> stockEntries = product.getStockEntries();
        stockEntries.sort(Comparator.comparing(Stock::getRefillDate));

        int remainingQuantity = quantityToDecrement;
        Iterator<Stock> iterator = stockEntries.iterator();
        List<ProductReservation> reservations = new ArrayList<>();

        while (iterator.hasNext()) {
            Stock stock = iterator.next();
            int stockQuantity = stock.getQuantity();

            if (remainingQuantity <= stockQuantity) {
                stock.setQuantity(stockQuantity - remainingQuantity);

                ProductReservation reservation = new ProductReservation();
                reservation.setProduct(product);
                reservation.setStock(stock);
                reservation.setQuantity(remainingQuantity);
                reservation.setReservedAt(LocalDateTime.now());
                reservation.setFulfilled(false);
                reservations.add(reservation);

                remainingQuantity = 0;
                break;
            } else {
                ProductReservation reservation = new ProductReservation();
                reservation.setProduct(product);
                reservation.setStock(stock);
                reservation.setQuantity(stockQuantity);
                reservation.setReservedAt(LocalDateTime.now());
                reservation.setFulfilled(false);
                reservations.add(reservation);

                remainingQuantity -= stockQuantity;
                iterator.remove();
            }
        }

        productRepository.save(product);
        productReservationRepository.saveAll(reservations);

        return reservations;
    }



    private boolean isPromotionActive(Promotion promotion) {
        try {
            Date now = new Date();
            return now.after(promotion.getStarted_at()) && now.before(promotion.getEnd_at());
        }catch (Exception e){
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("An error occurred while mapping the product to a ResponseProductDto");
        }

    }

    public List<ResponseProductDto> createComponent(RequestNewComponent request) {
        try {
            List<Product> similarProducts = productRepository.findByModelAndNameAndManufacturer(
                    request.getModel(), request.getName(), request.getManufacturer()
            );

            Product product = new Product();

            product.setName(request.getName());
            product.setModel(request.getModel());
            product.setManufacturer(request.getManufacturer());
            product.setPrice(request.getPrice());
            product.setSpecifications(request.getSpecifications());
            product.setDescription(request.getDescription());
            product.setWeight(request.getWeight());
            product.setHeight(request.getHeight());
            product.setWidth(request.getWidth());
            product.setLength(request.getLength());
            product.setQuantity(request.getQuantity());
            product.setColor(request.getColor());

            Optional<ProductCategory> typeOptional = productCategoryRepository.findById(request.getTypeId());

            if (typeOptional.isEmpty()) {
                Api.Error(ErrorCode.NOT_FOUND);
            }
            ProductCategory productCategory = typeOptional.get();
            product.setTypeId(productCategory);

            if (request.getSubCategoryId() != null) {
                Optional<ProductSubCategory> subCategoryOptional = productSubCategoryRepository.findById(request.getSubCategoryId());

                if (subCategoryOptional.isEmpty()) {
                    Api.Error(ErrorCode.NOT_FOUND);
                }

                ProductSubCategory subCategory = subCategoryOptional.get();
                product.setProductSubCategory(subCategory);
            }

            productRepository.save(product);

            for (Product existingProduct : similarProducts) {
                if (!existingProduct.getColor().equals(request.getColor())
                        || !existingProduct.getHeight().equals(request.getHeight())
                        || !existingProduct.getWidth().equals(request.getWidth())
                        || !existingProduct.getLength().equals(request.getLength())
                        || !existingProduct.getWeight().equals(request.getWeight()))
                {
                    existingProduct.getVariants().add(product);
                    product.getVariants().add(existingProduct);
                    productRepository.save(existingProduct);
                }
            }

            if (request.getPicture() != null && !request.getPicture().isEmpty()) {
                for (String base64Image : request.getPicture()) {
                    fileUploadService.saveFileUpload(base64Image, product);
                }
            }

            return productRepository.findAll().stream()
                    .map(this::mapToResponseProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error creating component: " + e.getMessage(), e);
        }
    }

    public List<ResponseProductDto> getAll() {
        try {
            List<Product> products = productRepository.findAll();
            return products.stream()
                    .map(this::mapToResponseProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching all Components", e);
        }
    }



    public Optional<ResponseProductDto> getById(Long id) {
        try {
            return productRepository.findById(id)
                    .map(this::mapToResponseProductDto);
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching the Component by ID", e);
        }
    }

    public List<ResponseProductDto> getComponentsByType(Long typeId) {
        try {
            Optional<ProductCategory> typeOptional = productCategoryRepository.findById(typeId);
            if (typeOptional.isEmpty()) {
                Api.Error(ErrorCode.TYPE_NOT_FOUND);
                throw new RuntimeException("ComponentType not found with ID: " + typeId);
            }
            return productRepository.findByTypeId(typeOptional.get()).stream()
                    .map(this::mapToResponseProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            Api.Error(ErrorCode.TYPE_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching components by type ID", e);
        }
    }

    public List<ResponseProductDto> getComponentsByTypeAndName(Long typeId, String name) {
        try {
            Optional<ProductCategory> typeOptional = productCategoryRepository.findById(typeId);
            if (typeOptional.isEmpty()) {
                Api.Error(ErrorCode.TYPE_NOT_FOUND);
                throw new RuntimeException("ComponentType not found with ID: " + typeId);
            }

            Specification<Product> spec = Specification.where(hasType(typeOptional.get()));

            if (name != null && !name.isEmpty()) {
                spec = spec.and(hasName(name));
            }

            return productRepository.findAll(spec).stream()
                    .map(this::mapToResponseProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            Api.Error(ErrorCode.TYPE_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching components by type ID and name", e);
        }
    }

    public void deleteById(Long id) {
        try {
            productRepository.deleteById(id);
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while deleting the Component by ID", e);
        }
    }

    public List<ResponseProductDto> updateComponent(Long id, RequestNewComponent request) {
        try {
            Optional<Product> componentOptional = productRepository.findById(id);
            if (componentOptional.isEmpty()) {
                throw new RuntimeException("Component not found with ID: " + id);
            }
            Product product = componentOptional.get();

            if (request.getColor() != null) {
                boolean colorExists = product.getVariants().stream()
                        .anyMatch(variant -> variant.getColor().equalsIgnoreCase(request.getColor()));

                if (colorExists) {
                    throw new RuntimeException("A variant with the color " + request.getColor() + " already exists.");
                } else {
                    product.setColor(request.getColor());
                }
            }

            System.out.println(request.getQuantity() + ": Quantity");

            if (request.getTypeId() != null) {
                Optional<ProductCategory> typeOptional = productCategoryRepository.findById(request.getTypeId());
                if (typeOptional.isEmpty()) {
                    throw new RuntimeException("ComponentType not found with ID: " + request.getTypeId());
                }
                ProductCategory type = typeOptional.get();
                product.setTypeId(type);
            }

            if (request.getName() != null) {
                product.setName(request.getName());
            }
            if (request.getModel() != null) {
                product.setModel(request.getModel());
            }
            if (request.getManufacturer() != null) {
                product.setManufacturer(request.getManufacturer());
            }
            if (request.getPrice() != null) {
                product.setPrice(request.getPrice());
            }
            if (request.getSpecifications() != null) {
                product.setSpecifications(request.getSpecifications());
            }
            if (request.getDescription() != null) {
                product.setDescription(request.getDescription());
            }
            if (request.getQuantity() != null) {
                product.setQuantity(request.getQuantity());
            }
            if (request.getWeight() != null) {
                product.setWeight(request.getWeight());
            }
            if (request.getHeight() != null) {
                product.setHeight(request.getHeight());
            }
            if (request.getWidth() != null) {
                product.setWidth(request.getWidth());
            }
            if (request.getLength() != null) {
                product.setLength(request.getLength());
            }
            if (request.getSubCategoryId() != null) {
                ProductSubCategory subCategory = productSubCategoryRepository.findById(request.getSubCategoryId()).orElse(null);
                product.setProductSubCategory(subCategory);
            }

            if (request.getRecommended_restock() != null) {
                product.setRecommended_restock(request.getRecommended_restock());
            }

            if (request.getPicture() != null && !request.getPicture().isEmpty()) {
                List<FileUpload> existingPictures = product.getFiles();
                if (existingPictures != null && !existingPictures.isEmpty()) {
                    for (FileUpload fileUpload : existingPictures) {
                        fileUploadService.deleteFileUpload(fileUpload);
                    }
                    product.getFiles().clear();
                }
                for (String base64Image : request.getPicture()) {
                    fileUploadService.saveFileUpload(base64Image, product);
                }
            }

            productRepository.save(product);

            return productRepository.findAll().stream()
                    .map(this::mapToResponseProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error updating component: " + e.getMessage(), e);
        }
    }

    public List<ResponseProductDto> findWithFilters(String name, String description, BigDecimal minPrice, BigDecimal maxPrice) {
        try {
            Specification<Product> spec = Specification.where(null);

            if (name != null && !name.isEmpty()) {
                spec = spec.and(hasName(name));
            }

            if (description != null && !description.isEmpty()) {
                spec = spec.and(hasDescription(description));
            }

            if (minPrice != null) {
                spec = spec.and(hasMinPrice(minPrice));
            }

            if (maxPrice != null) {
                spec = spec.and(hasMaxPrice(maxPrice));
            }

            return productRepository.findAll(spec).stream()
                    .map(this::mapToResponseProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            Api.Error(ErrorCode.PREBUILD_PC_NOT_FOUND);
            throw new RuntimeException("Error finding Prebuilt PCs with filters", e);
        }
    }

    private Specification<Product> hasType(ProductCategory type) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("typeId"), type);
    }

    private Specification<Product> hasName(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("name"), name + "%");
    }

    private Specification<Product> hasDescription(String description) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("description"), "%" + description + "%");
    }

    private Specification<Product> hasMinPrice(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    private Specification<Product> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
    }



    public List<ResponseProductDto> adminGetAll() {
        try {
            List<Product> products = productRepository.findAll();
            return products.stream()
                    .map(this::mapToResponseProductDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching all Components", e);
        }
    }

    public Product convertDtoToProduct(ResponseProductDto productDto) {
        Product product = new Product();
        product.setId(productDto.getId());
        product.setName(productDto.getName());
        product.setManufacturer(productDto.getManufacturer());
        product.setModel(productDto.getModel());
        product.setPrice(productDto.getPrice());
        product.setWeight(productDto.getWeight());
        product.setHeight(productDto.getHeight());
        product.setWidth(productDto.getWidth());
        product.setLength(productDto.getLength());
        product.setSpecifications(productDto.getSpecifications());
        product.setQuantity(productDto.getQuantity());
        product.setDescription(productDto.getDescription());
        product.setColor(productDto.getColor());
        // Autres champs si nécessaire
        return product;
    }
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

}
