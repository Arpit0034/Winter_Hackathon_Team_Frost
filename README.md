# JobChain 🔗  
**Blockchain-based Government Recruitment System**

## Theme
Blockchain / AI  

## Hackathon
Winter Hackathon – GEHU Bhimtal  
**Round 1 Submission**

---

## Problem Statement
Government recruitment processes often suffer from:
- Question paper leaks  
- Marks manipulation  
- Fake or modified merit lists  
- Lack of transparency and public trust  

Once exams are conducted, candidates have no reliable way to verify whether results are genuine or tampered with.

---

## Solution – JobChain
**JobChain** is a blockchain-based recruitment system that ensures **transparency, integrity, and auditability** at every stage of the hiring process.

Instead of trusting manual records, **every critical action is hashed and stored on the blockchain**, making it impossible to secretly change data later.

---
## Live Demo
🌐 https://blockchain-job.netlify.app/
- admin :: username -> Arpit , password -> arpit1
- it is bit slow due to render deployment
---

## DFD 
<img width="2024" height="2186" alt="diagram-export-30-12-2025-14_40_05" src="https://github.com/user-attachments/assets/012a34bd-c9c8-4d4d-9877-6a7f84ce535a" />

---
## Key Idea (In Simple Words)
> “If something changes, the blockchain will expose it.”

- Job details cannot be edited after publishing  
- Question papers cannot be replaced silently  
- Marks cannot be altered  
- Merit lists can be publicly verified  

---

## User Roles
### 👤 Student
- Sign up & login  
- Apply for vacancies  
- Check merit list using Vacancy ID  
- Publicly verify results (no login needed)

### 🛡️ Admin
- Create vacancies  
- Generate question paper sets  
- Lock papers at exam centers  
- Enter marks  
- Detect fraud  
- Publish merit list (only if no fraud detected)

---

## Recruitment Flow (Minimum Working)
1. **Vacancy Creation**
   - Admin creates a vacancy  
   - Vacancy data is hashed and stored on blockchain  

2. **Application Phase**
   - Students apply  
   - Application data hash is stored on blockchain  

3. **Paper Management**
   - Admin generates **5 paper sets (A–E)**  
   - Each paper has a unique hash + QR code  
   - Papers are **locked at exam center**

4. **Evaluation**
   - Admin records marks  
   - Marks JSON is hashed and stored on blockchain  

5. **Fraud Detection**
   - Detects:
     - Identical answer patterns (paper leak)
     - Abnormal score distribution (marks anomaly)
   - Fraud proof is hashed and stored permanently  

6. **Merit List**
   - If no fraud → Merit list published  
   - Merit list hash stored on blockchain  
   - Public can verify using Vacancy ID

---

## Fraud Detection (Round 1 – Concept Level)
### ✔ Marks Anomaly Detection
- Calculate average & top scores  
- If **30%+ candidates score unusually high**, system flags anomaly  
- Evidence hash stored

### ✔ Paper Leak Detection
- Compare answer hashes  
- Large identical answer patterns → possible leak  
- Blockchain stores proof

### ✔ OMR Tampering (Improved – Concept)
- Each OMR sheet contains a **QR code**
- QR data is hashed at print time  
- On scanning:
  - Hash is compared with original  
  - If mismatch → **OMR Tampering Detected**

---

## Blockchain Usage (Why It Matters)
- Only **hashes** are stored (privacy safe)  
- Blockchain provides:
  - Immutable timestamps  
  - Tamper-proof audit trail  
  - Public verification  

> Database stores data  
> Blockchain stores **proof**

---

## Tech Stack
### Backend
- Spring Boot  
- Spring Security (JWT)  
- PostgreSQL  
- Web3j  
- Lombok  

### Frontend
- React  
- Tailwind CSS  
- shadcn/ui  
- Axios  

### Blockchain
- Polygon Amoy Testnet  
- Smart contract integration planned (Round 2)

---
## DB Diagram
<img width="1171" height="702" alt="Screenshot 2025-12-30 173954" src="https://github.com/user-attachments/assets/e8ec6cb5-70b5-488e-84e3-625017cb069a" />

---
## Database Design (Simple & Auditable)
- UUIDs instead of heavy JPA relations  
- Each table stores:
  - JSON data  
  - Hash of that data  
  - Blockchain transaction hash  

Key tables:
- users  
- vacancies  
- applications  
- paper_sets  
- exam_scores  
- fraud_alerts  
- merit_lists  
- omr_records  
- answer_keys
---

## What Is Minimum Working in Round 1
✅ Vacancy creation  
✅ Applications  
✅ Paper set generation  
✅ Marks entry  
✅ Fraud detection logic  
✅ Public merit view

---

## What Makes JobChain Unique
- Blockchain used as **core security layer**, not a buzzword  
- Fraud becomes **provable**, not debatable  
- Designed for real government use  

---

##  Round 2 
- Full smart contract depoly and integrate to our app
- Fixed OMR scanning  
- Deployment of enhanced version of this app
---

> **JobChain replaces trust in authority with trust in cryptography.**
