import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const BrowseAuction = () => {
    const [auctions, setAuctions] = useState([]); // State to store auction data

  useEffect(() => {
    // Fetch auction data from your API or data source
    const fetchAuctions = async () => {
      const response = await fetch('/api/auctions'); // Replace with your API endpoint
      const data = await response.json();
      setAuctions(data);
    };

    fetchAuctions();
  }, []); // Empty dependency array: Fetch data only on component mount

  return (
    <div className="browse-auctions">
      <h1>Browse Auctions</h1>
      {auctions.length > 0 ? (
        <ul className="auction-list">
          {auctions.map((auction) => (
            <li key={auction.id} className="auction-item">
              <Link to={`/auctions/${auction.id}`}>
                <img src={auction.imageUrl} alt={auction.title} />
                <div className="auction-details">
                  <h3>{auction.title}</h3>
                  <p>{auction.description.slice(0, 100)}...</p>
                  <span>Current Bid: ${auction.currentBid}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No auctions found.</p>
      )}
    </div>
  );
};
export default BrowseAuction;
