package com.b2bmatch.resenias.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.resenias.dto.ReviewRequest;
import com.b2bmatch.resenias.dto.ReviewResponse;
import com.b2bmatch.resenias.exception.ApiException;
import com.b2bmatch.resenias.model.Review;
import com.b2bmatch.resenias.model.external.CustomerProfileRef;
import com.b2bmatch.resenias.notification.NotificationClient;
import com.b2bmatch.resenias.repository.ReviewRepository;
import com.b2bmatch.resenias.repository.external.CustomerProfileRefRepository;
import com.b2bmatch.resenias.repository.external.ProfessionalProfileRefRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CustomerProfileRefRepository customerProfileRefRepository;
    private final ProfessionalProfileRefRepository professionalProfileRefRepository;
    private final NotificationClient notificationClient;

    @Transactional
    public ReviewResponse create(Long customerUserId, Long professionalId, ReviewRequest request) {
        CustomerProfileRef customer = customerProfileRefRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de cliente"));

        if (!reviewRepository.hasAcceptedEngagement(customer.getId(), professionalId)) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "Solo puedes reseñar a un profesional con el que hayas tenido una cotización aceptada");
        }

        if (reviewRepository.findByCustomerIdAndProfessionalId(customer.getId(), professionalId).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya reseñaste a este profesional");
        }

        Review review = new Review();
        review.setCustomerId(customer.getId());
        review.setProfessionalId(professionalId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review = reviewRepository.save(review);

        professionalProfileRefRepository.findById(professionalId).ifPresent(professional ->
                notificationClient.notify(
                        professional.getUserId(),
                        "Nueva reseña",
                        customerName(customer) + " te dejó una reseña de " + request.getRating() + " estrellas"));

        return toResponse(review, customerName(customer));
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> findForProfessional(Long professionalId) {
        return reviewRepository.findByProfessionalIdOrderByCreatedAtDesc(professionalId).stream()
                .map(review -> toResponse(review, customerName(review.getCustomerId())))
                .toList();
    }

    private String customerName(CustomerProfileRef customer) {
        return customer.getFirstName() + " " + customer.getLastName();
    }

    private String customerName(Long customerId) {
        return customerProfileRefRepository.findById(customerId)
                .map(this::customerName)
                .orElse("Cliente");
    }

    private ReviewResponse toResponse(Review review, String customerName) {
        return new ReviewResponse(
                review.getId(),
                review.getProfessionalId(),
                review.getCustomerId(),
                customerName,
                review.getRating(),
                review.getComment(),
                review.getCreatedAt());
    }
}
