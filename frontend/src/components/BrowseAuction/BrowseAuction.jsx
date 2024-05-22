import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import './BrowseAuction.css'
const BrowseAuction = () => {
  const [auctions, setAuctions] = useState([]); // State to store auction data

  useEffect(() => {
    // Fetch auction data from your API or data source
    const fetchAuctions = async () => {
      const response = await fetch('http://localhost:5000/product/allProducts'); // Replace with your API endpoint
      const data = await response.json();
      setAuctions(data);
    };

    fetchAuctions();
  }, []); // Empty dependency array: Fetch data only on component mount

  return (
    <div className="browse-auctions">
      <h1>Browse Auctions</h1>
      {auctions.length > 0 ? (
        <section className="auction-grid">
          {auctions.map((auction) => (
            <article key={auction._id} className="auction-item">
              {/* <Link to={`http://localhost:5000/product/${auction.id}`}> */}
                <img src={auction.image} alt={auction.title} style={{ width: '100px', height: '100px', objectFit: 'cover' }}/>
                <div className="auction-details">
                  <h3>{auction.description}</h3>
                  <span>Current Bid: Rs {auction.currHighestBid}</span>
                </div>
              {/* </Link> */}
            </article>
          ))}
        </section>
      ) : (
        <p>No auctions found.</p>
      )}
    </div>
  );
};

export default BrowseAuction;
