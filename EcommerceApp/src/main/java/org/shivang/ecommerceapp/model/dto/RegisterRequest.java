package org.shivang.ecommerceapp.model.dto;

public record RegisterRequest(
        String username,
        String email,
        String password
) {
}