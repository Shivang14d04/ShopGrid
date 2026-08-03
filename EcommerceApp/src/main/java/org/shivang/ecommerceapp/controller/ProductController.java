package org.shivang.ecommerceapp.controller;


import org.shivang.ecommerceapp.model.Product;
import org.shivang.ecommerceapp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProductController {
    @Autowired
    private ProductService productService;


    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts(){
        return  new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id){
          Product product =   productService.getProductById(id);
          if(product.getId()> 0){
              return new ResponseEntity<>(product, HttpStatus.OK);
          }
          else{
              return new ResponseEntity<>( HttpStatus.NOT_FOUND);
          }
    }
    @PostMapping("/product")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProduct(
            @RequestPart("product") Product product,
            @RequestPart("imageFile") MultipartFile imageFile) throws IOException {

        Product savedProduct =
                productService.addOrUpdateProduct(product, imageFile);

        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){
    Product product = productService.getProductById(productId);

        if(product.getId() <= 0 || product.getImageData() == null){
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        }

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (product.getImageType() != null) {
            mediaType = MediaType.parseMediaType(product.getImageType());
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(product.getImageData());
    }
    @PutMapping("/product/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateProduct(
            @PathVariable int id,
            @RequestPart("product") Product product,
            @RequestPart(value = "imageFile", required = false)
            MultipartFile imageFile) throws IOException {

        Product existingProduct = productService.getProductById(id);

        if(existingProduct.getId() <= 0){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        product.setId(id);

        productService.addOrUpdateProduct(product,imageFile);

        return new ResponseEntity<>("Updated", HttpStatus.OK);
    }
    @DeleteMapping("/product/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable int id ){
        Product product = productService.getProductById(id);
        if(product.getId() > 0){
            productService.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/product/generate-description")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> generateDescription(@RequestParam String name, @RequestParam String category){
        try{
            String aiDesc = productService.generateDescription(name,category);
            return new ResponseEntity<>(aiDesc, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword){
       List<Product> products =  productService.searchProducts(keyword);
        System.out.println("Searching with " + keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
