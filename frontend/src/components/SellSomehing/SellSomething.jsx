import React, { useState } from 'react';

const SellSomething = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingBid: '',
    imageUrl: '',
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Implement logic to handle form submission:
    // - Validate form data
    // - Send data to your backend API (if applicable)
    // - Handle success or error scenarios
    console.log('Form submitted:', formData); // Placeholder for now
  };

  return (
    <div className="sell-something">
      <h1>Sell Something</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <label htmlFor="startingBid">Starting Bid:</label>
        <input
          type="number"
          name="startingBid"
          id="startingBid"
          value={formData.startingBid}
          onChange={handleChange}
          required
        />
        <label htmlFor="imageUrl">Image URL:</label>
        <input
          type="url"
          name="imageUrl"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
        <button type="submit">Sell Now</button>
      </form>
    </div>
  );
};

export default SellSomething;
