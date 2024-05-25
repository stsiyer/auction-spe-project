import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AuctionItem({ auction }) {
  const [timeLeft, setTimeLeft] = useState(null); // State for remaining time in seconds

  useEffect(() => {
    // Calculate initial time remaining on component mount or auction prop change
    const getTimeRemaining = () => {
      const endTime = new Date(auction.timeToEnd);
      const now = new Date();
      const timeDiff = Math.floor((endTime - now) / 1000); // Convert difference to seconds

      // Handle negative time remaining (auction has already ended)
      if (timeDiff <= 0) {
        return 0;
      }

      return timeDiff;
    };

    const initialTimeLeft = getTimeRemaining();
    setTimeLeft(initialTimeLeft);

    // Update time left every second using an interval
    const intervalId = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        clearInterval(intervalId); // Stop the interval when time runs out
      }
    }, 1);

    return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
  }, [auction]); // Dependency array: recalculate on auction change
  const handleBid = () => {
    // Implement logic to handle bidding (e.g., navigate to a bidding page or submit a bid)
    // Check if timeLeft is valid (positive) before allowing a bid
    if (timeLeft > 0) {
      console.log('Bidding on auction:', auction._id); // Replace with actual bid submission logic
    } else {
      console.log('Auction has ended');
    }
  };
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

  return (
    <div className="auction-item">
      <div className="auction-details">
        <span>Product Name: {auction.productName}</span><br></br>
        <span>Description: {auction.description}</span> {/* Truncated description */}<br></br>
        <span>Min Bid: Rs {auction.minBid}</span><br></br>
        <span>Current Bid: Rs {auction.currHighestBid}</span><br></br>
        <span>Time Remaining: {timeLeft ? getFormattedTime(timeLeft) : 'Auction Ended'}</span><br></br>
      </div>
    {timeLeft > 0 && ( // Only display bid button if timeLeft is positive
      <button onClick={handleBid} disabled={!timeLeft}>
        {timeLeft > 0 ? 'Place Bid' : 'Auction Ended'}
      </button>
    )}
  </div>
  );
}

export default AuctionItem;
