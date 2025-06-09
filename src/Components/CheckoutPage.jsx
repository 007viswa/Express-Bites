// Components/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import '../CheckoutPage.css'; // The CSS file for this component

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // For general errors
    const [successMessage, setSuccessMessage] = useState(null); // For success notifications

    // Delivery Details State
    const [deliveryInfo, setDeliveryInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: ""
    });

    // Form validation state for delivery details (temporarily unused for validation checks)
    const [formErrors, setFormErrors] = useState({});

    // Payment Option State
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // Card Details State
    const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiryDate: "", cvv: "" });
    // Card Details Validation Errors
    const [cardErrors, setCardErrors] = useState({});

    // API Gateway URL for Order Service
    const ORDER_API_URL = 'http://localhost:1111/order'; // Using /order endpoint
    const PAYMENT_API_URL = 'http://localhost:1111/payment/process'; // Adjust if needed

    useEffect(() => {
        if (location.state && location.state.cartItems) {
            setCartItems(location.state.cartItems);
            setLoading(false);
            // Pre-fill email from auth context, but phone remains blank
            if (auth.isLoggedIn && auth.userEmail) {
                setDeliveryInfo(prevInfo => ({
                    ...prevInfo,
                    email: auth.userEmail
                }));
            }
        } else {
            setError("No items found in cart. Please add items before proceeding to checkout.");
            setLoading(false);
        }
    }, [location.state, auth.isLoggedIn, auth.userEmail]);

    // Handler for delivery info input changes
    const handleDeliveryInfoChange = (event) => {
        setDeliveryInfo({ ...deliveryInfo, [event.target.name]: event.target.value });
        // No validation triggered on change for now
        // setFormErrors(prevErrors => ({ ...prevErrors, [event.target.name]: "" }));
    };

    // Handler for card details input changes
    const handleCardDetailsChange = (event) => {
        setCardDetails({ ...cardDetails, [event.target.name]: event.target.value });
        setCardErrors(prevErrors => ({ ...prevErrors, [event.target.name]: "" })); // Clear error on change
    };

    // Delivery Form Validation (TEMPORARILY NOT CALLED IN handlePlaceOrder)
    const validateDeliveryForm = () => {
        const errors = {};
        if (!deliveryInfo.firstName.trim()) errors.firstName = "First name is required.";
        if (!deliveryInfo.lastName.trim()) errors.lastName = "Last name is required.";
        if (deliveryInfo.email.trim() && !/\S+@\S+\.\S+/.test(deliveryInfo.email)) {
            errors.email = "Email address is invalid.";
        }
        if (!deliveryInfo.street.trim()) errors.street = "Street is required.";
        if (!deliveryInfo.city.trim()) errors.city = "City is required.";
        if (!deliveryInfo.state.trim()) errors.state = "State is required.";
        if (!deliveryInfo.zipCode.trim()) errors.zipCode = "Zip code is required.";
        if (!deliveryInfo.country.trim()) errors.country = "Country is required.";
        if (!deliveryInfo.phone.trim()) {
            errors.phone = "Phone number is required.";
        } else if (!/^[7-9][0-9]{9}$/.test(deliveryInfo.phone)) {
            errors.phone = "Phone number must be 10 digits and start with 7, 8, or 9.";
        }
        return errors;
    };

    // Card Details Validation (still called if card selected)
    const validateCardDetails = () => {
        const errors = {};
        const { cardNumber, expiryDate, cvv } = cardDetails;

        if (!cardNumber.trim()) {
            errors.cardNumber = "Card Number is required.";
        } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            errors.cardNumber = "Must be 16 digits.";
        }

        if (!expiryDate.trim()) {
            errors.expiryDate = "Expiry Date is required.";
        } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            errors.expiryDate = "Format MM/YY.";
        } else {
            const [month, year] = expiryDate.split("/").map(Number);
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (month < 1 || month > 12) {
                errors.expiryDate = "Month must be 01-12.";
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                errors.expiryDate = "Card has expired.";
            }
        }

        if (!cvv.trim()) {
            errors.cvv = "CVV is required.";
        } else if (!/^\d{3}$/.test(cvv)) {
            errors.cvv = "Must be 3 digits.";
        }
        return errors;
    };

    // Store order details
    const cacheOrderDetails = (orderId, orderDetails) => {
        let cache = {};
        try {
            cache = JSON.parse(localStorage.getItem('expressbite_orders_cache')) || {};
        } catch {}
        cache[orderId] = orderDetails;
        localStorage.setItem('expressbite_orders_cache', JSON.stringify(cache));
    };

    const handlePlaceOrder = async () => {
        // 1. Validate Cart and Basic Info
        if (cartItems.length === 0) {
            setError("Your cart is empty. Please add items before placing an order.");
            return;
        }
        if (!auth.isLoggedIn || !auth.jwtToken) {
            setError("You must be logged in to place an order.");
            return;
        }

        // 2. Validate Payment Method Selection
        if (!selectedPaymentMethod) {
            setError("Please select a payment method.");
            return;
        }

        // 3. Validate Payment Details if Credit/Debit Card
        if (selectedPaymentMethod === "Credit/Debit Card") {
            const currentCardErrors = validateCardDetails();
            if (Object.keys(currentCardErrors).length > 0) {
                setCardErrors(currentCardErrors);
                setError("Please correct card details.");
                return;
            }
        }

        // All validations passed, proceed with order placement
        setLoading(true);
        setError(null); // Clear previous errors
        setSuccessMessage(null); // Clear previous success messages

        // --- Frontend Logging of FULL Order Details (including "ignored" details) ---
        const fullOrderDetailsForLogging = {
            restaurantId: cartItems[0]?.restaurantID,
            itemsInCart: cartItems, // Full cart items with quantity, etc.
            deliveryDetails: deliveryInfo, // All delivery details
            paymentMethodSelected: selectedPaymentMethod,
            cardDetailsProvided: selectedPaymentMethod === "Credit/Debit Card" ? cardDetails : null,
            totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            userId: auth.userEmail, // Using email as userId for now
            timestamp: new Date().toISOString()
        };
        console.log("--- Frontend Proposed Order Details (Full Payload) ---");
        console.log(JSON.stringify(fullOrderDetailsForLogging, null, 2));
        console.log("-----------------------------------------------------");


        try {
            // --- Backend Payload (Simplified to match current Orders.java) ---
            const orderPayloadForBackend = {
                userId: auth.userId, // Using a dummy Long value to satisfy backend's Long type
                restaurantID: cartItems[0]?.restaurantID, // Assuming all items from same restaurant
                totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: "PENDING", // Default status for new orders
                email: auth.userEmail
            };

            console.log("--- Sending Simplified Payload to Backend (/order) ---");
            console.log(JSON.stringify(orderPayloadForBackend, null, 2));
            console.log("-----------------------------------------------------");

            const response = await fetch(`${ORDER_API_URL}`, { // Changed to POST /order (takes Orders model)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.jwtToken}`
                },
                body: JSON.stringify(orderPayloadForBackend)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Raw backend response on error:', errorText);
                let errorMessage = `HTTP error! Status: ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += ` - ${errorJson.message || errorJson.error || 'Unknown backend error'}`;
                } catch (e) {
                    errorMessage += ` - ${errorText}`;
                }
                throw new Error(errorMessage);
            }

            const responseOrder = await response.json();
            const orderId = responseOrder?.orderId;

            // --- Store full order details in localStorage for OrderMgmt to access ---
            const detailedOrderForStorage = {
                orderId: orderId, // Use the ID from the backend
                userId: auth.userEmail, // Store user's email for identification
                restaurantID: cartItems[0]?.restaurantID,
                restaurantName: null, // Will fetch this in OrderMgmt
                totalAmount: totalOrderValue,
                status: "PENDING",
                deliveryDetails: deliveryInfo,
                paymentMethod: selectedPaymentMethod,
                orderItems: cartItems, // Store the actual cart items
                orderTime: new Date().toISOString()
            };

            cacheOrderDetails(orderId, detailedOrderForStorage);
            console.log("Full order details stored in localStorage:", detailedOrderForStorage);

            console.log("Order placed successfully with ID:", orderId);
            setSuccessMessage("Order Placed Successfully!");
            setCartItems([]); // Clear cart after successful order

            // --- Payment Processing ---
            const paymentPayload = {
                orderId: orderId, // from backend order creation response
                paymentMethod: selectedPaymentMethod,
                amount: totalOrderValue
            };

            try {
                const paymentResponse = await fetch(PAYMENT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.jwtToken}`
                    },
                    body: JSON.stringify(paymentPayload)
                });

                if (!paymentResponse.ok) {
                    const errorText = await paymentResponse.text();
                    let errorMessage = `Payment failed! Status: ${paymentResponse.status}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage += ` - ${errorJson.message || errorJson.error || 'Unknown backend error'}`;
                    } catch (e) {
                        errorMessage += ` - ${errorText}`;
                    }
                    throw new Error(errorMessage);
                }

                const paymentResult = await paymentResponse.json();
                console.log('Payment processed successfully:', paymentResult);

                // Optionally, update your localStorage cache with payment status if needed:
                // (You can add payment status to the cached order here)

            } catch (err) {
                setError(`Payment failed: ${err.message}`);
                setLoading(false);
                return; // Stop further processing if payment fails
            }

            // Simulate status change after 30 minutes (1800000 ms)
            // For testing, you can use a shorter duration, e.g., 5000 ms (5 seconds)
            const deliveryTimeMs = 1800000; // 30 minutes
            // const deliveryTimeMs = 5000; // For testing (5 seconds)

            setTimeout(() => {
                // Update the status of the order in localStorage to DELIVERED
                const currentStoredOrders = JSON.parse(localStorage.getItem('expressbite_orders_cache') || '{}');
                const updatedStoredOrders = {
                    ...currentStoredOrders,
                    [orderId]: { ...currentStoredOrders[orderId], status: "DELIVERED" }
                };
                localStorage.setItem('expressbite_orders_cache', JSON.stringify(updatedStoredOrders));
                console.log(`--- SIMULATION: Order ID ${orderId || 'Unknown'} status updated to DELIVERED in localStorage ---`);
            }, deliveryTimeMs);

            setTimeout(() => {
                setSuccessMessage(null); // Clear success message after delay
                navigate('/order'); // Navigate to My Orders page
            }, 3000); // Show success message for 3 seconds, then navigate

        } catch (err) {
            console.error('Error placing order:', err);
            setError(
                `Failed to place order: ${err.message}. Please check: \n\n` +
                `1. **Order Service Running?**: Ensure your Order Service is active. \n` +
                `2. **API Gateway Config**: Is the route \`/order\` correctly mapped? \n` +
                `3. **CORS on Backend**: Ensure CORS is configured for your frontend. \n` +
                `4. **Order Payload Match**: Does the backend's Order DTO/entity exactly match the payload being sent? \n` +
                `(Error: ${err.message})`
            );
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = ["Cash on Delivery", "Credit/Debit Card", "GPay", "PhonePe"];

    const totalOrderValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Conditional rendering for loading
    if (loading) {
        return (
            <div className="checkout-page-container">
                <Header />
                <div className="loading-message">
                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    Processing order...
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="checkout-page-container">
            <Header />
            <main className="checkout-main-content">
                <h1 className="checkout-page-title">Proceed to Checkout</h1>
                <div className="checkout-grid">
                    {/* Left Section: Delivery Details */}
                    <div className="delivery-details-section">
                        <h2 className="section-title">Delivery Information</h2>
                        {/* Display success message here if present */}
                        {successMessage && (
                            <div className="success-message">
                                <div className="success-icon-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-8.5" /><polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <span className="success-heading">Success!</span>
                                </div>
                                <p className="success-details">{successMessage}</p>
                            </div>
                        )}
                         {/* Display error message here if present */}
                        {error && (
                            <div className="error-message">
                                <div className="error-icon-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="m15 9-6 6"></path>
                                        <path d="m9 9 6 6"></path>
                                    </svg>
                                    <span className="error-heading">Error!</span>
                                </div>
                                <p className="error-details">{error}</p>
                            </div>
                        )}
                        <form className="delivery-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="multi-fields">
                                <div className={`form-group ${deliveryInfo.firstName && 'has-content'} ${formErrors.firstName ? 'has-error' : ''}`}>
                                    <input type="text" name="firstName" id="firstName" value={deliveryInfo.firstName} onChange={handleDeliveryInfoChange} placeholder=" " />
                                    <label htmlFor="firstName">First Name *</label>
                                    {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                                </div>
                                <div className={`form-group ${deliveryInfo.lastName && 'has-content'} ${formErrors.lastName ? 'has-error' : ''}`}>
                                    <input type="text" name="lastName" id="lastName" value={deliveryInfo.lastName} onChange={handleDeliveryInfoChange} placeholder=" " />
                                    <label htmlFor="lastName">Last Name *</label>
                                    {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                                </div>
                            </div>

                            <div className={`form-group ${deliveryInfo.email && 'has-content'} ${formErrors.email ? 'has-error' : ''}`}>
                                <input type="email" name="email" id="email" value={deliveryInfo.email} onChange={handleDeliveryInfoChange} placeholder=" " />
                                <label htmlFor="email">Email Address</label>
                                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                            </div>

                            <div className={`form-group ${deliveryInfo.street && 'has-content'} ${formErrors.street ? 'has-error' : ''}`}>
                                <input type="text" name="street" id="street" value={deliveryInfo.street} onChange={handleDeliveryInfoChange} placeholder=" " />
                                <label htmlFor="street">Street *</label>
                                {formErrors.street && <span className="error-text">{formErrors.street}</span>}
                            </div>

                            <div className="multi-fields">
                                <div className={`form-group ${deliveryInfo.city && 'has-content'} ${formErrors.city ? 'has-error' : ''}`}>
                                    <input type="text" name="city" id="city" value={deliveryInfo.city} onChange={handleDeliveryInfoChange} placeholder=" " />
                                    <label htmlFor="city">City *</label>
                                    {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                                </div>
                                <div className={`form-group ${deliveryInfo.state && 'has-content'} ${formErrors.state ? 'has-error' : ''}`}>
                                    <input type="text" name="state" id="state" value={deliveryInfo.state} onChange={handleDeliveryInfoChange} placeholder=" " />
                                    <label htmlFor="state">State *</label>
                                    {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                                </div>
                            </div>

                            <div className="multi-fields">
                                <div className={`form-group ${deliveryInfo.zipCode && 'has-content'} ${formErrors.zipCode ? 'has-error' : ''}`}>
                                    <input type="text" name="zipCode" id="zipCode" value={deliveryInfo.zipCode} onChange={handleDeliveryInfoChange} placeholder=" " />
                                    <label htmlFor="zipCode">Zip Code *</label>
                                    {formErrors.zipCode && <span className="error-text">{formErrors.zipCode}</span>}
                                </div>
                                <div className={`form-group ${deliveryInfo.country && 'has-content'} ${formErrors.country ? 'has-error' : ''}`}>
                                    <input type="text" name="country" id="country" value={deliveryInfo.country} onChange={handleDeliveryInfoChange} placeholder=" " />
                                    <label htmlFor="country">Country *</label>
                                    {formErrors.country && <span className="error-text">{formErrors.country}</span>}
                                </div>
                            </div>

                            <div className={`form-group ${deliveryInfo.phone && 'has-content'} ${formErrors.phone ? 'has-error' : ''}`}>
                                <input type="tel" name="phone" id="phone" value={deliveryInfo.phone} onChange={handleDeliveryInfoChange} placeholder=" " />
                                <label htmlFor="phone">Phone Number *</label>
                                {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                            </div>
                        </form>
                    </div>

                    {/* Right Section: Order Summary & Payment Options */}
                    <div className="payment-options-section">
                        <h2 className="section-title">Order Summary</h2>
                        <div className="order-summary-box">
                            <div className="order-summary-items">
                                {cartItems.map(item => (
                                    <div key={item.itemID} className="summary-item">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-total">
                                <span>Total Amount:</span>
                                <span>₹{totalOrderValue.toFixed(2)}</span>
                            </div>
                        </div>

                        <h2 className="section-title mt-6">Payment Options</h2>
                        <div className="payment-methods-grid">
                            {paymentMethods.map((method) => (
                                <label key={method} className={`payment-method-card ${selectedPaymentMethod === method ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={selectedPaymentMethod === method}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-content">
                                        {/* Dynamic Icons */}
                                        {method === "Cash on Delivery" && <img src="https://img.icons8.com/color/48/000000/cash-in-hand.png" alt="Cash on Delivery" className="payment-icon" />}
                                        {method === "Credit/Debit Card" && <img src="../../credit-card.png" alt="Card" className="payment-icon" />}
                                        {method === "GPay" && <img src="https://img.icons8.com/color/48/000000/google-pay.png" alt="GPay" className="payment-icon" />}
                                        {method === "PhonePe" && <img src="../../phonepe.png" alt="PhonePe" className="payment-icon" />}
                                        <span>{method}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Credit/Debit Card Details - Conditional Rendering */}
                        {selectedPaymentMethod === "Credit/Debit Card" && (
                            <div className="card-details-section">
                                <h3 className="card-details-title">Enter Card Details</h3>
                                <div className={`form-group ${cardDetails.cardNumber && 'has-content'} ${cardErrors.cardNumber ? 'has-error' : ''}`}>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        id="cardNumber"
                                        value={cardDetails.cardNumber}
                                        onChange={handleCardDetailsChange}
                                        placeholder=" "
                                        maxLength="19" // 16 digits + 3 spaces
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                            handleCardDetailsChange(e);
                                        }}
                                    />
                                    <label htmlFor="cardNumber">Card Number *</label>
                                    {cardErrors.cardNumber && <span className="error-text">{cardErrors.cardNumber}</span>}
                                </div>

                                <div className="multi-fields card-row">
                                    <div className={`form-group ${cardDetails.expiryDate && 'has-content'} ${cardErrors.expiryDate ? 'has-error' : ''}`}>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            id="expiryDate"
                                            value={cardDetails.expiryDate}
                                            onChange={handleCardDetailsChange}
                                            placeholder=" "
                                            maxLength="5" // MM/YY
                                            onInput={(e) => {
                                                if (e.target.value.length === 2 && e.target.value.indexOf('/') === -1) {
                                                    e.target.value += '/';
                                                }
                                                handleCardDetailsChange(e);
                                            }}
                                        />
                                        <label htmlFor="expiryDate">Expiry Date *</label>
                                        {cardErrors.expiryDate && <span className="error-text">{cardErrors.expiryDate}</span>}
                                    </div>
                                    <div className={`form-group ${cardDetails.cvv && 'has-content'} ${cardErrors.cvv ? 'has-error' : ''}`}>
                                        <input
                                            type="password"
                                            name="cvv"
                                            id="cvv"
                                            value={cardDetails.cvv}
                                            onChange={handleCardDetailsChange}
                                            placeholder=" "
                                            maxLength="3"
                                        />
                                        <label htmlFor="cvv">CVV *</label>
                                        {cardErrors.cvv && <span className="error-text">{cardErrors.cvv}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* UPI QR Code - Conditional Rendering */}
                        {(selectedPaymentMethod === "GPay" || selectedPaymentMethod === "PhonePe") && (
                            <div className="qr-container">
                                <h3 className="qr-title">Scan to Pay with {selectedPaymentMethod}</h3>
                                <div className="qr-wrapper">
                                    <img src="/QR code.jpg" alt="Scan to Pay" className="qr-code" /> {/* Corrected path */}
                                    <p className="qr-instruction">Open {selectedPaymentMethod} app and scan to complete payment.</p>
                                </div>
                            </div>
                        )}

                        <button className="place-order-button" onClick={handlePlaceOrder}>
                            Pay & Place Order (₹{totalOrderValue.toFixed(2)})
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
