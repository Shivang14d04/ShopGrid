package org.shivang.ecommerceapp.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatClientConfig {

    /**
     * ChatMemory bean is auto-configured by Spring AI 2.0
     * (MessageWindowChatMemory backed by InMemoryChatMemoryRepository).
     * We inject it here to use with the memory advisor.
     */

    @Bean
    public MessageChatMemoryAdvisor messageChatMemoryAdvisor(ChatMemory chatMemory) {
        return MessageChatMemoryAdvisor.builder(chatMemory).build();
    }

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, MessageChatMemoryAdvisor messageChatMemoryAdvisor) {
      return builder.defaultAdvisors(messageChatMemoryAdvisor).build();
    }
}
