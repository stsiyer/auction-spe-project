import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Include if you're using routing
import './BrowseAuction.css';
import AuctionItem from './AuctionItem';
import { Link } from 'react-router-dom';

const BrowseAuction = () => {
  const [auctions, setAuctions] = useState([]); // State to store auction data

  useEffect(() => {
    // Fetch auction data from your API or data source
    const fetchAuctions = async () => {
      const response = await fetch('http://192.168.49.2:30002/product/allProducts'); // Replace with your API endpoint
      const data = await response.json();
      setAuctions(data);
    };

    fetchAuctions();
  }, []); // Empty dependency array: Fetch data only on component mount

  return (
    <div className="browse-auctions">
      <h1 className="browse-header">Browse Auctions</h1>
      {auctions.length > 0 ? (
        <section className="auction-grid">
          {auctions.map((auction) => (
            <article key={auction._id} className="auction-item">
              {/** Include routing if needed */}
              <Link to={`/product/${auction._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="image-container">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <div className="auction-details">
                  <AuctionItem auction={auction} />
                </div>
              </Link>
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
