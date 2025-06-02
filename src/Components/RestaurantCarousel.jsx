import React, { useRef } from 'react';
import '../RestaurantCarousel.css'; // We'll create this CSS file next

// Placeholder images - In a real app, these would come from your assets or a CMS
const placeholderRestaurantImage1 = '../../res1.jpg';
const placeholderRestaurantImage2 = '../../res2.jpg';
const placeholderRestaurantImage3 = '../../res3.jpg';
const placeholderRestaurantImage4 = '../../res4.jpg';
const placeholderRestaurantImage5 = '../../res5.jpg';


const restaurantsData = [
  {
    id: 1,
    name: 'Secret Story',
    rating: 4.0,
    cuisine: 'Chinese • North Indian',
    price: '₹2500 for two',
    location: 'Nungambakkam, Chennai',
    distance: '6.3 km',
    mainOffer: 'Flat 35% off on pre-booking',
    otherOffersCount: 3,
    bankOffer: 'Up to 10% off with bank offers',
    image: placeholderRestaurantImage1,
  },
  {
    id: 2,
    name: 'Message In A Bottle',
    rating: 4.3,
    cuisine: 'Chinese • North Indian',
    price: '₹1600 for two',
    location: 'Fortel, Egmore, Chennai',
    distance: '3.3 km',
    mainOffer: 'Flat 25% off on pre-booking',
    otherOffersCount: 2,
    bankOffer: 'Up to 10% off with bank offers',
    image: placeholderRestaurantImage2,
  },
  {
    id: 3,
    name: 'Enoki',
    rating: 3.9,
    cuisine: 'Chinese • Sushi',
    price: '₹1200 for two',
    location: 'Fortel, Egmore, Chennai',
    distance: '3.3 km',
    mainOffer: 'Flat 15% off on pre-booking',
    otherOffersCount: 2,
    bankOffer: 'Up to 10% off with bank offers',
    image: placeholderRestaurantImage3,
  },
  {
    id: 4,
    name: 'The Curry Leaf',
    rating: 4.5,
    cuisine: 'South Indian • Chettinad',
    price: '₹1000 for two',
    location: 'T. Nagar, Chennai',
    distance: '4.5 km',
    mainOffer: 'Combo Meal @ ₹499',
    otherOffersCount: 1,
    bankOffer: 'Up to 5% off with bank offers',
    image: placeholderRestaurantImage4,
  },
  {
    id: 5,
    name: 'Pasta Street',
    rating: 4.2,
    cuisine: 'Italian • Pasta • Pizza',
    price: '₹1800 for two',
    location: 'Adyar, Chennai',
    distance: '8.1 km',
    mainOffer: 'Buy 1 Get 1 on Pizza',
    otherOffersCount: 0,
    bankOffer: 'Up to 10% off with bank offers',
    image: placeholderRestaurantImage5,
  },
];

const RestaurantCard = ({ restaurant }) => (
  <div className="restaurant-card-item">
    <div className="card-image-container">
      <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
      <div className="restaurant-rating">
        {restaurant.rating.toFixed(1)} <span className="star-icon">★</span>
      </div>
    </div>
    <div className="restaurant-details">
      <h3 className="restaurant-name">{restaurant.name}</h3>
      <p className="restaurant-info">{restaurant.cuisine} <span className="info-dot">•</span> {restaurant.price}</p>
      <p className="restaurant-info">{restaurant.location} <span className="info-dot">•</span> {restaurant.distance}</p>
      <div className="restaurant-booking-info">
        <svg className="table-booking-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H1v1H.5a.5.5 0 0 0 0 1H1v1.5A1.5 1.5 0 0 0 2.5 15h11A1.5 1.5 0 0 0 15 13.5V12h1a.5.5 0 0 0 0-1H15V1.5A1.5 1.5 0 0 0 13.5 0h-12zM1 1.5C1 .672.672 0 0 0v10a.5.5 0 0 1-.5.5H0V1.5zM2.5 1a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5V12H2.5V1z"/>
        </svg>
        Table booking
      </div>
    </div>
    <div className="restaurant-offers">
      <div className="main-offer">
        <svg className="offer-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-8-5a.5.5 0 0 0-1 0v3.062C5.96 6.188 5 7.438 5 9c0 1.563.96 2.813 2.031 3.375V13a.5.5 0 0 0 1 0v-.625C9.04 11.812 10 10.562 10 9c0-1.563-.96-2.813-2.031-3.375V3zM8 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
        </svg>
        {restaurant.mainOffer}
        {restaurant.otherOffersCount > 0 && (
          <span className="other-offers-count"> + {restaurant.otherOffersCount} more</span>
        )}
      </div>
      {restaurant.bankOffer && (
        <div className="bank-offer">
          {restaurant.bankOffer}
        </div>
      )}
    </div>
  </div>
);


function RestaurantCarousel() {
  const carouselContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (carouselContainerRef.current) {
      const cardWidth = carouselContainerRef.current.querySelector('.restaurant-card-item')?.offsetWidth || 300; // Estimate card width
      const scrollAmount = cardWidth + 20; // Card width + gap

      if (direction === 'left') {
        carouselContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="restaurant-carousel-wrapper">
      <div className="container">
        <div className="carousel-title-section">
          <h2 className="carousel-main-title">Discover best restaurants on Dineout</h2>
          <div className="carousel-nav-buttons">
            <button
              className="carousel-nav-arrow"
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
            >
              &larr;
            </button>
            <button
              className="carousel-nav-arrow"
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
            >
              &rarr;
            </button>
          </div>
        </div>
        <div className="restaurant-carousel-container" ref={carouselContainerRef}>
          {restaurantsData.map((restaurant) => (
            <RestaurantCard restaurant={restaurant} key={restaurant.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RestaurantCarousel;
