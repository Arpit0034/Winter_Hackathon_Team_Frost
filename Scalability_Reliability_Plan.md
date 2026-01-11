# JobChain: Scalability & Reliability Plan

## Summary

This document outlines the comprehensive strategy to scale JobChain from a prototype to a production-ready system capable of handling millions of users during peak recruitment seasons while maintaining 99.9% uptime and ensuring data integrity through blockchain verification.

**Target Performance Metrics:**
- **User Capacity**: Support 1M+ concurrent users during exam periods
- **Application Volume**: Process 500K+ applications per vacancy
- **System Availability**: 99.9% uptime (8.76 hours downtime/year)
- **Response Time**: < 500ms API response (p95), < 2s for blockchain operations
- **Database Performance**: Handle 10K+ queries per second
- **Fraud Detection**: Real-time analysis within 5 seconds post-merit publication

---

## 1. Handling Increased User Load

### 1.1 Current System Bottlenecks

**Identified Issues:**
- Single Spring Boot instance limits concurrent requests to ~1,000 users
- Synchronous blockchain transactions block API threads
- N+1 query problem in ApplicationController (database hit per application)
- LOB (Large Object) fields loaded unnecessarily, consuming memory
- No request queuing for peak load management
- Single database handles both read and write operations

**Impact Analysis:**
During a typical government exam with 100K applicants:
- Application submission: 100K requests in 1-2 hour window
- Merit list viewing: 500K+ requests in first 15 minutes after publication
- Current system would crash within 5 minutes of peak load

### 1.2 Horizontal Scaling Strategy

**Phase 1: Load Balancing **

**Infrastructure Setup:**
- Deploy 5-10 application server instances behind load balancer
- Use AWS Application Load Balancer (ALB) or Nginx
- Implement session-less architecture (JWT tokens, no server-side sessions)
- Enable auto-scaling based on CPU and memory metrics

**Configuration:**
- Minimum instances: 3 (across different availability zones)
- Maximum instances: 20 (cost-controlled scaling)
- Scale-up trigger: CPU > 70% for 5 minutes
- Scale-down trigger: CPU < 30% for 15 minutes
- Health check endpoint: `/actuator/health` (30-second intervals)

**Expected Improvement:**
- Concurrent user capacity: 1,000 → 15,000+ users
- Zero downtime deployments using rolling updates
- Geographic distribution for reduced latency

### 1.3 Microservices Architecture 

**Service Decomposition Rationale:**

The monolithic architecture creates coupling between high-traffic public endpoints (vacancy viewing, merit lists) and admin-only operations (fraud detection, score recording). This leads to resource contention.

**Proposed Microservices:**

1. **Auth Service** (Independent scaling)
   - Handles authentication and JWT generation
   - Minimal resource requirements
   - Can cache user credentials in Redis
   - Scale: 2-3 instances

2. **Vacancy Service** (High read, low write)
   - Vacancy CRUD operations
   - Heavy caching layer (Redis)
   - Read-only replicas
   - Scale: 3-5 instances

3. **Application Service** (Heavy write operations)
   - Application submission and retrieval
   - Async blockchain transaction processing
   - Message queue for blockchain operations
   - Scale: 10-15 instances during application windows

4. **Exam Service** (Moderate load, CPU intensive)
   - Score recording, merit list generation
   - Fraud detection algorithms
   - Background processing for merit calculations
   - Scale: 5-8 instances

5. **Blockchain Service** (Specialized, low concurrency)
   - Dedicated service for Web3 operations
   - Connection pooling to RPC endpoints
   - Transaction queue management
   - Gas price optimization
   - Scale: 2-3 instances with high memory

6. **Fraud Detection Service** (Background processing)
   - Async analysis triggered by events
   - ML model execution for pattern detection
   - Batch processing capabilities
   - Scale: 2-4 instances

**Communication:**
- Synchronous: REST APIs via API Gateway
- Asynchronous: RabbitMQ/Kafka for events
- Service discovery: Kubernetes DNS or Consul

**Benefits:**
- Independent scaling per service
- Isolated failures (one service down doesn't crash everything)
- Technology flexibility (can use Python for ML in fraud detection)
- Team autonomy (separate teams per service)

### 1.4 API Gateway Implementation

**Purpose:**
Centralized entry point for all client requests with intelligent routing, rate limiting, and caching.

**Features to Implement:**

**Rate Limiting (Prevent abuse):**
- Public endpoints: 100 requests/minute per IP
- Authenticated users: 500 requests/minute per user
- Admin endpoints: 1000 requests/minute
- Burst allowance: 150% of limit for 10 seconds

**Request Caching:**
- Vacancy list: Cache for 5 minutes
- Merit lists: Cache for 1 hour (immutable after publication)
- Application status: Cache for 30 seconds
- Cache invalidation on updates

**Circuit Breaker Pattern:**
- If blockchain service fails 10 times in 1 minute, open circuit
- Return cached responses or degraded service
- Retry after 30 seconds (half-open state)

**Benefits:**
- Protects backend services from overwhelming traffic
- Reduces load on blockchain service
- Graceful degradation during partial outages

---

## 2. Performance Optimization

### 2.1 Database Optimization

**Critical Issues:**

**Problem 1: N+1 Query in ApplicationController**
```
Current: For 1000 applications, executes 1001 database queries
- 1 query to fetch applications
- 1000 queries to fetch exam scores (one per application)

Impact: 10+ seconds response time for large vacancy lists
```

**Solution: Batch Fetching**
- Create custom repository method to join applications with exam scores
- Use single query with LEFT JOIN
- Expected improvement: 10s → 0.5s for 1000 applications

**Problem 2: LOB Fields Loaded Unnecessarily**
```
Current: app_json, omr_answer_json loaded in every query
- Each application: ~5KB of JSON data
- 1000 applications: 5MB transferred unnecessarily
- Memory pressure on application servers

Impact: Slow queries, high memory consumption
```

**Solution: Projection Queries**
- Already partially implemented with `findApplicationsByVacancyIdWithoutLob`
- Extend to all list operations
- Load LOB fields only for individual record retrieval
- Expected improvement: 70% reduction in memory usage

**Problem 3: Missing Database Indexes**

**Current State:**
- Only primary keys indexed
- Full table scans on frequently queried columns

**Critical Indexes to Add:**
```sql
-- Application queries (most frequent)
CREATE INDEX idx_app_vacancy_created ON applications(vacancy_id, created_at DESC);
CREATE INDEX idx_app_status ON applications(status) WHERE status IN ('SUBMITTED', 'PENDING');

-- Exam scores
CREATE INDEX idx_score_vacancy_marks ON exam_scores(vacancy_id, marks DESC);
CREATE INDEX idx_score_app_id ON exam_scores(application_id);

-- Fraud detection
CREATE INDEX idx_score_marking_hash ON exam_scores(vacancy_id, marking_hash);

-- Merit lists
CREATE INDEX idx_merit_vacancy ON merit_lists(vacancy_id, created_at DESC);

-- Paper sets
CREATE INDEX idx_paper_vacancy ON paper_sets(vacancy_id, set_id);
```

**Expected Improvements:**
- Query time reduction: 60-90%
- Enables index-only scans for common queries
- Supports efficient sorting and filtering

### 2.2 Read/Write Database Separation

**Architecture:**

**Primary Database (Write Master):**
- Handles all INSERT, UPDATE, DELETE operations
- Single source of truth
- PostgreSQL 14+ with high IOPS storage
- Instance: db.r5.xlarge (4 vCPU, 32GB RAM)

**Read Replicas (3 replicas):**
- Replica 1: Same region (primary reads)
- Replica 2: Same region (backup)
- Replica 3: Different region (disaster recovery, geo-distributed users)
- Asynchronous replication with < 1 second lag
- All SELECT queries route here

**Implementation in Spring:**
- Use AbstractRoutingDataSource
- Route based on @Transactional(readOnly=true) annotation
- Automatic failover to primary if replica unavailable

**Expected Benefits:**
- 10x increase in read capacity
- Write operations unaffected by read load
- Geographic distribution reduces latency for users

### 2.3 Caching Strategy

**Multi-Layer Caching:**

**Layer 1: Redis Cache (Distributed, In-Memory)**

**Cache Definitions:**
- **Vacancies**: 1 hour TTL (rarely change)
- **Merit Lists**: 30 minutes TTL (immutable after publication)
- **Application Status**: 5 minutes TTL (updated infrequently)
- **Fraud Alerts**: 15 minutes TTL (near real-time acceptable)
- **JWT Blacklist**: Until token expiry (for logout functionality)

**Cache Warming:**
On application startup, preload:
- All active vacancies
- Recently published merit lists (last 30 days)
- Reduces cold start impact

**Cache Invalidation:**
- Vacancy created/updated → Invalidate vacancy cache
- Merit published → Invalidate merit list cache
- Application submitted → Invalidate application count cache
- Use Redis Pub/Sub for cache invalidation across instances

**Layer 2: CDN for Static Content**
- Frontend assets (React build)
- Document templates, images
- Merit list PDFs (once generated)
- CloudFront or CloudFlare
- 90% reduction in server load for static assets

**Expected Improvements:**
- Cache hit ratio: 80%+
- Response time: 500ms → 50ms for cached data
- Database load reduction: 60%

### 2.4 Asynchronous Blockchain Processing

**Current Problem:**
Synchronous blockchain transactions block API threads for 3-10 seconds per operation. During peak application submission (1000/minute), this causes:
- Thread pool exhaustion
- API timeouts
- Poor user experience

**Solution: Message Queue Architecture**

**Implementation:**
1. API immediately returns acknowledgment with application ID
2. Blockchain transaction queued in RabbitMQ/AWS SQS
3. Dedicated blockchain worker processes queue
4. Webhook/WebSocket notifies user of blockchain confirmation
5. Database updated asynchronously with transaction hash

**Benefits:**
- API response time: 5s → 200ms
- Handles transaction spikes without blocking
- Retry logic for failed blockchain transactions
- User gets immediate feedback, blockchain confirmation later

**Queue Configuration:**
- Queue capacity: 10,000 pending transactions
- Workers: 5 concurrent workers
- Retry policy: 3 attempts with exponential backoff
- Dead letter queue for permanently failed transactions

---

## 3. Failures and Recovery

### 3.1 Database Failure Scenarios

**Scenario 1: Primary Database Failure**

**Detection:**
- Health checks fail (3 consecutive failures within 15 seconds)
- Connection pool cannot acquire connections
- Database monitoring alerts trigger

**Automatic Recovery:**
1. Promote read replica to primary (30-60 seconds)
2. Update application configuration to point to new primary
3. Restart application instances with new configuration
4. Former replica becomes read-only until original primary recovers

**Data Loss Risk:** 
- < 1 second of data (replication lag)
- Acceptable for read-heavy operations
- Critical writes can use synchronous replication

**Recovery Time Objective (RTO):** 2-3 minutes
**Recovery Point Objective (RPO):** < 1 second

**Scenario 2: Read Replica Failure**

**Detection:**
- Replica health check fails
- Automatic removal from load balancer pool

**Automatic Recovery:**
- Traffic routes to remaining healthy replicas
- No service interruption (degraded performance possible)
- Alert operations team for manual investigation
- Replica automatically rejoins when healthy

**Impact:** Minimal (increased load on remaining replicas)

**Scenario 3: Complete Database Cluster Failure**

**Recovery Process:**
1. Restore from latest automated backup (hourly snapshots)
2. Replay transaction logs to minimize data loss
3. Validate data integrity
4. Bring services back online

**RTO:** 1-2 hours
**RPO:** < 1 hour (last backup)

**Preventive Measures:**
- Daily automated backups retained for 30 days
- Weekly backups retained for 1 year
- Point-in-time recovery enabled
- Cross-region backup replication

### 3.2 Application Server Failures

**Scenario 1: Single Instance Failure**

**Detection:**
- Load balancer health check fails (2 consecutive failures)
- Instance marked unhealthy, removed from rotation

**Automatic Recovery:**
- Load balancer redirects traffic to healthy instances
- Auto-scaling group launches replacement instance
- New instance registers with load balancer when healthy

**Impact:** None (stateless architecture allows seamless failover)
**RTO:** 2-3 minutes (instance launch time)

**Scenario 2: Entire Availability Zone Failure**

**Detection:**
- Multiple instance failures simultaneously
- AWS infrastructure event notification

**Automatic Recovery:**
- Instances in other availability zones handle traffic
- Auto-scaling increases capacity in healthy zones
- New instances launched in unaffected zones

**Impact:** Temporary performance degradation (30-50% capacity loss)
**RTO:** 5-10 minutes (time to scale up)

**Preventive Architecture:**
- Minimum 3 availability zones
- Equal distribution of instances across zones
- Cross-zone load balancing enabled

### 3.3 Blockchain Service Failures

**Scenario 1: RPC Node Unavailable**

**Current Risk:**
Single point of failure - if Polygon Amoy RPC fails, all blockchain operations fail.

**Solution: Multi-Provider Failover**

**Implementation:**
- Primary: Infura Polygon RPC
- Backup 1: Alchemy Polygon RPC
- Backup 2: QuickNode Polygon RPC
- Automatic failover on connection timeout or error rate > 10%

**Detection:**
- Connection timeout (5 seconds)
- HTTP 5xx errors
- Transaction submission failures

**Recovery Logic:**
1. Attempt transaction on primary RPC
2. If failure, try backup 1
3. If failure, try backup 2
4. If all fail, queue transaction for retry
5. Alert operations team

**RTO:** < 5 seconds (immediate failover)

**Scenario 2: Transaction Failure (Gas Issues)**

**Common Causes:**
- Insufficient gas price (transaction stuck)
- Out of gas (transaction reverted)
- Nonce conflicts (concurrent transactions)

**Recovery Strategy:**

**Gas Price Management:**
- Monitor network gas prices in real-time
- Dynamic gas price adjustment (current + 20%)
- Maximum gas price limit to prevent excessive costs

**Transaction Monitoring:**
- Track pending transactions
- If stuck for > 5 minutes, resubmit with higher gas
- Maximum 3 retry attempts

**Nonce Management:**
- Centralized nonce tracking per blockchain account
- Lock mechanism to prevent concurrent nonce usage
- Automatic nonce recovery on failure

**Scenario 3: Smart Contract Failure**

**Causes:**
- Contract bug discovered
- Contract upgrade needed

**Recovery Process:**
1. Deploy new contract version
2. Update application configuration with new contract address
3. Rolling deployment to update instances
4. Maintain backward compatibility for pending transactions

**Preventive Measures:**
- Comprehensive contract testing before deployment
- Audit by security firm
- Upgradeable contract pattern (if applicable)
- Emergency pause functionality in contract

### 3.4 System-Wide Disaster Recovery

**Disaster Scenarios:**
- Complete AWS region failure
- Catastrophic data corruption
- Security breach requiring system rebuild

**Recovery Plan:**

**Backup Strategy:**
- **Database**: Automated daily backups to S3, cross-region replication
- **Blockchain Data**: Immutable on-chain, no backup needed
- **Application Configuration**: Version controlled in Git
- **Environment Variables**: Encrypted in AWS Secrets Manager

**Recovery Steps:**
1. Spin up infrastructure in backup region (Terraform/CloudFormation)
2. Restore database from most recent backup
3. Deploy application from Git repository
4. Update DNS to point to new region
5. Validate system functionality
6. Monitor for issues

**RTO (Complete Disaster):** 4-6 hours
**RPO:** < 24 hours

**Regular Testing:**
- Quarterly disaster recovery drills
- Automated recovery testing in staging environment
- Documented runbooks for all failure scenarios

---

## 4. Monitoring & Observability

### 4.1 Application Monitoring

**Metrics to Track:**
- **Performance**: API response times (p50, p95, p99)
- **Throughput**: Requests per second, by endpoint
- **Error Rates**: 4xx and 5xx errors, by endpoint
- **Resource Usage**: CPU, memory, disk I/O per instance
- **Database**: Query execution times, connection pool utilization
- **Cache**: Hit ratio, eviction rate
- **Blockchain**: Transaction success rate, average confirmation time

**Tools:**
- Application: Spring Boot Actuator + Micrometer
- Infrastructure: AWS CloudWatch or Datadog
- APM: New Relic or Dynatrace
- Logs: ELK Stack (Elasticsearch, Logstash, Kibana)

### 4.2 Alerting Strategy

**Critical Alerts (Immediate Response):**
- API error rate > 5%
- Database connection failures
- Application instances down > 50%
- Blockchain transaction failure rate > 20%
- Response time p95 > 5 seconds

**Warning Alerts (Monitor Closely):**
- CPU usage > 80% for > 10 minutes
- Memory usage > 85%
- Cache hit ratio < 60%
- Disk space < 20%

**Informational:**
- Successful deployments
- Auto-scaling events
- Backup completion status

**Alert Channels:**
- Critical: PagerDuty (phone + SMS)
- Warning: Slack #alerts channel
- Info: Email + Slack

### 4.3 Health Checks

**Application Health Check:**
```
Endpoint: /actuator/health
Checks:
- Database connectivity
- Redis connectivity
- Blockchain RPC accessibility
- Disk space availability
- Thread pool utilization
Returns: UP/DOWN status
```

**Deep Health Check (Admin Only):**
```
Endpoint: /actuator/health/detailed
Additional Checks:
- Blockchain account balance
- Message queue connectivity
- External API dependencies
- Transaction processing lag
```

---
---

## 5. Security Measures

**Application Security:**
- WAF (Web Application Firewall) to prevent common attacks
- Rate limiting per IP and user
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- CSRF protection

**Data Security:**
- Encryption at rest (database, S3)
- Encryption in transit (TLS 1.3)
- Secrets management (AWS Secrets Manager)
- Regular security audits and penetration testing

**Blockchain Security:**
- Private key stored in AWS KMS or HSM
- Transaction signing on secure backend only
- Gas limit checks to prevent excessive costs
- Smart contract audit by third party

---

## Conclusion

This scalability and reliability plan transforms JobChain from a prototype into an enterprise-grade system capable of handling millions of users with high availability, performance, and security. The phased approach allows for incremental improvement while maintaining system stability throughout the transition.
