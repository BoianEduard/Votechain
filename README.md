# Arbi1Vote – Blockchain-Based Voting App

Arbi1Vote is a decentralized voting platform built to ensure security, transparency, and fairness in digital elections — without requiring voters to pay gas fees or interact directly with blockchain operations.

## Key Features

- **Email + Wallet Authentication** – Users register with their email and link a blockchain wallet (e.g., MetaMask) to securely identify themselves.  
- **Gasless Voting** – Voters never pay gas; only the election creator covers blockchain fees.  
- **Server-Mediated Management** – A backend server handles election creation, metadata, and payments while keeping votes verifiable on-chain.  
- **On-Chain Verification** – Votes are signed in the browser and verified by the smart contract, ensuring authenticity and preventing tampering.  
- **Immutable and Transparent Results** – All votes and results are stored on the blockchain, guaranteeing transparency and auditability.

## How It Works

1. **Election Creation** – The election creator defines election details (title, candidates, voter list, etc.) and pays a small fee based on the number of participants.  
2. **Voter Registration** – Users register with their email and link their wallet address to participate.  
3. **Vote Signing** – Each vote is signed locally in the browser using the voter’s private key.  
4. **Server Relay** – The signed vote is sent to the backend server, which relays it to the blockchain. The server cannot modify votes, as validity checks occur in the smart contract.  
5. **Result Verification** – Once the election ends, anyone can view the final, verifiable results stored on-chain.

## Architecture

- **Frontend:** React + ethers.js (browser-based vote signing)  
- **Backend:** Node.js / Express (handles election metadata, authentication, and fee logic)  
- **Blockchain:** Polygon smart contracts (vote verification, tallying, and immutability)

## Why It’s Different

Unlike typical blockchain applications, Arbi1Vote bridges Web2 usability with Web3 integrity.  
The server simplifies user interaction and payment handling, but cannot corrupt or forge votes, as the blockchain independently verifies every signature.
