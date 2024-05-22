import React, { useState } from 'react';
import axios from 'axios'; // Assuming you're using Axios for API calls
import './SellSomething.css'
const SellSomething = () => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    image: '',
    timeToEnd: '', // Assuming user can specify time to end (adjust if needed)
    listedBy: null, // Likely handled by backend based on logged-in user
    minBid: '',
  });
  // const today = new Date().toISOString().slice(0, 10);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleChange = (event) => {
    // Handle potential date and time input
    if (event.target.name === 'endDate' || event.target.name === 'endTime') {
      setFormData({ ...formData, [event.target.name]: event.target.value });
      return; // Early return to avoid unnecessary logic
    }

    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic form validation (you can improve this)
    if (!formData.productName || !formData.description || !formData.image || !formData.minBid || !formData.endDate || !formData.endTime) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const startingBid = parseFloat(formData.minBid);
    if (startingBid <= 0) {
      setErrorMessage('Starting bid must be a positive number');
      return;
    }

    setIsLoading(true); // Set loading indicator
    console.log(formData);
    try {
      const selectedDate = new Date(formData.endDate);
      selectedDate.setHours(formData.endTime.split(':')[0]);
      selectedDate.setMinutes(formData.endTime.split(':')[1]);
      const timeToEnd = selectedDate.getTime();

      const productData = {
        ...formData,
        timeToEnd: timeToEnd,
      };
      console.log(productData);
      // Replace with your actual backend API endpoint and expected data format
      const response = await axios.post('http://192.168.49.2:3000/product/addProduct', productData);

      if (response.status === 200) {
        console.log('Product created successfully:', response.data);
        // Handle successful product creation (e.g., redirect to a confirmation page)
      } else {
        throw new Error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false); // Clear loading indicator
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
          type="url"
          name="image"
          id="image"
          value={formData.image}
          onChange={handleChange}
          required
          placeholder="Enter the URL of your item's image"
        />
        <label htmlFor="endDate">Auction End Date:</label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().slice(0, 10)} // Set minimum date to today
        />
        <label htmlFor="endTime">Auction End Time:</label>
        <input
          type="time"  // Use type="time" for time selection
          name="endTime"
          id="endTime"
          value={formData.endTime}  // Assume separate state for end time
          onChange={handleChange}
          required
        />
        <label htmlFor="minBid">Starting Bid (Rs):</label>
        <input
          type="number"
          name="minBid"
          id="minBid"
          value={formData.minBid}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01" // Allow decimal values for bids
          aria-describedby="startingBid-error" // For accessibility
        />
        <p id="startingBid-error" className="error-message"></p>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Selling...' : 'Sell Now'}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default SellSomething;
