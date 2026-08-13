package org.shivang.ecommerceapp.controller;

import org.shivang.ecommerceapp.model.dto.ChatRequest;
import org.shivang.ecommerceapp.model.dto.ChatResponse;
import org.shivang.ecommerceapp.service.ChatBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatBotController {

    @Autowired
    private ChatBotService chatBotService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askBot(@RequestBody ChatRequest request) {
        if (!StringUtils.hasText(request.message())) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Message cannot be empty.", null));
        }

        String conversationId = request.conversationId();
        if (!StringUtils.hasText(conversationId)) {
            conversationId = java.util.UUID.randomUUID().toString();
        }

        try {
            String response = chatBotService.getBotResponse(request.message(), conversationId);
            return ResponseEntity.ok(new ChatResponse(response, conversationId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ChatResponse(
                            "I'm sorry, I'm having trouble processing your request right now. Please try again.",
                            conversationId
                    ));
        }
    }
}
