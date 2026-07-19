package com.example.recommendationservice.client;

import com.example.recommendationservice.config.FeignClientConfig;
import com.example.recommendationservice.dto.UserProfileDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", configuration = FeignClientConfig.class)
public interface UserClient {

    @GetMapping("/api/users/{id}")
    UserProfileDto getUserById(@PathVariable("id") Integer id);
}