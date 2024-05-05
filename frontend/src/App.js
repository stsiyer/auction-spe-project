import React from 'react'; // Import the Navbar component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import components from React Router
import Navbar from './components/Navbar/Navbar';

// Import additional components for different routes (optional)
import BrowseAuction from './components/BrowseAuction/BrowseAuction';
import SellSomething from './components/SellSomehing/SellSomething';
// import AboutUs from './AboutUs'; // Example component

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Render the Navbar component */}
        <main>
          <Routes>
            <Route path="/" element={<BrowseAuction />} /> {/* Route for browse page */}
            <Route path="/sell" element={<SellSomething />} /> Route for sell page
            {/* <Route path="/about" element={<AboutUs />} /> Route for about page */}
            {/* Add more routes for other pages as needed */}
          </Routes> 
        </main>
      </div>
    </Router>
  );
}

export default App;
