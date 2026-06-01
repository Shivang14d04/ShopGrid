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
import lombok.RequiredArgsConstructor;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final ProductRepo productRepo;
    private final OrderRepo orderRepo;

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
