import React, { useState } from 'react';
import axios from 'axios';
import './SellSomething.css';

const SellSomething = () => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    image: '',
    timeToEnd: '',
    minBid: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.productName || !formData.description || !formData.image || !formData.minBid || !formData.timeToEnd) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const startingBid = parseFloat(formData.minBid);
    if (startingBid <= 0) {
      setErrorMessage('Starting bid must be a positive number');
      return;
    }

    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error message

    try {
      const selectedDate = new Date(formData.timeToEnd);
      const timeToEnd = selectedDate.toISOString().split('.')[0] + 'Z';
      const productData = {
        ...formData,
        timeToEnd
      };
      const token = localStorage.getItem('jwtToken');

      // Define the headers with JWT token and JSON data
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('Sending product data:', productData); // Debugging statement

      const response = await axios.post('http://192.168.49.2:30002/product/addProduct', productData,{ headers });

      console.log('Response from server:', response); // Debugging statement

      if (response.status === 200) {
        console.log('Product created successfully:', response.data);
        alert(response.data.message)
        // Handle successful product creation (e.g., redirect to a confirmation page)
      } else {
        throw new Error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error occurred:', error); // Debugging statement
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sell-something">
      <h1>Sell Something</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          name="productName"
          id="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          placeholder="Enter a short but descriptive title"
        />
        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe your item in detail"
        ></textarea>
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          name="image"
          id="image"
          value={formData.image}
          onChange={handleChange}
          required
          placeholder="Enter the URL of your item's image"
        />
        <label htmlFor="timeToEnd">Auction End Date and Time:</label>
        <input
          type="datetime-local"
          name="timeToEnd"
          id="timeToEnd"
          value={formData.timeToEnd}
          onChange={handleChange}
          required
        />
        <label htmlFor="minBid">Minimum Bid:</label>
        <input
          type="number"
          name="minBid"
          id="minBid"
          value={formData.minBid}
          onChange={handleChange}
          required
          placeholder="Enter the starting bid amount"
        />
        <button type="submit" >
          {/* {isLoading ? 'Selling...' : 'Sell Now'} */}
          Sell Now
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SellSomething;
