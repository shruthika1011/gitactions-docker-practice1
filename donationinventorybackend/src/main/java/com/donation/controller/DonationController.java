package com.donation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.donation.model.Donation;
import com.donation.service.DonationService;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173") // allow frontend (Vite default port)
@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    // GET all donations
    @GetMapping
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }

    // GET donation by ID
    @GetMapping("/{id}")
    public Optional<Donation> getDonationById(@PathVariable Long id) {
        return donationService.getDonationById(id);
    }

    // POST - create donation
    @PostMapping
    public Donation createDonation(@RequestBody Donation donation) {
        return donationService.saveDonation(donation);
    }

    // PUT - update donation
    @PutMapping("/{id}")
    public Donation updateDonation(@PathVariable Long id, @RequestBody Donation donation) {
        donation.setId(id);
        return donationService.saveDonation(donation);
    }

    // DELETE - delete donation
    @DeleteMapping("/{id}")
    public void deleteDonation(@PathVariable Long id) {
        donationService.deleteDonation(id);
    }
} 
