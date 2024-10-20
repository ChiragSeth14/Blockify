import React, { useState, useEffect } from 'react';
import { SuiClient } from '@mysten/sui.js/client';
import './PlayTrackPage.css';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';



// Connect to the Sui network (devnet in this case)
const client = new SuiClient({ url: 'https://fullnode.devnet.sui.io:443' });

function PlayTrackPage() {

    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();



  const [objectId, setObjectId] = useState(''); // Object ID of the created track
  const [message, setMessage] = useState('Track created successfully!');
  const [trackValue, setTrackValue] = useState(null);
  const [trackRoyalties, setTrackRoyalties] = useState(null);

  useEffect(() => {
    setObjectId(window.location.hash.slice(1))
  })

  // Function to play the track by calling the smart contract's play_track function
  const handlePlayTrack = async () => {
    if (!objectId) {
      alert('Please enter the track Object ID.');
      return;
    }

    try {
        const txb = new Transaction();

        const [coin] = txb.splitCoins(txb.gas, [3200000]);

        txb.moveCall({
            target: `0x27817c5fabdafbdebbc2ea762c1cf8bf5a0c882233837e62d3a8808eafb478a9::royalty_manager::play_track`,
            arguments: [txb.object(objectId), coin]
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
                    showObjectChanges: true,
                    showBalanceChanges: true
                  }
                }).then(async (result) => {
                  console.log('waited', result)
                })
              },
            },
          );
            
      // Create the transaction to call play_track function on the Sui blockchain
    //   const tx = {
    //     packageObjectId: '0x894946aea08d6e995868a44cd4f6322ca54b68ed39379869ecc2c09670abeb34', // Your package ID
    //     module: 'royalty_manager',
    //     function: 'play_track', // Smart contract function to play the track
    //     typeArguments: [],
    //     arguments: [
    //       objectId, // The Object ID of the track you want to play
    //     ],
    //     gasBudget: 10000,
    //   };

      // Execute the transaction
    //   //const response = await client.executeTransaction({ tx });

    //   console.log('Track played:', response);
    //   setMessage('Track played successfully!');

    //   // Fetch the updated track details (value and royalties incremented)
    //   const updatedTrack = await client.getObject(objectId);
    //   setTrackValue(updatedTrack?.fields?.value);
    //   setTrackRoyalties(updatedTrack?.fields?.royalties);
    } catch (error) {
      console.error('Error playing track:', error);
      alert('Failed to play track.');
    }
  };

  return (
    <div className="PlayTrackPage">
      <h1>{message}</h1>
      <div>
        <label>Track Object ID:</label>
        <input
          type="text"
          value={objectId}
          onChange={(e) => setObjectId(e.target.value)}
          required
        />
        <button onClick={handlePlayTrack}>Play Track</button>
      </div>

      {trackValue !== null && (
        <div>
          <h2>Track Updated Details:</h2>
          <p>Track Value: {trackValue}</p>
          <p>Track Royalties: {trackRoyalties}</p>
        </div>
      )}
    </div>
  );
}

export default PlayTrackPage;
