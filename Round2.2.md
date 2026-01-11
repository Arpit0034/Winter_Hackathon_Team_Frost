# JobChain: Blockchain-Integrated Government Recruitment Platform

> **Mission**: Eliminating corruption in government recruitment through blockchain technology.

---

## Table of Contents

1. [Frontend Architecture](#frontend-architecture)
2. [Backend Architecture](#backend-architecture)
3. [System Integration](#system-integration)
4. [Security & Data Integrity](#security--data-integrity)
5. [Deployment](#deployment)

---

## Frontend Architecture

### Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **React Router v6** | Client-side routing |
| **Vite** | Build tool |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library |
| **Axios** | HTTP client |
| **react-hook-form** | Form management |
| **zod** | Schema validation |
| **Lucide React** | Icons |

### Directory Structure

```
jobchain-frontend/
├── src/
│   ├── api/
│   │   └── client.js                    # Centralized API client
│   ├── auth/
│   │   ├── AuthContext.jsx              # Auth state management
│   │   ├── Login.jsx                    # Login page
│   │   └── Signup.jsx                   # Registration page
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   │   ├── alert.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── checkbox.jsx
│   │   │   ├── form.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── select.jsx
│   │   │   └── table.jsx
│   │   ├── FraudAlert.jsx               # Fraud detection alerts
│   │   ├── OmrSheet.jsx                 # OMR interface
│   │   ├── ProtectedRoute.jsx           # Route protection
│   │   └── QRScanner.jsx                # QR code scanning
│   ├── pages/
│   │   ├── AdminDashboard.jsx           # Admin control panel
│   │   ├── AdminExamMerit.jsx           # Exam & merit management
│   │   ├── CandidateApply.jsx           # Job application form
│   │   ├── ExamStart.jsx                # Exam initialization
│   │   ├── PaperManagement.jsx          # Question paper generation
│   │   ├── PublicMeritView.jsx          # Public merit list
│   │   └── StudentDashboard.jsx         # Student portal
│   ├── lib/
│   │   └── utils.js                     # Utility functions
│   ├── types/
│   │   └── index.js                     # Type definitions
│   ├── App.jsx                          # Main app & routing
│   ├── main.jsx                         # React entry point
│   └── index.css                        # Global styles
├── public/                              # Static assets
├── .env                                 # Environment variables
├── tailwind.config.js
└── package.json
```

### Core Modules

#### 1. API Layer (`src/api/client.js`)

Centralized Axios client with JWT authentication interceptor supporting these API groups:

- **authApi** - Authentication (login, signup)
- **vacancyApi** - Vacancy CRUD operations
- **applicationApi** - Application submissions
- **paperApi** - Question paper generation & locking
- **examApi** - Exam scores, OMR, merit lists
- **fraudApi** - Fraud detection & alerts

#### 2. Authentication (`src/auth/`)

**AuthContext.jsx** manages global authentication state:
- JWT token decoding & storage
- User session persistence
- Role-based access control (ADMIN, STUDENT)
- Login/logout functionality

**Login.jsx & Signup.jsx** provide modern authentication pages with glassmorphism design.

#### 3. Components (`src/components/`)

| Component | Purpose |
|-----------|---------|
| **FraudAlert.jsx** | Display fraud alerts (Paper Leak, Marks Anomaly, OMR Tamper) |
| **OmrSheet.jsx** | Interactive OMR interface with blockchain submission |
| **QRScanner.jsx** | QR code scanner with camera access for OMR verification |
| **ProtectedRoute.jsx** | Route wrapper with role-based authentication |

#### 4. Pages (`src/pages/`)

**Admin Pages:**
- `AdminDashboard.jsx` - System statistics & control panel
- `Vacancies.jsx` - Create/manage vacancies with blockchain recording
- `PaperManagement.jsx` - Generate 5 encrypted paper sets (A-E) with QR codes
- `AdminExamMerit.jsx` - Marks entry, OMR scanning, fraud detection

**Student Pages:**
- `StudentDashboard.jsx` - Student portal landing
- `CandidateApply.jsx` - Job application with blockchain verification
- `ExamStart.jsx` - Exam mode selection

**Public Pages:**
- `PublicMeritView.jsx` - Public merit list with blockchain explorer integration

### Routing Structure

```
Public Routes:
  ├── / (PublicMeritView)
  ├── /login (Login)
  ├── /signup (Signup)
  └── /merit (Merit List)

Admin Routes (Protected):
  ├── /admin/dashboard (AdminDashboard)
  ├── /admin/vacancies (Vacancies)
  ├── /admin/papers (PaperManagement)
  └── /admin/exam (AdminExamMerit)

Student Routes (Protected):
  ├── /candidate/dashboard (StudentDashboard)
  ├── /candidate/apply (CandidateApply)
  └── /exam/:applicationId/:vacancyId (ExamStart)
```

### Frontend Data Flow

**Application Submission:**
```
Student fills form → API request → Backend validation → 
Blockchain recording → Application saved → Test link enabled
```

**Exam Flow:**
```
Student selects mode → Paper fetched → OMR displayed → 
Answers filled → QR generated → Blockchain submission
```

**Merit List Publication:**
```
Admin records marks → Fraud analysis → Merit generated → 
Blockchain recording → Public viewing enabled
```

### Environment Variables

```env
VITE_API_BASE_URL=https://job-chain-backend-deploy.onrender.com/api
VITE_BLOCKCHAIN_NETWORK=polygon-amoy
```

---

## Backend Architecture

### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Spring Boot 3.x |
| **Language** | Java 17+ |
| **Database** | PostgreSQL |
| **Blockchain** | Web3j + Polygon Amoy Testnet |
| **Security** | Spring Security + JWT |
| **Build Tool** | Maven/Gradle |

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
└──────────────────────────┬──────────────────────────────┘
                           │
                    HTTP/REST API
                           │
┌──────────────────────────▼──────────────────────────────┐
│              Spring Boot Controllers                    │
│  (Auth, Vacancy, Application, Exam, Paper, Fraud)      │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│              Business Logic (Services)                  │
│  (Vacancy, Application, Exam, Paper, Fraud, Blockchain)│
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────▼────────────────┐      ┌────────────▼────────┐
│   PostgreSQL Database  │      │  Polygon Amoy Chain │
│   (Data Persistence)   │      │  (Immutable Records)│
└────────────────────────┘      └─────────────────────┘
```

### Controller Layer (`controller/`)

#### AuthController
- `POST /api/auth/signup` - Student registration
- `POST /api/auth/login` - JWT token generation

#### VacancyController
- `POST /api/vacancies` - Create vacancy (ADMIN)
- `GET /api/vacancies` - List vacancies
- `GET /api/vacancies/{id}` - Vacancy details

#### ApplicationController
- `POST /api/applications` - Submit application (STUDENT)
- `GET /api/applications/vacancy/{vacancyId}` - List applications (ADMIN)
- `GET /api/applications/{id}` - Application details

#### ExamController
- `POST /api/exam/record-score` - Record marks (ADMIN)
- `POST /api/exam/publish-merit` - Publish merit list (ADMIN)
- `GET /api/exam/merit` - View merit (PUBLIC)
- `GET /api/exam/verify` - Verify merit integrity
- `POST /api/exam/submit-omr` - Submit OMR (STUDENT)
- `POST /api/exam/record-omr` - Record OMR on blockchain (ADMIN)

#### PaperController
- `POST /api/paper/generate-sets` - Generate 5 paper sets A-E (ADMIN)
- `POST /api/paper/lock` - Lock papers for exam center (ADMIN)
- `GET /api/paper/{vacancyId}` - Fetch paper sets

#### FraudController
- `GET /api/fraud/{vacancyId}` - Get fraud alerts (ADMIN)
- `POST /api/fraud/analyze` - Run fraud detection (ADMIN)

### Service Layer (`service/`)

#### VacancyService
- Creates vacancy with blockchain transaction
- Stores metadata in PostgreSQL
- Links blockchain vacancy ID with database record

#### ApplicationService
- Submits applications with SHA-256 hash
- Records hash on blockchain
- Retrieves applications with LOB optimization
- Verifies integrity by recalculating hash

#### ExamService
- Records exam scores with blockchain proof
- Publishes ranked merit list
- Verifies merit integrity via hash comparison
- Handles OMR submission & validation

#### BlockchainService

Core smart contract interactions:

| Function | Purpose |
|----------|---------|
| `createVacancyAndReturnReceipt()` | Create vacancy on-chain |
| `logApplicationOnChain()` | Record application hash |
| `recordExamScoreOnChain()` | Store exam marks |
| `publishMeritOnChain()` | Publish merit list hash |
| `detectPaperLeakOnChain()` | Record fraud evidence |
| `distributePaperOnChain()` | Log paper distribution |
| `recordOMRScanOnChain()` | Store OMR verification |

#### PaperService
- Generates 5 unique paper sets (A-E)
- Creates SHA-256 hash for each set
- Records on blockchain
- Implements gas balance checks

#### FraudDetectionService

Two-pronged fraud detection:

1. **Paper Leak Detection** - Identifies >10 candidates with identical answer patterns
2. **Marks Anomaly Detection** - Flags when >30% score above 90

Records fraud alerts on blockchain for immutability.

### Configuration Layer (`config/`)

#### BlockchainConfig
- Initializes Web3j connection to Polygon Amoy RPC
- Manages wallet credentials
- Configures gas providers & transaction managers
- Loads smart contract instance

#### SecurityConfig
- JWT-based authentication with `JwtAuthenticationFilter`
- Role-based access control (ADMIN, STUDENT)
- CORS configuration
- BCrypt password encoding

### Backend Data Flow

**Vacancy Creation:**
```
ADMIN → VacancyController → VacancyService → BlockchainService → Smart Contract
                                    ↓
                            PostgreSQL (Metadata)
```

**Application Submission:**
```
STUDENT → ApplicationController → ApplicationService
                                        ↓
                            SHA-256 Hash Generation
                                        ↓
                            BlockchainService (Log Hash)
                                        ↓
                            PostgreSQL (Store Record)
```

**Exam Score Recording:**
```
ADMIN → ExamController → ExamService
                              ↓
                    BlockchainService (Record Marks)
                              ↓
                    PostgreSQL (Store Score)
```

**Merit List Publication:**
```
ExamService → Fetch Scores → Sort by Marks → Generate JSON
                                                  ↓
                                      SHA-256 Hash Calculation
                                                  ↓
                              BlockchainService (Publish Hash)
                                                  ↓
                              PostgreSQL + Fraud Detection
```

**Fraud Detection:**
```
FraudController → FraudDetectionService
                        ↓
            Analyze Answer Patterns / Marks Distribution
                        ↓
            BlockchainService (Record Evidence)
                        ↓
            PostgreSQL (Alert Storage)
```

### Database Schema

#### VacancyEntity
- Maps to blockchain vacancy via `blockchainVacancyId`
- Stores vacancy metadata and transaction hash

#### ApplicationEntity
- Contains candidate details and application JSON
- Stores `appHash` (SHA-256) and blockchain transaction hash
- Links to VacancyEntity via `vacancyId`

#### ExamScoreEntity
- Records marks with `markingJson` and `markingHash`
- Links to ApplicationEntity via `applicationId`

#### MeritListEntity
- Stores ranked merit list as JSON
- Contains `meritHash` and blockchain transaction hash

#### PaperSetEntity
- Stores paper set details (A-E)
- Contains `paperHash` and lock status
- Links to VacancyEntity

#### FraudAlertEntity
- Records fraud detection results
- Contains alert type, suspect count, and pattern hash

#### OMRRecordEntity
- Stores OMR answers and QR code data
- Contains `omrHash` for verification

### Blockchain Integration

#### Smart Contract Functions

| Function | Parameters | Purpose |
|----------|-----------|---------|
| `createVacancy()` | title, totalPosts, paperHash | Create vacancy record |
| `logApplication()` | vacancyId, appHash | Record application hash |
| `recordExamScore()` | vacancyId, marks, markingHash | Store exam marks |
| `publishMerit()` | vacancyId, meritHash | Publish merit list hash |
| `detectPaperLeak()` | vacancyId, suspectCount, patternHash | Record fraud evidence |
| `distributePaper()` | vacancyId, setId, paperHash | Log paper distribution |
| `recordOMRScan()` | omrHash, qrHash | Store OMR verification |

#### Transaction Management
- Uses `RawTransactionManager` for Amoy chain ID (80002)
- Static gas provider: 30 Gwei gas price, 1.5M gas limit
- All transactions return hash for tracking

### Error Handling & Logging

**Exception Strategy:**
- `IllegalArgumentException` - Validation failures
- `IllegalStateException` - Invalid operations
- `RuntimeException` - Blockchain/database errors
- Comprehensive logging via SLF4J at INFO, WARN, ERROR levels

### Performance Optimizations

| Optimization | Benefit |
|-------------|---------|
| LOB field exclusion in queries | Reduces memory usage for large JSON fields |
| Gas balance checks | Prevents failed blockchain transactions |
| `@Transactional` boundaries | Ensures atomicity |
| Read-only queries | Improves query performance |

---

## System Integration

### Key Features

✅ **Blockchain-Anchored Records** - All critical data hashed and stored on Polygon  
✅ **Paper Randomization** - 5 unique paper sets (A-E) to prevent cheating  
✅ **OMR Verification** - QR code-based tamper detection  
✅ **Fraud Detection** - Automated paper leak and marks anomaly detection  
✅ **Merit Integrity** - Hash-based verification of merit lists  
✅ **Role-Based Access** - ADMIN and STUDENT roles with JWT  
✅ **Audit Trail** - Immutable blockchain records for transparency  

### End-to-End Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    1. VACANCY CREATION                      │
│  Admin → Create Vacancy → Blockchain Record → Papers Ready  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   2. PAPER GENERATION                       │
│  Admin → Generate 5 Sets (A-E) → QR Codes → Lock Papers    │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   3. APPLICATION PHASE                      │
│  Student → Apply → Hash Recorded → Blockchain → Test Link  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    4. EXAM PHASE                            │
│  Student  →  Fill OMR  →   QR Scan  →  Submit               │    
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                5. MARKS RECORDING                           │
│  Admin → Enter Marks → Blockchain Record → Fraud Analysis  │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              6. MERIT LIST PUBLICATION                      │
│  Calculate → Hash → Blockchain → Public Viewing Enabled    │
└─────────────────────────────────────────────────────────────┘
```

---

## Security & Data Integrity

### Authentication Flow

1. User logs in → `AuthController` validates credentials
2. JWT token generated with username + role
3. `JwtAuthenticationFilter` intercepts subsequent requests
4. Token validated and user authenticated
5. Role-based access enforced via `@PreAuthorize`

### Data Integrity Mechanisms

| Mechanism | Implementation |
|-----------|----------------|
| **Hashing** | SHA-256 for applications, scores, merit lists |
| **Blockchain Anchoring** | Immutable storage on Polygon Amoy |
| **Verification Endpoints** | Recalculate and compare hashes |
| **QR Code Verification** | OMR tamper detection (only demo in backend) |
| **Paper Randomization** | 5 unique sets prevent answer sharing |

### Protected Endpoints

**Public Access:**
- `/auth/**`, `/vacancies/**`, `/exam/merit`, `/exam/verify`

**Student Only:**
- `/applications` (POST), `/exam/submit-omr`, `/candidate/**`

**Admin Only:**
- `/vacancies` (POST), `/applications/**` (GET), `/exam/record-*`, `/paper/**`, `/fraud/**`

---

## Deployment

### Environment Variables Required

```properties
# Blockchain Configuration
blockchain.rpc.url=https://rpc-amoy.polygon.technology
blockchain.private.key=<WALLET_PRIVATE_KEY>
blockchain.contract.address=<DEPLOYED_CONTRACT_ADDRESS>

# Database Configuration
spring.datasource.url=<POSTGRESQL_URL>
spring.datasource.username=<DB_USERNAME>
spring.datasource.password=<DB_PASSWORD>

# Security
jwt.secret=<JWT_SECRET_KEY>
```

### Prerequisites

- ✅ PostgreSQL database setup
- ✅ Polygon Amoy testnet wallet with MATIC tokens
- ✅ Deployed JobChainContract on Amoy testnet
- ✅ Java 17+ runtime
- ✅ Node.js 18+ (for frontend)

### API Documentation

**Base URL:**
```
https://job-chain-backend-deploy.onrender.com/api
```

**Authentication Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Future Enhancements

- 🚀 WebSocket for real-time fraud alerts
- 📊 Advanced analytics dashboard
- ⛓️ Multi-chain support (Ethereum, BSC)
- 📁 IPFS integration for document storage
- 🤖 ML-based fraud pattern recognition
- 📱 Mobile app for candidates and admins
- 🔔 Push notifications for merit list updates

---

**Developed with Spring Boot ❤️ & Blockchain Technology**

*Ensuring transparency and integrity in government recruitment.*
