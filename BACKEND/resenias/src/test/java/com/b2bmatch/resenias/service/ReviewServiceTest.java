package com.b2bmatch.resenias.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.b2bmatch.resenias.dto.ReviewRequest;
import com.b2bmatch.resenias.exception.ApiException;
import com.b2bmatch.resenias.model.Review;
import com.b2bmatch.resenias.model.external.CustomerProfileRef;
import com.b2bmatch.resenias.notification.NotificationClient;
import com.b2bmatch.resenias.repository.ReviewRepository;
import com.b2bmatch.resenias.repository.external.CustomerProfileRefRepository;
import com.b2bmatch.resenias.repository.external.ProfessionalProfileRefRepository;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;
    @Mock
    private CustomerProfileRefRepository customerProfileRefRepository;
    @Mock
    private ProfessionalProfileRefRepository professionalProfileRefRepository;
    @Mock
    private NotificationClient notificationClient;

    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        reviewService = new ReviewService(
                reviewRepository, customerProfileRefRepository, professionalProfileRefRepository, notificationClient);
    }

    private CustomerProfileRef customerRef(long id, long userId) {
        CustomerProfileRef ref = new CustomerProfileRef();
        ref.setId(id);
        ref.setUserId(userId);
        ref.setFirstName("Marta");
        ref.setLastName("Compradora");
        return ref;
    }

    private ReviewRequest request(int rating) {
        ReviewRequest request = new ReviewRequest();
        request.setRating(rating);
        request.setComment("Excelente trabajo");
        return request;
    }

    @Test
    void create_rejectsWithoutAcceptedEngagement() {
        when(customerProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(customerRef(3L, 1L)));
        when(reviewRepository.hasAcceptedEngagement(3L, 7L)).thenReturn(false);

        assertThatThrownBy(() -> reviewService.create(1L, 7L, request(5)))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("cotización aceptada");
    }

    @Test
    void create_rejectsDuplicateReview() {
        when(customerProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(customerRef(3L, 1L)));
        when(reviewRepository.hasAcceptedEngagement(3L, 7L)).thenReturn(true);
        when(reviewRepository.findByCustomerIdAndProfessionalId(3L, 7L)).thenReturn(Optional.of(new Review()));

        assertThatThrownBy(() -> reviewService.create(1L, 7L, request(5)))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Ya reseñaste");
    }

    @Test
    void create_savesReviewSuccessfully() {
        when(customerProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(customerRef(3L, 1L)));
        when(reviewRepository.hasAcceptedEngagement(3L, 7L)).thenReturn(true);
        when(reviewRepository.findByCustomerIdAndProfessionalId(3L, 7L)).thenReturn(Optional.empty());
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> {
            Review review = invocation.getArgument(0);
            review.setId(10L);
            return review;
        });

        var response = reviewService.create(1L, 7L, request(5));

        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getRating()).isEqualTo(5);
        assertThat(response.getCustomerName()).isEqualTo("Marta Compradora");
    }
}
