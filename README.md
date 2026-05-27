# OrganChain

A decentralized healthcare platform for **secure, transparent, and tamper-proof management of organ donation and medical data** — built using blockchain, IPFS, and cloud technologies.

---

## Table of Contents

- [Project Description](#project-description)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Detailed Workflow](#detailed-workflow)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Comparison with Traditional Systems](#comparison-with-traditional-systems)
- [Limitations](#limitations)
- [Future Scope](#future-scope)
- [Contributing](#contributing)

---

## Project Description

OrganChain addresses major challenges in traditional healthcare systems such as:

- Data tampering
- Lack of transparency in organ allocation
- Centralized control of sensitive medical records

By integrating Web3 technologies, the platform ensures:

- Trust
- Transparency
- Traceability
- Decentralization

across all healthcare data interactions.

---

## Architecture Overview

### End-to-End Workflow

```text
User → Frontend (React + Vercel)
     → Backend (Spring Boot REST APIs)
     → Blockchain (Ethereum via Alchemy)
     → Smart Contracts

File Upload → Backend → Pinata → IPFS → CID stored on Blockchain
```

---

## Project Structure

```text
Organ_BlockChain/
│
├── frontend/       # React frontend application
├── backend/        # Spring Boot backend services
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
| React.js | Fast and responsive user interface |
| Vercel | Scalable frontend hosting |

---

### Backend

| Technology | Purpose |
|------------|---------|
| Spring Boot | REST APIs and backend business logic |
| Maven | Dependency management and build automation |

---

### Blockchain

| Technology | Purpose |
|------------|---------|
| Ethereum Smart Contracts | Immutable decentralized storage |
| Alchemy API | Blockchain node infrastructure |

---

### Storage

| Technology | Purpose |
|------------|---------|
| IPFS | Decentralized file storage |
| Pinata | Reliable IPFS pinning service |

---

### Development Tools

| Tool | Purpose |
|------|---------|
| Ganache | Local Ethereum blockchain testing |
| MetaMask | Wallet integration and transaction signing |
| ngrok | Public tunnel for local backend exposure |

---

## Detailed Workflow

### 1. User Interaction
- User accesses the web application
- Uploads medical records or enters donor/patient data

### 2. Backend Processing
- Validates incoming data
- Handles API communication
- Prepares blockchain transactions

### 3. File Upload to IPFS
- Files are uploaded to Pinata
- IPFS generates a unique CID (Content Identifier)

### 4. Blockchain Storage
- Smart contracts store metadata and IPFS CID references
- Data becomes immutable and traceable

### 5. Secure Retrieval
- CID is fetched from the blockchain
- Files are securely retrieved from IPFS

---

## Screenshots

### Homepage
*Public-facing landing page with organ donation awareness and pledge CTA*

![OrganChain Homepage](Desktop/organchain-main/organchain-main/Version_1_Frontend/src/screenshots/landing-page.png)

---

### Admin Dashboard
*Dashboard for managing donors, recipients, pledges, and transplant records*

![OrganChain Dashboard](Desktop/organchain-main/organchain-main/Version_1_Frontend/src/screenshots/dashboard.png)

---

## Key Features

- Tamper-proof medical records using blockchain
- Decentralized file storage via IPFS
- Transparent organ donor tracking system
- Smart contract-powered verification
- Secure REST API backend
- Local blockchain development environment
- Immutable audit trails for sensitive data

---

## Setup Instructions

### Prerequisites

Install the following before starting:

- Node.js
- Java (JDK 8+)
- Maven
- Ganache
- MetaMask Browser Extension

---

### Clone the Repository

By default, cloning this repository creates a local folder named `Organ_BlockChain`.

```bash
git clone https://github.com/jaideep005/Organ_BlockChain.git
cd Organ_BlockChain
```

---

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend server will start on the configured port.

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

### Smart Contract Deployment

```bash
cd contracts

# Compile contracts
truffle compile

# Deploy contracts
truffle migrate
```

You may also use Hardhat if preferred.

---

### Start Ganache

1. Launch Ganache GUI or CLI
2. Copy the RPC URL
3. Configure the RPC URL in environment variables
4. Import Ganache accounts into MetaMask

---

## Environment Variables

Create a `.env` file where required.

Example:

```env
ALCHEMY_API_KEY=your_api_key
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_secret_key
PRIVATE_KEY=your_wallet_private_key
```

---

## Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | AWS / Heroku / Render |
| Blockchain | Ethereum via Alchemy |
| Storage | IPFS via Pinata |

---

## Comparison with Traditional Systems

| Feature | Traditional System | OrganChain |
|---------|-------------------|------------|
| Storage | Centralized Database | IPFS |
| Transparency | Limited | High |
| Trust | Institution-based | Blockchain-based |
| Security | Moderate | High |
| Auditability | Difficult | Immutable |
| Data Ownership | Centralized | Decentralized |

---

## Limitations

- Blockchain transactions involve gas fees
- Slower write speeds compared to traditional databases
- Requires Web3 familiarity for advanced configuration
- Smart contract upgrades can be complex

---

## Future Scope

- AI-powered organ matching algorithms
- Real-time healthcare analytics dashboards
- Multi-chain blockchain compatibility
- Integration with hospital management systems
- Mobile application support
- Role-based access control enhancements

---

## Contributing

Contributions are welcome.

### Steps to Contribute

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push your branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

## License

This project is licensed under the `MIT License`.

---

## Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---
