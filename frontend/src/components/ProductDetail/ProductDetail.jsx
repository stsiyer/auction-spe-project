import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get product ID from URL
import './ProductDetails.css'
import axios from 'axios';
function ProductDetails() {
    const { productId } = useParams(); // Get product ID from URL parameters
    const [product, setProduct] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null); // State for remaining time in seconds
    const [bidPrice, setBidPrice] = useState(0);
    const [jwtToken, setJwtToken] = useState(null);
    // Function to calculate remaining time in seconds from ISO 8601 format
    function calculateRemainingTime(timeToEnd) {
        if (!timeToEnd) {
            return 0; // Handle missing timeToEnd argument
        }

        try {
            const endTime = new Date(timeToEnd);
            const now = new Date();
            const timeDiff = Math.floor((endTime - now) / 1000); // Convert difference to seconds

            // Handle negative time difference (auction has already ended)
            if (timeDiff <= 0) {
                return 0;
            }

            return timeDiff;
        } catch (error) {
            console.error('Invalid time format. Please provide a valid ISO 8601 string:', error);
            return 0;
        }
    }

    useEffect(() => {
        // Fetch product data based on productId
        const storedToken = localStorage.getItem('jwtToken');
        setJwtToken(storedToken);
        fetch(`http://192.168.49.2:30002/product/${productId}`) // Replace with your API endpoint
            .then((response) => response.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error('Error fetching product:', error)); // Log errors
    }, [productId]); // Dependency array: refetch on product ID change

    useEffect(() => {
        // Calculate remaining time on component mount or product change
        const calculateInitialTime = () => {
            if (!product) return; // Handle no product data

            const remainingTime = calculateRemainingTime(product.timeToEnd);
            setTimeLeft(remainingTime);
        };

        calculateInitialTime();

        // Optional: Update time left every second using an interval
        // Consider implementing this if real-time updates are crucial
        const intervalId = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                clearInterval(intervalId); // Stop the interval when time runs out
            }
        }, 1000);

        return () => {
            // Cleanup function: Clear the interval (if used)
            clearInterval(intervalId);
        };
    }, [product]); // Dependency array: refetch time on product change

    if (!product) return <div>Loading product details...</div>;

    // Add a more informative message if product not found
    if (!product || !product.productName) {
        return <div>Product not found.</div>;
    }

    // Function to format remaining time in seconds (replace with your desired format)
    const getFormattedTime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsRemaining = Math.floor(seconds % 60);

        const timeParts = [];
        if (days > 0) timeParts.push(`${days}d`);
        if (hours > 0) timeParts.push(`${hours}h`);
        if (minutes > 0) timeParts.push(`${minutes}m`);
        timeParts.push(`${secondsRemaining}s`);

        return timeParts.join(' ');
    };
    const handleBidSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (timeLeft <= 0) {
            alert('Auction has already ended.');
            return;
        }

        if (bidPrice <= 0 || bidPrice < product.minBid ) {
            alert('Invalid bid price. Please enter a valid amount greater than the minimum bid.');
            return;
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            };
            console.log(headers);
            const bidBody = {
                productId: product._id,
                bidPrice: bidPrice
            };
            console.log(bidBody);
            const response = await axios.post('http://192.168.49.2:30002/bidder/bidProduct', bidBody, { headers });

            console.log(response)
            if (response.status===500) {
                throw new Error(`Failed to submit bid: ${response.statusText}`);
            }else{
                const data =response.data;
            // console.log('Bid submitted successfully:', data);

            // Handle successful bid submission (e.g., update product data, display confirmation)
            if(!(response.status===200)){
                setProduct(data);
            setBidPrice(0); 
            }
            if(data.message)
            alert(data.message);
            // Update product data if API response includes updated information
            window.location.reload();
            }

        } catch (error) {
            console.error('Error submitting bid:', error);
            // alert('An error occurred while submitting your bid. Please try again.');
        }
    };

    return (
        <div className="product-details">
            <img src={product.image} alt={product.productName} />
            <span>Product Name: {product.productName}</span><br></br>
            <span>Description: {product.description}</span> {/* Truncated description */}<br></br>
            <span>Min Bid: Rs {product.minBid}</span><br></br>
            <span>Current Bid: Rs {product.currHighestBid}</span><br></br>
            <span>Time Remaining: {timeLeft ? getFormattedTime(timeLeft) : 'Auction Ended'}</span><br></br>
            {timeLeft > 0 && ( // Only display bidding section if timeLeft is positive
                <form onSubmit={handleBidSubmit}>
                    <label htmlFor="bidPrice">Enter your bid:</label>
                    <div style={{ height: '100%' ,width:'50%', display:'flex'}}>
                        <input
                            type="number"
                            id="bidPrice"
                            value={bidPrice}
                            onChange={(e) => setBidPrice(e.target.value)}
                            min={Math.max(product.minBid,product.currHighestBid)+1}
                            required
                        />
                        <button type="submit" disabled={!timeLeft}>
                        Place Bid
                    </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default ProductDetails;
