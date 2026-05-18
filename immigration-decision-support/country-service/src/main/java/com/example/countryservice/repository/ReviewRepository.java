package com.example.countryservice.repository;

import com.example.countryservice.entity.Review;
import com.example.countryservice.entity.ReviewId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
    List<Review> findByIdCountryId(Integer countryId);
    boolean existsByIdUserIdAndIdCountryId(Integer userId, Integer countryId);
}