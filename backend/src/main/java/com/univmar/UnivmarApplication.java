package com.univmar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UnivmarApplication {
    public static void main(String[] args) {
        SpringApplication.run(UnivmarApplication.class, args);
    }
}
