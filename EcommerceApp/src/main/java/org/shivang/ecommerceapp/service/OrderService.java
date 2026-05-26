package org.shivang.ecommerceapp.service;

import org.shivang.ecommerceapp.model.Order;
import org.shivang.ecommerceapp.model.OrderItem;
import org.shivang.ecommerceapp.model.Product;
import org.shivang.ecommerceapp.model.dto.OrderItemRequest;
import org.shivang.ecommerceapp.model.dto.OrderItemResponse;
import org.shivang.ecommerceapp.model.dto.OrderRequest;
import org.shivang.ecommerceapp.model.dto.OrderResponse;
import org.shivang.ecommerceapp.repo.OrderRepo;
import org.shivang.ecommerceapp.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    @Autowired
        ProductRepo productRepo;
    @Autowired
        OrderRepo orderRepo;

    public OrderResponse placeOrder(OrderRequest request) {
        Order order = new Order();
        String orderId = "ORD" + UUID.randomUUID().toString().substring(0,10).toUpperCase();
        order.setOrderId(orderId);
        order.setCustomerName(request.customerName());
        order.setEmail(request.email());
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());
        List<OrderItem> orderItems  = new ArrayList<>();
        for(OrderItemRequest itemReq: request.items()){
            Product product = productRepo.findById(itemReq.productId()).orElseThrow(()-> new RuntimeException("Product not found"));
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

    public List<OrderResponse> getAllOrderResponses(){
        List<Order> orders = orderRepo.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();
        for(Order order: orders){
            List<OrderItemResponse> itemResponses = new ArrayList<>();
            for(OrderItem item:order.getOrderItems()){
                OrderItemResponse orderItemResponse = new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getTotalPrice()
                );
                itemResponses.add(orderItemResponse);
            }
            OrderResponse orderResponse = new OrderResponse(
                    order.getOrderId(),
                    order.getCustomerName(),
                    order.getEmail(),
                    order.getStatus(),
                    order.getOrderDate(),
                    itemResponses
            );
            orderResponses.add(orderResponse);
        }
        return orderResponses;
    }
}
