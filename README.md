# 📚 Library Management System

A full-stack library management system built with **NestJS**, **React**, and **MongoDB**. This application allows users to borrow, reserve, return, and report lost books or eBooks, with real-time updates and an admin dashboard for managing library resources.

## ✨ Features

### 🧑‍💻 User Features

- 🔐 JWT Authentication (Login/Signup)
- 📖 Borrow, Return, Reserve Books & eBooks
- ❌ Mark books as Lost (with optional payment modal)
- 📅 View personal book activity history
- 📊 Real-time updates of profile and books
- 📂 Role-based access control (User/Admin)

### 🛠️ Admin Features

- 📚 Add, Edit, Delete Books and E-Books
- 📊 Dashboard with analytics and charts (e.g., borrowed, lost, reserved)
- 🧍 Manage users and their book activities

## 🖥️ Tech Stack

### Backend (NestJS)

- NestJS
- Mongoose + MongoDB
- JWT Authentication
- Cron Jobs (for automatic status cleanup)
- Role-Based Access Control
- Activity Tracking System

### Frontend (React)

- React + TypeScript
- Axios for API calls
- React Router for navigation
- TailwindCSS for styling
- Toastify for notifications
- Charts (e.g., Recharts or Chart.js)

## 📦 Folder Structure
