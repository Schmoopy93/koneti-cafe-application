"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Settings } from "react-slick";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { apiRequest } from "../../utils/api";
import Spinner from "../ui/Spinner";
import "./Testimonials.scss";

// Dinamički import Slider komponente da izbegnemo SSR probleme
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => <Spinner size="lg" text="Loading slider..." />,
});

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  // Google specific fields
  googleReviewId?: string;
  googleProfilePhotoUrl?: string;
  googleTimeDescription?: string;
}

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await apiRequest('/reviews/approved');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };



  const settings: Settings = {
    dots: reviews.length > 1,
    infinite: reviews.length > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: reviews.length > 1,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  const renderStars = (rating: number) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`star ${star <= rating ? 'filled' : ''}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="testimonials">
        <div className="container">
          <div className="loading">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faQuoteLeft} />
            {t('testimonials.title') || 'What Our Customers Say'}
          </h2>
          <p className="section-subtitle">
            {t('testimonials.subtitle') || 'Read reviews from our satisfied customers'}
          </p>
        </div>

        <div className="testimonials-content">
          <div className="reviews-showcase">
            {reviews.length > 0 ? (
              <>
                {/* Reviews Slider - prikaz svih recenzija u slideru */}
                <div className="reviews-slider">
                  {mounted && (
                    <Slider {...settings}>
                      {reviews.map((review) => (
                        <div key={review._id} className="slide">
                          <div className="review-card">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <div className="avatar">
                                  {review.googleProfilePhotoUrl ? (
                                    <img
                                      src={review.googleProfilePhotoUrl}
                                      alt={review.name}
                                      onError={(e) => {
                                        // Fallback na default avatar ako slika ne učita
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<i class="fas fa-user"></i>';
                                      }}
                                    />
                                  ) : (
                                    <FontAwesomeIcon icon={faUser} />
                                  )}
                                </div>
                                <div className="reviewer-details">
                                  <h4>{review.name}</h4>
                                  <div className="rating">
                                    {renderStars(review.rating)}
                                  </div>
                                  {review.googleReviewId && (
                                    <div className="google-badge">
                                      <span className="google-icon">G</span>
                                      <span>Google Review</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="review-content">
                              <p className="comment">"{review.comment}"</p>
                            </div>
                            <div className="review-footer">
                              <span className="date">
                                {review.googleTimeDescription || new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  )}
                </div>
              </>
            ) : (
              <div className="no-reviews">
                <p>{t('testimonials.noReviews') || 'No reviews yet. Be the first to leave a review!'}</p>
              </div>
            )}
          </div>

          <div className="reviews-stats">
            <div className="stat-item">
              <div className="stat-number">
                {reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}
              </div>
              <div className="stat-label">{t('testimonials.averageRating') || 'Average Rating'}</div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Testimonials;
