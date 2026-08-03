package org.shivang.ecommerceapp.service;

import org.shivang.ecommerceapp.model.Order;
import org.shivang.ecommerceapp.model.OrderItem;
import org.shivang.ecommerceapp.model.Product;
import org.shivang.ecommerceapp.model.User;
import org.shivang.ecommerceapp.model.dto.OrderItemRequest;
import org.shivang.ecommerceapp.model.dto.OrderItemResponse;
import org.shivang.ecommerceapp.model.dto.OrderRequest;
import org.shivang.ecommerceapp.model.dto.OrderResponse;
import org.shivang.ecommerceapp.repo.OrderRepo;
import org.shivang.ecommerceapp.repo.ProductRepo;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderService {
    private final ProductRepo productRepo;
    private final OrderRepo orderRepo;
    private final VectorStore vectorStore;

    public OrderService(ProductRepo productRepo, OrderRepo orderRepo, VectorStore vectorStore) {
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.vectorStore = vectorStore;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        User authenticatedUser = getAuthenticatedUser();
        Order order = new Order();
        String orderId = "ORD" + UUID.randomUUID().toString().substring(0,10).toUpperCase();
        order.setOrderId(orderId);
        order.setCustomerName(authenticatedUser.getUsername());
        order.setEmail(authenticatedUser.getEmail());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());
        order.setUser(authenticatedUser);
        List<OrderItem> orderItems  = new ArrayList<>();
        for(OrderItemRequest itemReq: request.items()){
            if (itemReq.quantity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
            }
            Product product = productRepo.findById(itemReq.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
            if (product.getStockQuantity() < itemReq.quantity()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Insufficient stock for product: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - itemReq.quantity());
            productRepo.save(product);

            try {
                String filter = "productId == '" + product.getId() + "'";
                vectorStore.delete(filter);

                String updatedContent = String.format("""
                    
                    Product Name: %s
                    Description: %s
                    Brand: %s
                    Category: %s
                    Price: %.2f
                    Release Date: %s
                    Available: %s
                    Stock: %s
                    """,
                        product.getName(),
                        product.getDescription(),
                        product.getBrand(),
                        product.getCategory(),
                        product.getPrice(),
                        product.getReleaseDate(),
                        product.isProductAvailable(),
                        product.getStockQuantity()
                );

                Document updatedDoc = new Document(
                        UUID.randomUUID().toString(),
                        updatedContent,
                        Map.of("productId", String.valueOf(product.getId()))
                );

                vectorStore.add(List.of(updatedDoc));
            } catch (Exception e) {
                System.err.println("Failed to update product in vector store: " + e.getMessage());
            }

            OrderItem orderItem =  OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.quantity())
                    .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())))
                    .order(order)
                    .build();
            orderItems.add(orderItem);


        }

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepo.save(order);

        try {
            StringBuilder content = new StringBuilder();
            content.append("Order Summary: \n");
            content.append("Order  ID: ").append(savedOrder.getOrderId()).append("\n");
            content.append("Customer: ").append(savedOrder.getCustomerName()).append("\n");
            content.append("Email: ").append(savedOrder.getEmail()).append("\n");
            content.append("Date: ").append(savedOrder.getOrderDate()).append("\n");
            content.append("Status: ").append(savedOrder.getStatus()).append("\n");
            content.append("Products: \n");

            for(OrderItem orderItem : savedOrder.getOrderItems()) {
                content.append("- ").append(orderItem.getProduct().getName())
                        .append(" x ").append(orderItem.getQuantity())
                        .append(" = ").append(orderItem.getTotalPrice()).append("\n");
            }

            Document document = new Document(
                    UUID.randomUUID().toString(),
                    content.toString(),
                    Map.of("orderId", savedOrder.getOrderId())
            );

            vectorStore.add(List.of(document));
        } catch (Exception e) {
            System.err.println("Failed to index order summary in vector store: " + e.getMessage());
        }

        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for(OrderItem item: order.getOrderItems()){
            OrderItemResponse orderItemResponse = new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()

            );
            itemResponses.add(orderItemResponse);
        }
        OrderResponse orderResponse = new OrderResponse(
                savedOrder.getOrderId(),
                savedOrder.getCustomerName(),
                savedOrder.getEmail(),
                savedOrder.getStatus(),
                savedOrder.getOrderDate() ,
                itemResponses
        );

        return orderResponse;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrderResponses(){
        List<Order> orders = orderRepo.findAllByOrderByOrderDateDesc();
        return orders.stream().map(this::toOrderResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrderResponses(){
        User authenticatedUser = getAuthenticatedUser();
        List<Order> orders = orderRepo.findByUserUsernameOrderByOrderDateDesc(authenticatedUser.getUsername());
        return orders.stream().map(this::toOrderResponse).toList();
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for(OrderItem item:order.getOrderItems()){
            OrderItemResponse orderItemResponse = new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
            );
            itemResponses.add(orderItemResponse);
        }
        return new OrderResponse(
                order.getOrderId(),
                order.getCustomerName(),
                order.getEmail(),
                order.getStatus(),
                order.getOrderDate(),
                itemResponses
        );
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
}
