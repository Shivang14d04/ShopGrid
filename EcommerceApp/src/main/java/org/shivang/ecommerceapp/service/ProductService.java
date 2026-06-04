package org.shivang.ecommerceapp.service;

import org.shivang.ecommerceapp.model.Product;
import org.shivang.ecommerceapp.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepo productRepo;

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
    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        if (product.getStockQuantity() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock quantity cannot be negative");
        }
        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }
        return productRepo.save(product);
    }


    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "searchProducts", allEntries = true),
            @CacheEvict(value = "product", key = "#id")
    })
    public void deleteProduct(int id) {
        productRepo.deleteById(id);
    }


    @Cacheable(value = "searchProducts", key = "#keyword.toLowerCase()")
    public List<Product> searchProducts(String keyword) {
        return productRepo.searchProducts(keyword);
    }
}
