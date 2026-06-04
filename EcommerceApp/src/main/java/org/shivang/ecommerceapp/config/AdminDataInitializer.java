package org.shivang.ecommerceapp.config;

import org.shivang.ecommerceapp.model.Role;
import org.shivang.ecommerceapp.model.User;
import org.shivang.ecommerceapp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

@Configuration
public class AdminDataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.email:admin@shop.com}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Bean
    public CommandLineRunner createAdminAccount() {
        return args -> {
            if (!StringUtils.hasText(adminPassword)) {
                System.out.println("Admin seed skipped: app.admin.password is not configured.");
                return;
            }

            boolean adminExists = userRepository.findByUsername(adminUsername).isPresent()
                    || userRepository.findByEmail(adminEmail).isPresent();

            if (!adminExists) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
            }
        };
    }
}