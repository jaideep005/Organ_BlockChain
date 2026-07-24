# OrganChain

A decentralized healthcare platform designed to ensure **secure, transparent, and tamper-proof management of organ donation and medical data** using blockchain, IPFS, and cloud technologies.

## Project Description

OrganChain addresses critical challenges in traditional healthcare systems such as:

* Data tampering
* Lack of transparency in organ allocation
* Centralized control of sensitive records

By integrating Web3 technologies, the system ensures trust, traceability, and decentralization.

## Architecture Overview

### End-to-End Flow

```bash
User → Frontend (React - Vercel)
     → Backend (Spring Boot REST APIs)
     → Blockchain (Ethereum via Alchemy)
     → Smart Contracts

File Upload → Backend → Pinata → IPFS → CID stored on Blockchain
```

## Project Structure

```bash
organchain/
│
├── frontend/           # React frontend
├── backend/            # Spring Boot application
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment scripts
├── config/             # Environment configurations
└── README.md
```

## Tech Stack

### Frontend

* React.js
* Vercel (Deployment)

#### Why Frontend

* Fast UI rendering
* Seamless Web3 integration
* Serverless and scalable hosting

### Backend

* Spring Boot
* Maven

#### Why Spring Boot

* Handles complex business logic
* Enterprise-grade architecture
* Secure REST APIs

#### Why Maven

* Dependency management
* Build automation

### Blockchain

* Ethereum Smart Contracts
* Alchemy API

#### Why Blockchain

* Immutable data storage
* Decentralized trust
* No need for self-hosted nodes

### Storage

* IPFS
* Pinata

#### Why Storage

* Decentralized file storage
* Content-based addressing
* Reliable pinning service

### Development Tools

* Ganache (Local blockchain)
* ngrok (Public tunnel)

#### Why Development Tools

* Faster local testing
* Easy frontend-backend integration

## Detailed Workflow

### User Interaction

* User accesses the web app
* Inputs data or uploads medical records

### Backend Processing

* Validates user data
* Prepares blockchain transactions

### File Upload (IPFS)

* File sent to Pinata
* IPFS returns a unique **CID (Content Identifier)**

### Blockchain Storage

* Smart contract stores:
  * Metadata
  * IPFS CID

### Data Retrieval

* Fetch CID from blockchain
* Retrieve file from IPFS securely

## Key Features

* Tamper-proof records using blockchain
* Decentralized storage via IPFS
* Transparent organ tracking system
* Secure API-based backend
* Local blockchain testing environment

## Setup Instructions

### Prerequisites

* Node.js
* Java (JDK 8+)
* Maven
* Ganache
* MetaMask Extension

### Clone the Repository

```bash
git clone https://github.com/ffrazi/organchain.git
cd organchain
```

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```
### API Documentation

For a full list of backend API endpoint, request parameters and example responses, SEE [API Reference](./API.md).

### Smart Contract Deployment

```bash
cd contracts
# compile & deploy using truffle/hardhat
```

### Start Ganache

* Launch Ganache GUI or CLI
* Copy RPC URL and configure in project

## Deployment

| Component  | Platform             |
| ---------- | -------------------- |
| Frontend   | Vercel               |
| Backend    | Cloud (AWS/Heroku)   |
| Blockchain | Ethereum via Alchemy |
| Storage    | IPFS via Pinata      |

## Comparison with Traditional Systems

| Feature      | Traditional System | OrganChain        |
| ------------ | ------------------ | ----------------- |
| Storage      | Centralized DB     | IPFS              |
| Trust        | Low                | High (Blockchain) |
| Transparency | Limited            | Full              |
| Security     | Moderate           | High              |

## Limitations

* Gas fees for blockchain transactions
* Slower write operations
* Requires Web3 knowledge

## Future Scope

* AI-based organ matching system
* Real-time dashboards
* Integration with hospital APIs
* Multi-chain compatibility

## Contributing

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push and create PR

## License 

> **MIT License**
>
> This project is licensed under the MIT License.
>
> For the complete license text, see the [LICENSE](LICENSE) file. 

## Acknowledgement

If you find this project useful, consider giving it a ⭐ on GitHub!
