package org.shivang.ecommerceapp.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatClientConfig {

    @Bean
    public MessageChatMemoryAdvisor messageChatMemoryAdvisor(ChatMemory chatMemory) {
        return MessageChatMemoryAdvisor.builder(chatMemory).build();
    }

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, MessageChatMemoryAdvisor messageChatMemoryAdvisor) {
      return builder.defaultAdvisors(messageChatMemoryAdvisor).build();
    }
}
