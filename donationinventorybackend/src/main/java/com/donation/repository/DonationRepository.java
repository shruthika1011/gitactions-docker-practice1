package com.donation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.donation.model.Donation;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    // No extra code needed — JPA gives us CRUD methods automatically
}
