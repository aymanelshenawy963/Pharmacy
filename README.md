# 💊 Pharmacy E-Commerce Platform

A production-oriented **online pharmacy** system built with **ASP.NET Core (.NET 10)** following **Clean Architecture**. It provides a complete e-commerce experience — product catalog, basket, Stripe payments, and order management — plus an **automated low-stock monitoring system** powered by Hangfire.

---

## ✨ Features

- 🛒 **Product Catalog** — browse, search & filter medicines by category, with prescription flags and multiple images
- 🧺 **Shopping Basket** — fast Redis-backed basket persisted per user
- 💳 **Secure Payments** — Stripe PaymentIntents with webhook-driven order updates
- 📦 **Order Management** — customers track orders; admins update status (Pending → Paid → Shipped → Delivered)
- ⭐ **Product Reviews** — authenticated customers rate and comment on products
- 🔔 **Low-Stock Monitoring** — a Hangfire job scans inventory every minute and emails admins when stock runs low, auto-resolving alerts when restocked
- 🔐 **Security** — JWT authentication, refresh tokens, role-based authorization, and OTP email confirmation

---

## 🏗️ Architecture

The solution follows **Clean Architecture** — dependencies point inward, and the core has zero external dependencies.

```
Pharmacy.API              → Controllers, Hangfire Jobs, Middleware, JWT pipeline
   ↓ depends on
Pharmacy.Infrastructure   → EF Core, Repositories, Services, Email, Stripe, Redis
   ↓ depends on
Pharmacy.Core             → Entities, Interfaces, DTOs, Enums, business contracts
```

- **Repository + Unit of Work** patterns for data access
- **AutoMapper** for entity ↔ DTO mapping
- **FluentValidation** for request validation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | ASP.NET Core (.NET 10), Entity Framework Core, ASP.NET Identity |
| **Frontend** | React, Axios |
| **Database** | SQL Server |
| **Cache** | Redis (basket storage) |
| **Background Jobs** | Hangfire (SQL Server storage) |
| **Payments** | Stripe.NET |
| **Email** | MailKit (SMTP) |
| **Auth** | JWT Bearer + Refresh Tokens |

---

## 🚀 Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server
- Redis
- Node.js (for the frontend)
- A [Stripe](https://dashboard.stripe.com) account (test mode)

### 1. Clone the repository

```bash
git clone https://github.com/aymanelshenawy963/Pharmacy.git
cd Pharmacy
```

### 2. Configure secrets

Sensitive values are stored in **User Secrets** (never committed). From the `Pharmacy.API` folder:

```bash
dotnet user-secrets set "StripeSettings:SecretKey"    "sk_test_your_key"
dotnet user-secrets set "StripeSettings:WebhookSecret" "whsec_your_secret"
dotnet user-secrets set "MailSettings:Password"        "your_app_password"
```

> `appsettings.json` ships with placeholder values for these keys.

### 3. Apply database migrations

```bash
dotnet ef database update --project Pharmacy.Infrastructure --startup-project Pharmacy.API
```

### 4. Run the API

```bash
cd Pharmacy.API
dotnet run
```

The API will be available at `https://localhost:7293`, with:
- **Swagger UI** → `https://localhost:7293/swagger`
- **Hangfire Dashboard** → `https://localhost:7293/hangfire`

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/Auth/register` | Register a new account |
| `POST` | `/Auth/login` | Login and receive a JWT |
| `GET`  | `/api/products` | List products |
| `POST` | `/api/baskets` | Create / update basket (Redis) |
| `POST` | `/api/payments` | Create Stripe PaymentIntent |
| `POST` | `/api/payments/webhook` | Stripe webhook receiver |
| `POST` | `/api/orders` | Place an order |
| `GET`  | `/api/orders/all` | List all orders (Admin) |
| `GET`  | `/api/notifications` | Low-stock notifications (Admin) |
| `PUT`  | `/api/notifications/{id}/read` | Mark notification as read (Admin) |

---

## 🔔 Low-Stock Monitoring Flow

```
Hangfire (every minute)
        ↓
Scan all products
        ↓
Stock ≤ 3 ?  ── yes ──► Create Active notification (no duplicates) ──► Email all admins
        │
        └── stock recovered ──► Auto-resolve the notification
```

Notifications follow a lifecycle: **Active → Read → Resolved**.

---

## 📄 License

This project was developed as a graduation project.
