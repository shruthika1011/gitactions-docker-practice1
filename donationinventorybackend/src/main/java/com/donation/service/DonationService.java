package com.donation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.donation.model.Donation;
import com.donation.repository.DonationRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    // Get all donations
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    // Get single donation by ID
    public Optional<Donation> getDonationById(Long id) {
        return donationRepository.findById(id);
    }

    // Create or update a donation
    public Donation saveDonation(Donation donation) {
        return donationRepository.save(donation);
    }

    // Delete a donation
    public void deleteDonation(Long id) {
        donationRepository.deleteById(id);
    }
}
