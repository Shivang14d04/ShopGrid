package org.shivang.ecommerceapp.controller;

import org.shivang.ecommerceapp.model.User;
import org.shivang.ecommerceapp.model.dto.ChatRequest;
import org.shivang.ecommerceapp.model.dto.ChatResponse;
import org.shivang.ecommerceapp.service.ChatBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

        // Extract logged-in user identity so the AI doesn't ask for email
        String userIdentity = "";
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User user) {
            userIdentity = "Currently logged-in user: " + user.getUsername() + " (email: " + user.getEmail() + "). " +
                    "When the user asks about their orders, use this identity to filter results. Do not ask for their email or name.";
        }

        try {
            String response = chatBotService.getBotResponse(request.message(), conversationId, userIdentity);
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
