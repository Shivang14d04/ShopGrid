package org.shivang.ecommerceapp.model.dto;

public record LoginRequest(
        String username,
        String password
) {
}