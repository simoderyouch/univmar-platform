package com.univmar.common.config;

import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StorageWebConfig implements WebMvcConfigurer {
    private final String storageLocation;
    public StorageWebConfig(@Value("${univmar.storage.root}") String root) {
        String location = Path.of(root).toAbsolutePath().normalize().toUri().toString();
        this.storageLocation = location.endsWith("/") ? location : location + "/";
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/v1/uploads/**").addResourceLocations(storageLocation);
    }
}
