## 🚀 Live Demo

🌐 [JobChain Application](https://symphonious-madeleine-d92343.netlify.app/)

- **Admin Login**  
  - Username: `admin`  
  - Password: `arpit2024`  

⚠️ *Note: The application may run a bit slow due to Render deployment.*
---

## 📌 Contribution

### 👨‍💻 Team Leader - Arpit Kandari
**Role:** Full-Stack Architecture & Integration

**Contributions:**
- **Frontend & Backend Integration**: Built and connected React components with Spring Boot REST APIs, handling state management and API authentication 
- **Project Coordination**: Integrated contributions from all team members, resolved dependency conflicts between blockchain and backend services

### 👨‍💻 Team Member 1 - Lokesh Jaggi
**Role:** Blockchain Infrastructure & Smart Contract Deployment

**Contributions:**
- **Polygon Amoy Testnet Setup & Configuration**: Configured network parameters and gas settings, enabling team to test smart contracts without mainnet costs
- **MetaMask Integration**: Developed wallet connection flow with proper account validation (~120 lines of Web3.js code)
- **Smart Contract Deployment**: Deployed JobChain smart contract to Polygon Amoy using Remix
- **Web3j CLI Integration**: Generated Java bindings for smart contracts, reducing manual contract interaction code 

### 👨‍💻 Team Member 2 - Manu Pathak
**Role:** Backend Development & Blockchain Integration

**Contributions:**
- **Blockchain Configuration Module**: Implemented Web3j configuration beans, contract instance management, and transaction signing 
- **Smart Contract Integration**: Built Controllers and Services for blockchain operations 
- **Data Layer Refactoring**: Redesigned Entities and Repositories to support blockchain transaction states and audit trails 
- **Error Handling**: Implemented exception handling for contract calls and network failures

### 👨‍💻 Team Member 3 - Anuj Bisht
**Role:** Frontend UI/UX & Business Logic

**Contributions:**
- **ExamStart.jsx Component**: Built exam initiation interface 
- **OmrSheet.jsx Component**: Developed OMR sheet interface
- **publicMerit Logic Fix**: Debugged and rewrote merit 
- **client.js Enhancement**: Updated API client 

---

## Updated DFD 
<img width="2262" height="2210" alt="diagram-export-11-01-2026-12_25_21" src="https://github.com/user-attachments/assets/399afe49-8ab6-40b7-bd9d-8fc312bc1542" />

---

## Updated DB Schema
<img width="1241" height="816" alt="Screenshot 2026-01-11 133207" src="https://github.com/user-attachments/assets/18b157b3-d10f-4211-9fbc-66b44239be38" />

---

# JobChain: SMART CONTRACT

<img width="2800" height="2000" alt="converted-image (2)" src="https://github.com/user-attachments/assets/cc1ea751-3610-4722-9347-ce4408e51229" />

## Overview
A Solidity smart contract for transparent and tamper-proof government job recruitment on Ethereum blockchain.

## Key Features

**🔒 Security**
- Immutable blockchain records
- Cryptographic document verification (SHA-256 hashing)
- Admin-only write access with `onlyAdmin` modifier
- Public read access for transparency

**📋 Recruitment Functions**
- Create job vacancies
- Log candidate applications
- Record exam scores
- Publish merit lists

**📝 Exam Management**
- Distribute question papers with hashes
- Lock papers at exam centers
- Scan and verify OMR sheets
- Record answer keys

**🚨 Fraud Detection**
- Detect paper leaks
- Track fraud patterns
- Immutable audit trail

## Smart Contract Structure

**State Variables**
- `admin` - Contract administrator
- `vacancyCounter` - Unique vacancy ID generator

**Data Structures**
- Vacancy, Application, ExamScore, MeritRecord
- OMRLog, PaperSet, FraudAlert

**Storage**
- Mappings for vacancies, applications, scores, merits, OMR logs
- Arrays for paper sets and fraud alerts

**Events**
- VacancyCreated, ApplicationLogged, MarksRecorded
- MeritPublished, OMRScanned, AnswerKeyRecorded
- PaperDistributed, PaperLocked, PaperLeakDetected

## Main Functions

```solidity
// Admin Functions
createVacancy(title, totalPosts, hash)
logApplication(vacancyId, appHash)
recordExamScore(vacancyId, marks, markHash)
publishMerit(vacancyId, meritHash)
recordOMRScan(omrHash, qrHash)
recordAnswerKey(answerKeyHash, isFinalized)
distributePaper(vacancyId, setId, paperHash)
lockPaper(vacancyId, centerId, setId)
detectPaperLeak(vacancyId, suspectCount, patternHash)

// View Functions (Public)
getApplicationCount(vacancyId)
getScoreCount(vacancyId)
getPaperSetCount()
getFraudAlertCount()
```

## Technology
- **Solidity**: ^0.8.24
- **Platform**: Ethereum Blockchain
- **License**: MIT

## Benefits
- ✅ Candidates can verify applications and scores
- ✅ Government gets tamper-proof records
- ✅ Public can audit recruitment process
- ✅ Automated fraud detection

---

