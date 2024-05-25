import React, { useState, useEffect } from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [walletAmount, setWalletAmount] = useState(0); // State to store wallet amount
  const [isAddingFunds, setIsAddingFunds] = useState(false); // State for adding funds toggle
  const [addAmount, setAddAmount] = useState(0); // State to store entered amount
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn'));
  const [onSignUp, setOnSignUp]=useState(true);
  const navigate=useNavigate();
  const handleSignUp = async () => {
    try {
      navigate('/'); // Redirect to signup page
      setOnSignUp(true);
    } catch (error) {
      console.error('Error Sign up:', error);
      // Handle errors gracefully (e.g., display an error message)
    }
  };
  const handleLogIn = async () => {
    try {
      setOnSignUp(false);
      navigate('/login'); // Redirect to signup page  
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle errors gracefully (e.g., display an error message)
    }
  };
const handleLogout = async () => {
  try {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page
  } catch (error) {
    console.error('Error logging out:', error);
    // Handle errors gracefully (e.g., display an error message)
  }
};
  // Fetch wallet amount on component mount and upon subsequent updates
  useEffect(() => {
    const fetchWalletAmount = async () => {
      if (isLoggedIn) { // Only fetch if logged in
        try {
          const token = localStorage.getItem('jwtToken');
          const response = await axios.get('http://192.168.49.2:30002/user/current', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;
          console.log(data);
          setWalletAmount(data.wallet); // Update wallet amount state
        } catch (error) {
          console.error('Error fetching wallet amount:', error);
          // Handle errors gracefully (e.g., display an error message)
        }
      }
    };

    fetchWalletAmount();
  }, [isLoggedIn]); // Dependency array: refetch on login/logout

  const handleAddFundsClick = () => {
    setIsAddingFunds(!isAddingFunds);
    setAddAmount(0); // Reset add amount on toggle
  };

  const handleAmountChange = (event) => {
    setAddAmount(parseFloat(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (addAmount <= 0) {
      console.error('Invalid amount: Please enter a positive value.');
      // Display error message to user
      return;
    }
    console.log(addAmount);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post('http://192.168.49.2:30002/wallet/addToWallet', { money: addAmount }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 200) {
        console.log('Funds added successfully!');
        window.location.reload();
        setWalletAmount(walletAmount + addAmount); // Update local wallet amount
        setIsAddingFunds(false); // Close add funds section

      } else {
        console.error('Error adding funds:', await response.text());
        // Handle errors (e.g., display an error message to user)
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      // Handle errors gracefully (e.g., display an error message)
    }
  };

  return (
    <nav className="auction-navbar">
      <div className="navbar-container">
        <NavLink exact to="/browse" className="navbar-brand">
          SELLWELL
        </NavLink>
        <ul className="nav-items">
          <li className="nav-item">
            <NavLink to="/browse" className="nav-link">
              Browse Auctions
            </NavLink>
          </li>
          {isLoggedIn ?(
            <>
              <li className="nav-item">
                <NavLink to="/sell" className="nav-link">
                  Sell Something
                </NavLink>
              </li>
              <li className="nav-item">
                Wallet Amount: {walletAmount}
              </li>
              <li className="nav-item">
                <button onClick={handleAddFundsClick}>
                  {isAddingFunds ? 'Close' : '+'}
                </button>
                {isAddingFunds && (
                  <form onSubmit={handleSubmit}>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={handleAmountChange}
                      min="0.01" // Set minimum allowed amount (optional)
                      step="0.01" // Set increment for input (optional)
                      placeholder="Enter Amount"
                      required
                    />
                    <button type="submit">Add</button>
                  </form>
                )}
              </li>
              <li className="nav-item">
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ):(!onSignUp?<><li className="nav-item">
          <button onClick={handleSignUp}>Sign Up</button>
        </li></>:<><li className="nav-item">
          <button onClick={handleLogIn}>Log In</button>
        </li></>)}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
