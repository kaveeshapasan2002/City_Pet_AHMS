# City_Pet_AHMS

# 🐾 Animal Hospital Management System

A full-stack web application built as a 2nd Year, 2nd Semester IT Project (IT2080 - ITP module) for a **real-world client** to digitally manage all operations of an animal hospital — including users, appointments, pet records, inventory, finances, and boarding services.

---

## 🚀 Project Overview

This system helps veterinary clinics and animal hospitals:

- Register and manage pet owners, veterinarians
- Maintain pet medical records, vaccination history, and reports
- Handle appointment bookings, approvals, and reminders
- Manage inventory and automate low-stock reorder processes
- Process invoices, payments, and track financial reports
- Allow pet owners to book boarding services and receive daily updates
- Improve decision-making using AI chatbot and analytics

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: (Optional to add) React.js (if used)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + MFA via Email/SMS
- **Styling**: TailwindCSS
- **Other Tools**: bcrypt, nodemailer, PDF generation

---

## 🧩 Key Features

### 👤 User Management
- Role-based login (Admin, Pet Owner, Veterinarian, Receptionist)
- Secure registration with OTP email/phone verification
- Multi-Factor Authentication (MFA)
- Account activation/deactivation
- Profile updates and login monitoring

### 🐶 Animal Record & Appointment
- Add/update/delete pet records & medical history
- Generate health reports as PDFs
- Appointment scheduling for checkups/vaccinations
- Vet can approve/reschedule/cancel appointments
- Email/SMS reminders

### 🏥 Pet Boarding Management
- Owners can book, update, or cancel boarding
- Dynamic price calculation based on services
- Admin manages status, availability, and daily logs

### 📦 Inventory Management
- CRUD operations for items
- FSN classification (Fast/Slow/Non-moving)
- Auto-reordering when stock is low
- Supplier notifications

### 💳 Finance Management
- Invoice and payment generation
- Purchase request approval
- Expense and revenue tracking
- Credit card payment validation

### 🤖 AI Features
- Chatbot for emergency pet care & FAQs
- Analytics dashboard with behavior trends and insights

---

## 🔐 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Session timeout and login lockout after failed attempts
- Authorization middleware and RBAC

---

## 🖼️ System Design

- High-Level Architecture Diagram ✅
- ER Diagram ✅
- Network Diagram ✅
- Normalized Database Schema ✅
- Test Cases for All Modules ✅

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/animal-hospital-system.git

# Backend Setup
cd backend
npm install
npm start

# (Optional) Frontend Setup
cd frontend
npm install
npm run dev
