# Prowider Mini Lead Distribution System

A full-stack lead distribution platform built using Next.js and MongoDB.

This project simulates a real-world lead allocation system where customer service enquiries are automatically distributed to providers based on business rules, fair allocation logic, quotas, and concurrency-safe backend processing.

---

# Features

## Customer Service Request
- Public customer form
- Create service enquiries
- Duplicate lead prevention

## Lead Allocation Engine
- Mandatory provider assignment
- Fair round-robin distribution
- Monthly quota enforcement
- Exactly 3 providers per lead
- Persistent allocation state

## Provider Dashboard
- View assigned leads
- Remaining quota tracking
- Real-time updates

## Webhook Simulation
- Reset provider quota
- Idempotency protection
- Simulated payment gateway webhook

## Concurrency Testing
- Generate multiple leads simultaneously
- Transaction-safe allocation logic

---

# Tech Stack

Frontend:
- Next.js

Backend:
- Next.js API Routes

Database:
- MongoDB Atlas
- Mongoose

---

# Project Structure

```bash
src/
│
├── app/
│   ├── api/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── seed/
│   │   └── webhook/
│   │
│   ├── dashboard/
│   ├── request-service/
│   └── test-tools/
│
├── lib/
│   ├── allocateLead.js
│   └── mongodb.js
│
└── models/
    ├── AllocationState.js
    ├── Lead.js
    ├── LeadAssignment.js
    ├── Provider.js
    └── WebhookEvent.js
```

---

# Business Rules

## Mandatory Providers

- Service 1 → Provider 1
- Service 2 → Provider 5
- Service 3 → Provider 1 and Provider 4

## Fair Allocation Pools

### Service 1
- Provider 2
- Provider 3
- Provider 4

### Service 2
- Provider 6
- Provider 7
- Provider 8

### Service 3
- Provider 2
- Provider 3
- Provider 5
- Provider 6
- Provider 7
- Provider 8

---

# Allocation Algorithm

1. Save lead in MongoDB
2. Assign mandatory providers
3. Select remaining providers using round-robin allocation
4. Respect provider monthly quota
5. Prevent duplicate provider assignment
6. Store allocation state in database

The allocation index is persisted in MongoDB to ensure fair distribution even after server restart.

---

# Concurrency Handling

MongoDB transactions and Mongoose sessions are used to ensure:
- atomic lead creation
- atomic provider assignment
- safe quota updates
- rollback on failure

This prevents inconsistent data during simultaneous lead creation requests.

---

# Webhook Idempotency

Webhook events are stored in the `WebhookEvent` collection using unique event IDs.

Before processing a webhook:
- system checks whether event already exists
- duplicate events are ignored

This prevents duplicate quota reset execution.

---

# API Routes

## Seed Providers
GET

```bash
/api/seed
```

## Create Lead
POST

```bash
/api/leads
```

## Dashboard Data
GET

```bash
/api/dashboard
```

## Reset Quota Webhook
POST

```bash
/api/webhook/reset-quota
```

---

# Pages

## Customer Form

```bash
/request-service
```

## Provider Dashboard

```bash
/dashboard
```

## Test Tools

```bash
/test-tools
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create Environment File

Create `.env.local`

```env
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
```

## 4. Run Project

```bash
npm run dev
```
http://localhost:3000/request-service
---
http://localhost:3000/test-tools

# Testing Features

## Duplicate Prevention
- Same phone + same service is blocked

## Fair Allocation
- Providers rotate fairly over time

## Quota Enforcement
- Providers stop receiving leads after quota reached

## Real-Time Dashboard
- Dashboard updates automatically every few seconds

## Webhook Idempotency
- Same webhook event cannot process twice

## Concurrency
- Generate multiple leads simultaneously from test panel

---

# Live Demo

Add your deployed Vercel URL here.

---
