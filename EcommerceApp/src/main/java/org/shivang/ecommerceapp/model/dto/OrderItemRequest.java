package org.shivang.ecommerceapp.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {}
