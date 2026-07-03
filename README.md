<div align="center">

# 💊 Pharmacy E-Commerce Platform

**A full-stack online pharmacy built with ASP.NET Core (.NET 10) & React, following Clean Architecture.**

Product catalog · Stripe payments · Order management · Automated low-stock monitoring

<br/>

![.NET](https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![Hangfire](https://img.shields.io/badge/Hangfire-BE1E2D?style=for-the-badge)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Low-Stock Monitoring](#-low-stock-monitoring-system)
- [Security](#-security)
- [Roadmap](#-roadmap)

---

## 📖 Overview

The **Pharmacy E-Commerce Platform** digitizes pharmacy retail from end to end. Customers browse a medicine catalog, build a basket, pay securely through Stripe, and track their orders. Administrators manage the catalog, users, and orders — and are **automatically alerted when any product runs low on stock**, thanks to a recurring Hangfire background job.

The backend is designed around **Clean Architecture** principles for a maintainable, testable, and scalable codebase.

---

## ✨ Features

### 👤 Customer
- 🔍 Browse, search & filter products by category
- 💊 View product details, prescription requirements & reviews
- 🧺 Add items to a fast, Redis-backed basket
- 💳 Pay securely via Stripe
- 📦 Place orders and track their status
- ⭐ Rate and review purchased products

### 🛡️ Admin
- 📦 Manage products, categories & stock
- 👥 Manage users and roles (enable/disable accounts)
- 📋 View all orders and update their status
- 🔔 Receive & manage automated low-stock notifications

### ⚙️ System
- ⏱️ Hangfire job scans inventory **every minute**
- 📧 Emails **all admins** when stock is low
- ♻️ Auto-resolves alerts once stock recovers

---

## 🏗️ Architecture

Built on **Clean Architecture** — dependencies always point inward, and `Pharmacy.Core` has **zero** external dependencies.

```
┌─────────────────────────────────────────────────────────┐
│  Pharmacy.API                                            │
│  Controllers · Hangfire Jobs · Middleware · JWT Pipeline │
└───────────────────────────┬─────────────────────────────┘
                            │ depends on
┌───────────────────────────▼─────────────────────────────┐
│  Pharmacy.Infrastructure                                 │
│  EF Core · Repositories · Services · Email · Stripe·Redis│
└───────────────────────────┬─────────────────────────────┘
                            │ depends on
┌───────────────────────────▼─────────────────────────────┐
│  Pharmacy.Core                          (stable center)  │
│  Entities · Interfaces · DTOs · Enums · Contracts        │
└──────────────────────────────────────────────────────────┘
```

**Patterns used:** Repository · Unit of Work · Dependency Injection · DTO mapping (AutoMapper) · FluentValidation

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | ASP.NET Core (.NET 10), Entity Framework Core, ASP.NET Identity |
| **Frontend** | React, Vite, Axios, Tailwind CSS |
| **Database** | SQL Server |
| **Cache** | Redis (basket storage) |
| **Background Jobs** | Hangfire (SQL Server storage + dashboard) |
| **Payments** | Stripe.NET (PaymentIntents + Webhooks) |
| **Email** | MailKit (SMTP) |
| **Auth** | JWT Bearer + Refresh Tokens + OTP confirmation |
| **Validation** | FluentValidation |
| **Mapping** | AutoMapper |

---

## 📂 Project Structure

```
Pharmacy/
├── Pharmacy.API/              # Presentation layer
│   ├── Controllers/           # REST endpoints
│   ├── BackgroundJobs/        # Hangfire job definitions
│   └── Program.cs             # App bootstrap & DI
├── Pharmacy.Core/             # Domain layer
│   ├── Entities/              # Domain models
│   ├── Interfaces/            # Repository & service contracts
│   ├── DTO/                   # Data transfer objects
│   └── Mapping/               # AutoMapper profiles
├── Pharmacy.Infrastructure/   # Data & external services
│   ├── Data/                  # DbContext, configs, migrations
│   ├── Repositories/          # EF Core implementations
│   └── Services/              # Email, Payment, Auth, etc.
└── frontend/                  # React application
```

---

## 🚀 Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server
- Redis
- Node.js 18+
- A [Stripe](https://dashboard.stripe.com) account (test mode)

### 1. Clone

```bash
git clone https://github.com/aymanelshenawy963/Pharmacy.git
cd Pharmacy
```

### 2. Configure secrets — see [Configuration](#-configuration)

### 3. Apply migrations

```bash
dotnet ef database update --project Pharmacy.Infrastructure --startup-project Pharmacy.API
```

### 4. Run the backend

```bash
cd Pharmacy.API
dotnet run
```

| Service | URL |
|---------|-----|
| API | `https://localhost:7293` |
| Swagger UI | `https://localhost:7293/swagger` |
| Hangfire Dashboard | `https://localhost:7293/hangfire` |

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Configuration

Sensitive values live in **User Secrets** (never committed); `appsettings.json` ships with safe placeholders. From the `Pharmacy.API` folder:

```bash
# Stripe
dotnet user-secrets set "StripeSettings:SecretKey"     "sk_test_your_key"
dotnet user-secrets set "StripeSettings:PublishableKey" "pk_test_your_key"
dotnet user-secrets set "StripeSettings:WebhookSecret"  "whsec_your_secret"

# Email (Gmail app password if 2FA is on)
dotnet user-secrets set "MailSettings:Password"         "your_app_password"

# Hangfire dashboard credentials
dotnet user-secrets set "HangfireSettings:UserName"     "admin"
dotnet user-secrets set "HangfireSettings:Password"     "strong_password"
```

> 💡 To obtain your Stripe secret key: **Stripe Dashboard → Developers → API keys** (with Test mode enabled).

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/Auth/register` | Register a new account |
| `POST` | `/Auth/confirm-email` | Confirm email with OTP |
| `POST` | `/Auth/login` | Login → JWT + refresh token |
| `POST` | `/Auth/refresh-token` | Rotate access token |
| `POST` | `/Auth/forgot-password` | Send reset code |
| `POST` | `/Auth/reset-password` | Reset password |

### Catalog & Basket
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/products` | List / filter products |
| `POST` | `/api/baskets` | Create / update basket (Redis) |
| `GET`  | `/api/baskets/{id}` | Get basket |

### Payments & Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments` | Create / update Stripe PaymentIntent |
| `POST` | `/api/payments/webhook` | Stripe webhook receiver |
| `POST` | `/api/orders` | Place an order |
| `GET`  | `/api/orders` | Customer's own orders |
| `PUT`  | `/api/orders/{id}/cancel` | Cancel a pending order |
| `GET`  | `/api/orders/all` | **Admin** — all orders |
| `PUT`  | `/api/orders/{id}/status` | **Admin** — update status |

### Notifications *(Admin)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/notifications` | List low-stock notifications |
| `GET`  | `/api/notifications/count` | Unread count (badge) |
| `PUT`  | `/api/notifications/{id}/read` | Mark as read |

---

## 🔔 Low-Stock Monitoring System

An automated **Hangfire recurring job** keeps inventory under watch — the platform's flagship feature.

```
Hangfire Job (every minute)
        │
        ▼
  Scan all products
        │
   Stock ≤ 3 ?
        │
   ┌────┴─────────────────────────┐
   │ YES                          │ NO (recovered)
   ▼                              ▼
Active notification exists?    Active notification exists?
   │ no ──► Create notification    │ yes ──► Auto-resolve
   │        + Email all admins     │
   │ yes ─► do nothing (no dupes)  │
```

**Notification lifecycle:** `Active` → `Read` → `Resolved`

- ✅ **No duplicate alerts** — one active notification per product
- ✅ **Self-healing** — resolves automatically when stock is replenished
- ✅ **Separation of concerns** — the job only triggers; all logic lives in `NotificationService`

---

## 🔐 Security

- **JWT Authentication** — stateless bearer tokens, validated per request
- **Refresh Tokens** — rotating tokens for silent re-authentication
- **Role-Based Authorization** — `Admin` vs `Customer` gate every endpoint
- **Email Confirmation (OTP)** — accounts activate only after verification
- **Password Reset (OTP)** — secure forgotten-password flow
- **Account Lockout** — admins can disable compromised accounts

---

## 🗺️ Roadmap

- [ ] Real-time admin dashboard (SignalR)
- [ ] Sales analytics & reporting
- [ ] Delivery tracking
- [ ] Mobile application

---

<div align="center">

Developed as a **Graduation Project** 🎓

</div>
