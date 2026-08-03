package org.shivang.ecommerceapp.controller;

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

    @GetMapping("/ask")
    public ResponseEntity<String> askBot(@RequestParam String message,
                                         @RequestParam(required = false) String conversationId) {
        if (!StringUtils.hasText(conversationId)) {
            return ResponseEntity.badRequest().body("conversationId is required");
        }
        String response = chatBotService.getBotResponse(message, conversationId);
        return ResponseEntity.ok(response);
    }
}
