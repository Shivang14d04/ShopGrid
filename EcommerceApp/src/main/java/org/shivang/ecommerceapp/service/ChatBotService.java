package org.shivang.ecommerceapp.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ChatBotService {

    private final ResourceLoader resourceLoader;
    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public ChatBotService(ResourceLoader resourceLoader, VectorStore vectorStore, ChatClient chatClient) {
        this.resourceLoader = resourceLoader;
        this.vectorStore = vectorStore;
        this.chatClient = chatClient;
    }

    public String getBotResponse(String userQuery, String conversationId) {
        try {
            Resource promptResource = resourceLoader.getResource("classpath:prompts/chatbot-rag-prompt.st");
            String promptStringTemplate = promptResource.getContentAsString(StandardCharsets.UTF_8);

            String context = fetchSemanticContext(userQuery);

            if (!StringUtils.hasText(conversationId)) {
                throw new IllegalArgumentException("conversationId is required for chat memory");
            }

            return chatClient.prompt()
                    .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, conversationId))
                    .system(systemSpec -> systemSpec.text(promptStringTemplate).param("context", context))
                    .user(userQuery)
                    .call()
                    .content();

        } catch (IOException e) {
            return "Bot Failed: " + e.getMessage();
        }
    }

    private String fetchSemanticContext(String userQuery) {
        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(userQuery)
                        .topK(5)
                        .similarityThresholdAll()
                        .build()
        );
        StringBuilder context = new StringBuilder();
        for (Document document : documents) {
            context.append(document.getFormattedContent()).append("\n");
        }
        return context.toString();
    }
}
