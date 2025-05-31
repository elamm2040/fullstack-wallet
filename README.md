# Fullstack Wallet

This project implements a complete fullstack solution composed of three main parts:

- `soap-service` → Laravel 12 (SOAP)
- `rest-api` → Lumen (REST API)
- `frontend` → React + Vite

## 🚀 Prerequisites

Make sure you have installed:

- PHP >= 8.2
- Composer
- Node.js + NPM
- MySQL (or MariaDB)
- XAMPP or Laragon (Laragon recommended)
- Git

---

## 📁 Project Structure

```bash
fullstack-wallet/
├── frontend        # ReactJS + Vite
├── rest-api        # REST API using Lumen
├── soap-service    # Main backend using Laravel 12 (SOAP)
├── .gitignore
```

---

## 🔧 Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/elamm2040/fullstack-wallet.git
cd fullstack-wallet
```

2. **Install dependencies for each module**

### Laravel (SOAP)

```bash
cd soap-service
composer install
cp .env.example .env
php artisan key:generate
```

### Lumen (REST API)

```bash
cd ../rest-api
composer install
cp .env.example .env
```

### ReactJS (Frontend)

```bash
cd ../frontend
npm install
```

---

## 🛠 .env Configuration

### Laravel and Lumen

Edit the `.env` files in both `soap-service` and `rest-api` directories and ensure database connection matches your environment (example for XAMPP):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wallet_db
DB_USERNAME=root
DB_PASSWORD=
```

### Email (Log Only)

Emails are logged for development purposes. Use this config in `soap-service/.env`:

```env
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

Check logs at:

```
soap-service/storage/logs/laravel.log
```

---

## 🗃 Create Database

From inside `soap-service`, run the custom Laravel command:

```bash
php artisan db:verify
```

This will create the `wallet_db` database if it doesn't exist.

---

## 🧱 Run Migrations and Seeders

From `soap-service`:

```bash
php artisan migrate
php artisan db:seed # (optional for testing)
```

> If seeders are not executed, register a new client using the React frontend.

---

## ▶️ Start Servers

Open three terminal windows/tabs:

### Laravel SOAP

```bash
cd soap-service
php artisan serve --port=8000
```

### Lumen REST API

```bash
cd rest-api
php -S localhost:8001 -t public
```

### React Frontend

```bash
cd frontend
npm run dev
```

---

## ✅ System Flow

1. Client registration via frontend (`/new` route)
2. Login → validates via Lumen, which contacts SOAP (Laravel)
3. Dashboard → shows client data, wallet balance, and actions:
   - Check balance
   - Recharge balance
   - Initiate payment
   - Confirm payment

> Lumen serves as the bridge between React and SOAP (Laravel).

---

## 🧠 Technical Notes

These are the logical or structural decisions made during development:

- **Missing Password in Client Migration**: Initially, the password field was not included in the clients table. This was added and hashed before saving.
- **No instruction for login or password handling**: Assumed and implemented user login functionality as a usability plus.
- **Auto wallet creation**: On client registration, a wallet is automatically created with balance 0 to avoid inconsistencies or errors when fetching balance.
- **Token email not sent**: Emails are logged due to development stage setup using `MAIL_MAILER=log`. This can be updated for production SMTP settings.
- **JWT Authentication in Lumen**: Implemented JWT in Lumen for secure authentication even though not explicitly required.
- **Handling multiple payment tokens**: For confirm payment, both `token` and `amount` are requested again to allow identifying which initiated payment is being confirmed.