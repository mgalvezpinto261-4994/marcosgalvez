package com.b2bmatch.perfiles.service;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.perfiles.dto.CustomerProfileRequest;
import com.b2bmatch.perfiles.exception.ApiException;
import com.b2bmatch.perfiles.model.CustomerProfile;
import com.b2bmatch.perfiles.repository.CustomerProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerProfileService {

    private final CustomerProfileRepository customerProfileRepository;

    @Transactional(readOnly = true)
    public CustomerProfile findMine(Long userId) {
        return customerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Esta cuenta no tiene un perfil de cliente"));
    }

    @Transactional
    public CustomerProfile updateMine(Long userId, CustomerProfileRequest request) {
        CustomerProfile profile = findMine(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());
        profile.setUpdatedAt(LocalDateTime.now());
        return customerProfileRepository.save(profile);
    }
}
