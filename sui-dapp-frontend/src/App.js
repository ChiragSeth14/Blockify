import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated for react-router-dom v6
import { SuiClient } from '@mysten/sui.js/client';
import './App.css';
import { ConnectModal, useCurrentAccount, useCurrentWallet, ConnectButton, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
// Connect to the Sui network (devnet in this case)
const client = new SuiClient({ url: 'https://fullnode.devnet.sui.io:443' });

function App() {

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  console.log('currentWallet', currentWallet)
  console.log(connectionStatus)
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  
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
      const txb = new Transaction();

      txb.moveCall({
        target: `0x27817c5fabdafbdebbc2ea762c1cf8bf5a0c882233837e62d3a8808eafb478a9::royalty_manager::create_new_track`,
        arguments: [txb.pure.u64(trackId), txb.pure.address(account.address), txb.pure.string(title), txb.pure.string(artist), txb.pure.u64(value), txb.pure.u64(royalties)]
      });

      signAndExecuteTransaction(
        {
          transaction: txb,
          
        },
        {
          onSuccess: (result) => {
            console.log('executed transaction', result);
            // setDigest(result.digest);
            suiClient.waitForTransaction({
              digest: result.digest, options: {
                showObjectChanges: true
              }
            }).then(async (result) => {
              console.log('waited', result)
              const objectId = result.objectChanges.filter((value) => {
                return value.type == "created"
              })[0].objectId
              console.log(objectId)
              navigate(`/play-track#${objectId}`); // Use navigate instead of history.push
            })
          },
        },
      );
      

        /*
        {
    "digest": "CNFPZUCUWyngTwtrGQzXfMF2MeqdUvmhBL1GzFftSWab",
    "objectChanges": [
        {
            "type": "mutated",
            "sender": "0x639e8531c65fc1ac2709a3bef97093f10b9f823f60e2ac7a36c3d42360e71397",
            "owner": {
                "AddressOwner": "0x639e8531c65fc1ac2709a3bef97093f10b9f823f60e2ac7a36c3d42360e71397"
            },
            "objectType": "0x2::coin::Coin<0x2::sui::SUI>",
            "objectId": "0x2d2dd67e5132c7b6793363a04defa4f0ab003ce050bedfd77f2b534f43daac6a",
            "version": "388",
            "previousVersion": "387",
            "digest": "8YMAbY9ugUN87BCdF7pcEVT4VotByKxYu8jQY4AfANxu"
        },
        {
            "type": "created",
            "sender": "0x639e8531c65fc1ac2709a3bef97093f10b9f823f60e2ac7a36c3d42360e71397",
            "owner": {
                "AddressOwner": "0x639e8531c65fc1ac2709a3bef97093f10b9f823f60e2ac7a36c3d42360e71397"
            },
            "objectType": "0xd0e65a8f3222ff3784d800a64552f1a29f3723610712ef29e6f77e27be920d7d::royalty_manager::MusicTrack",
            "objectId": "0x2fab5817aae63f51a929b63dcffabb0d6bbe2d8a66981394b0c5f5d1b2088bfd",
            "version": "388",
            "digest": "FqpPaCide66e1RiQrDAoZP6rzohuYs1WyQwpqmgzLjUc"
        }
    ],
    "timestampMs": "1729439869994",
    "checkpoint": "2488929"
}
*/

      // // After successful creation, navigate to the PlayTrackPage
      

    } catch (error) {
      console.error('Error creating track:', error);
      alert('Failed to create track.');
    }
  };

  return (
    <div className="App">
      <h1>Create New Track</h1>
      <ConnectButton />
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
