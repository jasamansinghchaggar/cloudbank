# Project Title

**CloudBank: Highly Available Secure Banking Portal on AWS**

## Project Objective

Design and deploy a secure, scalable, and highly available banking web application on AWS. The application should remain accessible even if an EC2 instance fails, securely store customer information in a private database, and follow AWS networking best practices.

---

# Architecture

```text
                    Users
                      │
                      ▼
              Route 53 (Domain)
                      │
                      ▼
      Application Load Balancer (ALB)
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
   EC2 Instance 1            EC2 Instance 2
    (Next.js App)          (Next.js App)
         │                         │
         └────────────┬────────────┘
                      │
                Auto Scaling Group
                      │
                Private RDS MySQL
                      │
             Private Database Subnet
                      │
                NAT Gateway
                      │
             Internet Gateway (IGW)
```

---

# AWS Services Used

| Service                   | Purpose                                 |
| ------------------------- | --------------------------------------- |
| VPC                       | Isolated network                        |
| Public & Private Subnets  | Separate public and private resources   |
| Internet Gateway          | Internet access                         |
| NAT Gateway               | Outbound internet for private resources |
| EC2                       | Application servers                     |
| Auto Scaling Group        | Automatic scaling & self-healing        |
| Application Load Balancer | Traffic distribution                    |
| RDS MySQL                 | Banking database                        |
| Route 53                  | Custom domain routing                   |
| Security Groups           | Network security                        |
| IAM Roles                 | Secure AWS access (optional)            |
| S3 *(Optional)*           | Store bank logos, documents, statements |

---

# Network Design

## VPC

```
CIDR: 10.0.0.0/16
```

---

## Public Subnet

Contains

* Application Load Balancer
* NAT Gateway

```
10.0.1.0/24
```

---

## Private App Subnet

Contains

* EC2 Instance 1
* EC2 Instance 2

```
10.0.2.0/24
```

---

## Private DB Subnet

Contains

* Amazon RDS

```
10.0.3.0/24
```

---

# Security Groups

## ALB Security Group

Inbound

* HTTP (80)
* HTTPS (443)

Outbound

* All Traffic

---

## EC2 Security Group

Inbound

* HTTP from ALB
* SSH from Admin IP

Outbound

* MySQL
* Internet via NAT

---

## RDS Security Group

Inbound

* MySQL (3306) from EC2 SG only

No public access.

---

# Database Design

## customers

```
customer_id
name
email
password
account_number
balance
created_at
```

---

## transactions

```
transaction_id
sender_account
receiver_account
amount
status
timestamp
```

---

## admins

```
admin_id
username
password
role
```

---

# Banking Features

## Customer

* Login
* Dashboard
* View Profile
* Check Balance
* View Transaction History
* Transfer Money (simulation)
* Logout

---

## Admin

* Login
* View Customers
* View Transactions
* Block Customer (optional)
* Dashboard

---

# Application Flow

```
User

↓

Route53

↓

Application Load Balancer

↓

Healthy EC2 Instance

↓

RDS Database

↓

Response back to User
```

---

# High Availability Demonstration

During presentation

1. Open website.
2. Login as customer.
3. Show balance.
4. Refresh page.
5. Display Server ID/Hostname to show requests hitting different EC2 instances.
6. Terminate one EC2 instance.
7. Auto Scaling launches a replacement.
8. Refresh website.
9. Application continues working.

This is usually the most impressive part of the demo.

---

# Project Modules

### Module 1

Infrastructure Setup

* VPC
* Subnets
* IGW
* NAT Gateway
* Route Tables

---

### Module 2

Database

* Create RDS
* Database
* Tables

---

### Module 3

Application

* Banking UI
* Authentication
* CRUD APIs
* Database Integration

---

### Module 4

Deployment

* Launch Template
* EC2
* Security Groups

---

### Module 5

High Availability

* Target Group
* ALB
* Auto Scaling

---

### Module 6

DNS

* Route53
* Domain Mapping

---

# Suggested Tech Stack

Since you're already comfortable with modern web development, I'd recommend:

**Frontend**

* Next.js 15
* TypeScript
* Tailwind CSS

**Backend**

* Next.js API Routes

**Database**

* MySQL (Amazon RDS)

**ORM**

* Prisma

**Authentication**

* JWT + bcrypt

**Deployment**

* PM2 or Docker (optional) on Amazon EC2

This stack is more modern than a PHP application and better showcases your existing skills.

---

# Folder Structure

```text
cloudbank/
│
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── transfer/
│   ├── transactions/
│   └── profile/
│
├── app/api/
│   ├── auth/
│   ├── customer/
│   ├── transfer/
│   └── transactions/
│
├── prisma/
│   └── schema.prisma
│
├── lib/
│   ├── db.ts
│   └── auth.ts
│
├── middleware.ts
├── package.json
└── .env
```

---

## Why this project stands out

Unlike a generic 3-tier application, this project demonstrates a realistic financial application with production-style AWS architecture. It combines networking, compute, database, load balancing, scaling, and security into a cohesive solution while remaining achievable for a final-year student. The live demonstration of load balancing and auto-scaling, combined with a modern Next.js application, makes it significantly more distinctive than the typical AWS lab exercises.
