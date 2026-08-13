package org.shivang.ecommerceapp.model.dto;

public record ChatRequest(
        String message,
        String conversationId
) {
}
