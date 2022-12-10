import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { ThirdwebProvider } from '@thirdweb-dev/react/solana'
import { Network } from '@thirdweb-dev/sdk/solana'

const endpoint = clusterApiUrl(WalletAdapterNetwork.Devnet)
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
const network: Network = 'devnet'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <ThirdwebProvider network={network}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <RouterProvider router={router} />,
          </WalletModalProvider>
        </WalletProvider>
      </ThirdwebProvider>
    </ConnectionProvider>
  </React.StrictMode>,
)
