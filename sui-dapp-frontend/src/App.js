import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated for react-router-dom v6
import { SuiClient } from '@mysten/sui.js/client';
import './App.css';


// Connect to the Sui network (devnet in this case)
const client = new SuiClient({ url: 'https://fullnode.devnet.sui.io:443' });

function App() {
  const [trackId, setTrackId] = useState('');
  const [owner, setOwner] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [value, setValue] = useState('');
  const [royalties, setRoyalties] = useState('');

  const navigate = useNavigate(); // Use navigate instead of useHistory

  // This function will handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create the transaction to send to the Sui blockchain
      const tx = {
        packageObjectId: '0x7b001d40a7724d11eaaf16e8fb4dd9b568fc7d3bbed5818ddb20fd29f5a0b56a', // Replace with your published contract address
        module: 'royalty_manager', // The module where your smart contract function is
        function: 'create_new_track', // The smart contract function to be called
        typeArguments: [], // No type arguments in this case
        arguments: [
          trackId, // Track ID from the form input
          owner, // Owner address from the form input
          title.charCodeAt(0), // Convert title to u8 (first character)
          artist.charCodeAt(0), // Convert artist name to u8 (first character)
          parseInt(value), // Initial value of the track
          parseInt(royalties), // Royalties percentage
        ],
        gasBudget: 10000, // Gas budget for the transaction
      };

      // For now, we're just logging the transaction object instead of sending it
      console.log('Transaction:', tx);

      // After successful creation, navigate to the PlayTrackPage
      navigate('/play-track'); // Use navigate instead of history.push

    } catch (error) {
      console.error('Error creating track:', error);
      alert('Failed to create track.');
    }
  };

  return (
    <div className="App">
      <h1>Create New Track</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Track ID:</label>
          <input
            type="number"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Owner Address:</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Track Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Artist:</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Initial Value:</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Royalties (%):</label>
          <input
            type="number"
            value={royalties}
            onChange={(e) => setRoyalties(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Track</button>
      </form>
    </div>
  );
}

export default App;
