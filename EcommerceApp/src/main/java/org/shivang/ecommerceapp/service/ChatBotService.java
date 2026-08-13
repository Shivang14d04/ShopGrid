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

            String rawContext = fetchSemanticContext(userQuery);

            final String context;
            if (StringUtils.hasText(rawContext)) {
                context = rawContext;
            } else {
                context = "No specific product or order data found matching this query. " +
                          "Please provide a helpful general response based on the question.";
            }

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
            return "I'm having trouble accessing my knowledge base right now. Please try again in a moment.";
        }
    }

    private String fetchSemanticContext(String userQuery) {
        try {
            List<Document> documents = vectorStore.similaritySearch(
                    SearchRequest.builder()
                            .query(userQuery)
                            .topK(8)
                            .similarityThreshold(0.3)
                            .build()
            );

            if (documents == null || documents.isEmpty()) {
                return "";
            }

            StringBuilder context = new StringBuilder();
            for (Document document : documents) {
                context.append(document.getFormattedContent()).append("\n---\n");
            }
            return context.toString();
        } catch (Exception e) {
            System.err.println("Vector store search failed: " + e.getMessage());
            return "";
        }
    }
}
