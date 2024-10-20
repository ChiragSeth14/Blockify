import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRouter from './AppRouter'; // Import your router instead of App
import reportWebVitals from './reportWebVitals';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';
// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	devnet: { url: getFullnodeUrl('devnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
				<WalletProvider autoConnect>
    <AppRouter /> {/* Use AppRouter instead of App */}
    </WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
