# OrganChain

A decentralized healthcare platform for **secure, transparent, and tamper-proof management of organ donation and medical data** — built on blockchain, IPFS, and cloud technologies.

---

## Table of Contents

- [Project Description](#project-description)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Detailed Workflow](#detailed-workflow)
- [Key Features](#key-features)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Comparison with Traditional Systems](#comparison-with-traditional-systems)
- [Limitations](#limitations)
- [Future Scope](#future-scope)
- [Contributing](#contributing)

---

## Project Description

OrganChain addresses critical challenges in traditional healthcare systems:

- Data tampering
- Lack of transparency in organ allocation
- Centralized control of sensitive records

By integrating Web3 technologies, the system ensures trust, traceability, and decentralization across all medical data interactions.

---

## Architecture Overview

### End-to-End Flow

```
User → Frontend (React - Vercel)
     → Backend (Spring Boot REST APIs)
     → Blockchain (Ethereum via Alchemy)
     → Smart Contracts

File Upload → Backend → Pinata → IPFS → CID stored on Blockchain
```

---

## Project Structure

```
Organ_BlockChain/
│
├── frontend/       # React frontend
├── backend/        # Spring Boot application
├── contracts/      # Solidity smart contracts
├── scripts/        # Deployment scripts
├── config/         # Environment configurations
└── README.md
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React.js | Fast UI rendering and seamless Web3 integration |
| Vercel | Serverless, scalable hosting |

### Backend

| Technology | Purpose |
|------------|---------|
| Spring Boot | Complex business logic, enterprise-grade REST APIs |
| Maven | Dependency management and build automation |

### Blockchain

| Technology | Purpose |
|------------|---------|
| Ethereum Smart Contracts | Immutable, decentralized data storage |
| Alchemy API | Managed node access — no self-hosted infrastructure needed |

### Storage

| Technology | Purpose |
|------------|---------|
| IPFS | Decentralized, content-addressed file storage |
| Pinata | Reliable IPFS pinning service |

### Development Tools

| Tool | Purpose |
|------|---------|
| Ganache | Local blockchain for faster testing |
| ngrok | Public tunnel for easy frontend-backend integration |

---

## Detailed Workflow

### 1. User Interaction
- User accesses the web app
- Inputs data or uploads medical records

### 2. Backend Processing
- Validates user data
- Prepares blockchain transactions

### 3. File Upload (IPFS)
- File is sent to Pinata
- IPFS returns a unique **CID (Content Identifier)**

### 4. Blockchain Storage
- Smart contract stores metadata and the IPFS CID

### 5. Data Retrieval
- CID is fetched from the blockchain
- File is retrieved securely from IPFS

---
##  Screenshots
 
###  Homepage
*Public-facing landing page with organ donation awareness and pledge CTA*
 
![OrganChain Homepage](Desktop/organchain-main/organchain-main/Version_1_Frontend/src/screenshots/landing-page.png)
 
---
 
### Admin Dashboard
*Platform dashboard for managing donors, patients, pledges, and transplant matching*
 
![OrganChain Dashboard](Desktop/organchain-main/organchain-main/Version_1_Frontend/src/screenshots/dashboard.png)
---
## Key Features
- Tamper-proof records using blockchain
- Decentralized file storage via IPFS
- Transparent organ tracking system
- Secure API-based backend
- Local blockchain testing environment

---

## Setup Instructions
### Prerequisites

- Node.js
- Java (JDK 8+)
- Maven
- Ganache
- MetaMask browser extension

### Clone the Repository
```bash
git clone https://github.com/jaideep005/Organ_BlockChain.git
cd Organ_BlockChain
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

### Smart Contract Deployment

```bash
cd contracts
# Compile and deploy using Truffle or Hardhat
```

### Start Ganache

1. Launch Ganache (GUI or CLI)
2. Copy the RPC URL
3. Configure the RPC URL in the project's environment settings
---
## Deployment

| Component  | Platform             |
|------------|----------------------|
| Frontend   | Vercel               |
| Backend    | Cloud (AWS / Heroku) |
| Blockchain | Ethereum via Alchemy |
| Storage    | IPFS via Pinata      |
---

## Comparison with Traditional Systems
| Feature        | Traditional System | OrganChain        |
|----------------|--------------------|-------------------|
| Storage        | Centralized DB     | IPFS              |
| Trust          | Low                | High (Blockchain) |
| Transparency   | Limited            | Full              |
| Security       | Moderate           | High              |

---

## Limitations
- Gas fees apply for blockchain transactions
- Write operations are slower than traditional databases
- Requires Web3 knowledge for setup and interaction

---

## Future Scope
- AI-based organ matching system
- Real-time dashboards
- Integration with hospital APIs
- Multi-chain compatibility

---

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

> If you find this project useful, consider giving it a ⭐ on GitHub!
