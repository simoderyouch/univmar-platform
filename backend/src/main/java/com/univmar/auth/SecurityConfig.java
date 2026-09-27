package com.univmar.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final String[] ALL_STAFF = {"ADMIN", "MANAGER", "SALES_AGENT", "INVENTORY_MANAGER", "PURCHASING_MANAGER"};
    private static final String[] ADMIN_AND_MANAGER = {"ADMIN", "MANAGER"};
    private static final String[] COMMERCIAL = {"ADMIN", "MANAGER", "SALES_AGENT"};
    private static final String[] WAREHOUSE = {"ADMIN", "MANAGER", "INVENTORY_MANAGER"};
    private static final String[] PROCUREMENT = {"ADMIN", "MANAGER", "PURCHASING_MANAGER"};

    @Value("${univmar.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter, ApiAuthenticationEntryPoint authenticationEntryPoint, ApiAccessDeniedHandler accessDeniedHandler) throws Exception {
        return http.csrf(csrf -> csrf.disable()).cors(cors -> {}).sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(authenticationEntryPoint).accessDeniedHandler(accessDeniedHandler))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints deliberately remain available without a staff session.
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                .requestMatchers("/api/v1/health", "/actuator/health/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                // Landing requests and showcase reads are intentionally public; the CMS itself is staff-only below.
                .requestMatchers(HttpMethod.GET, "/api/v1/public/contact-form").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/public/contact-form/submissions").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/public/contact-form/submissions-with-files").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/public/showcase/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/public/catalog/**", "/api/v1/public/portfolio/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/public/quotations/**").permitAll()
                // The landing proxy posts responses using /{token}/response. Keep this
                // subtree public; the controller exposes no other public POST action.
                .requestMatchers(HttpMethod.POST, "/api/v1/public/quotations/**").permitAll()
                // Catalog and stock photos are display assets. Private uploaded documents require a staff session.
                .requestMatchers(HttpMethod.GET, "/api/v1/uploads/images/**", "/api/v1/uploads/base-gallery/**", "/api/v1/labels/*/qr.png").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/uploads/documents/**").hasAnyRole(ALL_STAFF)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/v1/users/**").hasRole("ADMIN")

                // The sales team works website enquiries, while CMS content and settings stay with management.
                .requestMatchers("/api/v1/cms/contact-submissions/**").hasAnyRole(COMMERCIAL)
                .requestMatchers("/api/v1/cms/**").hasAnyRole(ADMIN_AND_MANAGER)

                // Finance is limited to senior staff because these actions affect issued invoices and payments.
                .requestMatchers(HttpMethod.POST, "/api/v1/invoices/**").hasAnyRole(ADMIN_AND_MANAGER)

                // Purchasing owns suppliers and purchase orders, including supplier-goods receipts.
                .requestMatchers(HttpMethod.POST, "/api/v1/suppliers/**", "/api/v1/purchase-orders/**").hasAnyRole(PROCUREMENT)
                .requestMatchers(HttpMethod.PUT, "/api/v1/suppliers/**", "/api/v1/purchase-orders/**").hasAnyRole(PROCUREMENT)
                .requestMatchers(HttpMethod.PATCH, "/api/v1/suppliers/**", "/api/v1/purchase-orders/**").hasAnyRole(PROCUREMENT)
                .requestMatchers(HttpMethod.DELETE, "/api/v1/suppliers/**", "/api/v1/purchase-orders/**").hasAnyRole(PROCUREMENT)

                // Warehouse staff control physical stock, its labels, delivery, and workshop processing.
                .requestMatchers(HttpMethod.POST, "/api/v1/inventory/**", "/api/v1/warehouses/**", "/api/v1/slabs/**", "/api/v1/remnants/**", "/api/v1/labels/**", "/api/v1/deliveries/**", "/api/v1/fabrication/**").hasAnyRole(WAREHOUSE)
                .requestMatchers(HttpMethod.PUT, "/api/v1/inventory/**", "/api/v1/warehouses/**", "/api/v1/slabs/**", "/api/v1/remnants/**", "/api/v1/labels/**", "/api/v1/deliveries/**", "/api/v1/fabrication/**").hasAnyRole(WAREHOUSE)
                .requestMatchers(HttpMethod.PATCH, "/api/v1/inventory/**", "/api/v1/warehouses/**", "/api/v1/slabs/**", "/api/v1/remnants/**", "/api/v1/labels/**", "/api/v1/deliveries/**", "/api/v1/fabrication/**").hasAnyRole(WAREHOUSE)
                .requestMatchers(HttpMethod.DELETE, "/api/v1/inventory/**", "/api/v1/warehouses/**", "/api/v1/slabs/**", "/api/v1/remnants/**", "/api/v1/labels/**", "/api/v1/deliveries/**", "/api/v1/fabrication/**").hasAnyRole(WAREHOUSE)

                // Sales owns the customer-to-order workflow. Catalog maintenance remains senior-only.
                .requestMatchers(HttpMethod.POST, "/api/v1/customers/**", "/api/v1/projects/**", "/api/v1/rfqs/**", "/api/v1/quotations/**", "/api/v1/orders/**").hasAnyRole(COMMERCIAL)
                .requestMatchers(HttpMethod.PUT, "/api/v1/customers/**", "/api/v1/projects/**", "/api/v1/rfqs/**", "/api/v1/quotations/**", "/api/v1/orders/**").hasAnyRole(COMMERCIAL)
                .requestMatchers(HttpMethod.PATCH, "/api/v1/customers/**", "/api/v1/projects/**", "/api/v1/rfqs/**", "/api/v1/quotations/**", "/api/v1/orders/**").hasAnyRole(COMMERCIAL)
                .requestMatchers(HttpMethod.DELETE, "/api/v1/customers/**", "/api/v1/projects/**", "/api/v1/rfqs/**", "/api/v1/quotations/**", "/api/v1/orders/**").hasAnyRole(COMMERCIAL)
                .requestMatchers(HttpMethod.POST, "/api/v1/materials/**").hasAnyRole(ADMIN_AND_MANAGER)
                .requestMatchers(HttpMethod.PUT, "/api/v1/materials/**").hasAnyRole(ADMIN_AND_MANAGER)
                .requestMatchers(HttpMethod.PATCH, "/api/v1/materials/**").hasAnyRole(ADMIN_AND_MANAGER)
                .requestMatchers(HttpMethod.DELETE, "/api/v1/materials/**").hasAnyRole(ADMIN_AND_MANAGER)
                .requestMatchers(HttpMethod.POST, "/api/v1/material-categories/**").hasAnyRole(ADMIN_AND_MANAGER)
                .requestMatchers(HttpMethod.PUT, "/api/v1/material-categories/**").hasAnyRole(ADMIN_AND_MANAGER)
                .requestMatchers(HttpMethod.PATCH, "/api/v1/material-categories/**").hasAnyRole(ADMIN_AND_MANAGER)
                .requestMatchers(HttpMethod.DELETE, "/api/v1/material-categories/**").hasAnyRole(ADMIN_AND_MANAGER)

                // Any authenticated employee may attach supporting files, while only admins/managers may view audit history.
                .requestMatchers(HttpMethod.POST, "/api/v1/uploads/**", "/api/v1/documents/**").hasAnyRole(ALL_STAFF)
                .requestMatchers(HttpMethod.DELETE, "/api/v1/documents/**").hasAnyRole(ALL_STAFF)
                .requestMatchers("/api/v1/activity/**").hasAnyRole(ADMIN_AND_MANAGER)

                // All staff can read ERP data. New API endpoints are denied until a role is assigned above.
                .requestMatchers(HttpMethod.GET, "/api/v1/**").hasAnyRole(ALL_STAFF)
                .anyRequest().denyAll())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(value -> !value.isEmpty()).toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Request-Id"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
