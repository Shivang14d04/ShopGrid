package org.shivang.ecommerceapp.service;

import org.shivang.ecommerceapp.model.Product;
import org.shivang.ecommerceapp.repo.ProductRepo;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public ProductService(ProductRepo productRepo, ChatClient chatClient, VectorStore vectorStore) {
        this.productRepo = productRepo;
        this.chatClient = chatClient;
        this.vectorStore = vectorStore;
    }

    @Cacheable(value= "product", key = "#id")
    public  Product getProductById(int id) {
        System.out.println("fetching from db");
        return productRepo.findById(id).orElse(new Product(-1));
    }

    @Cacheable(value = "products")
    public  List<Product> getAllProducts() {
        return productRepo.findAll();
    }


    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "searchProducts", allEntries = true),
            @CacheEvict(value = "product", key = "#product.id")
    })
    @Transactional
    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        if (product.getStockQuantity() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock quantity cannot be negative");
        }
        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }
        Product savedProduct = productRepo.save(product);

        try {
            vectorStore.delete("productId == '" + savedProduct.getId() + "'");
            String content = String.format("""
                    
                    Product Name: %s
                    Description: %s
                    Brand: %s
                    Category: %s
                    Price: %.2f
                    Release Date: %s
                    Available: %s
                    Stock: %s
                    """,
                    savedProduct.getName(),
                    savedProduct.getDescription(),
                    savedProduct.getBrand(),
                    savedProduct.getCategory(),
                    savedProduct.getPrice(),
                    savedProduct.getReleaseDate(),
                    savedProduct.isProductAvailable(),
                    savedProduct.getStockQuantity()
            );

            Document document = new Document(
                    UUID.randomUUID().toString(),
                    content,
                    Map.of("productId", String.valueOf(savedProduct.getId()))
            );

            vectorStore.add(List.of(document));
        } catch (Exception e) {
            System.err.println("Failed to index product in vector store: " + e.getMessage());
        }

        return savedProduct;
    }


    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "searchProducts", allEntries = true),
            @CacheEvict(value = "product", key = "#id")
    })
    @Transactional
    public void deleteProduct(int id) {
        vectorStore.delete("productId == '" + id + "'");
        productRepo.deleteById(id);
    }


    @Cacheable(value = "searchProducts", key = "#keyword.toLowerCase()")
    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }

    public String generateDescription(String name, String category) {
        String descPrompt = String.format("""
                
                Write a concise and professional product description for an e-commerce listing.
                
                Product Name: %s
                Category: %s
                
                Keep it simple, engaging, and highlight its primary features or benefits.
                Avoid technical jargon and keep it customer-friendly.
                Limit the description to 250 characters maximum.
                
                """, name , category );

        return chatClient.prompt(descPrompt)
                .call()
                .content();
    }


}
