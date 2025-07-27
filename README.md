# 🌍 WanderNest

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-5.x-green)
![EJS](https://img.shields.io/badge/EJS-templating-yellow)
![Deployed on Render](https://img.shields.io/badge/Deploy%20Status-Active-blue)

> **"Where Every Wander Finds a Nest"**

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Live Demo](#live-demo)
3. [Key Features](#key-features)
4. [Tech Stack](#tech-stack)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Database Configuration](#database-configuration)
8. [Running Locally](#running-locally)
9. [Deployment](#deployment)
10. [Project Structure](#project-structure)
11. [Contributing](#contributing)
12. [Contact](#contact)

---

## 🚀 Project Overview

WanderNest is an innovative, full-stack property listing platform that bridges the gap between travelers and hosts across India. Designed to deliver a seamless experience, it empowers users to explore unique stays, manage property listings, and share authentic reviews. With a robust architecture and modern design, WanderNest combines functionality with elegance, making it the go-to solution for wanderers seeking their perfect nest.

---

## 🔗 Live Demo

Discover WanderNest in action:

👉 [https://wandernest-sffj.onrender.com](https://wandernest-sffj.onrender.com)

---

## 🎯 Key Features

- **Secure Authentication**: Effortless sign-in with local credentials, Google, or GitHub, powered by Passport.js.
- **Role-Based Authorization**: Granular access control, enabling admins and property owners to oversee listings and reviews with precision.
- **Property Listings**: Comprehensive CRUD operations for creating, viewing, updating, and deleting stays, enriched with detailed fields like title, price, and geolocation.
- **Review System**: Authenticated users can submit, modify, or remove reviews, with smart cleanup tied to listing deletions.
- **Image Management**: Seamless Cloudinary integration for uploading and managing property images, with fallback defaults for uninterrupted visuals.
- **Geolocation Precision**: Pinpoint property locations using OpenStreetMap’s Nominatim API, enhancing discoverability for travelers.
- **Elegant UI/UX**: A responsive, light-themed interface built with Bootstrap 5, featuring a glassmorphic navbar, a burger-to-X mobile toggle, and a captivating hero banner.

---

## 🛠️ Tech Stack

| Layer            | Technology                                         |
|------------------|----------------------------------------------------|
| **Frontend**     | Bootstrap 5, HTML5, CSS3, EJS Templating           |
| **Backend**      | Node.js, Express.js                                |
| **Database**     | MongoDB Atlas, Mongoose ODM                        |
| **Authentication**| Passport.js (Local, Google, GitHub)               |
| **File Uploads** | Multer, Cloudinary                                 |
| **Geocoding**    | OpenStreetMap Nominatim API                        |
| **Hosting**      | Render.com                                         |

---

## ⚙️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SHAIK-RAIYAN/WanderNest.git
   cd WanderNest
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Application Secrets
SESSION_SECRET=your-session-secret
ADMIN_EMAIL=your-admin-email

# MongoDB Configuration
MONGO_URL=mongodb://127.0.0.1:27017/WanderNest
# For Atlas, replace with:
# MONGO_URL=your_mongodb_atlas_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

> **Note**: Add `.env` to your `.gitignore` to keep sensitive data secure.

---

## 🗄️ Database Configuration

- **Local MongoDB**: Ensure MongoDB is running locally with `mongod`.
- **MongoDB Atlas**:
  - Set up a cluster at [MongoDB Atlas](https://cloud.mongodb.com).
  - Whitelist your IP address.
  - Update the `MONGO_URL` in your `.env` file with the Atlas connection string.

---

## 🏃 Running Locally

Launch the application:

```bash
# Development mode with hot reload
npm run dev

# Production mode
node index.js
```

Navigate to `http://localhost:3000` in your browser.

---

## ☁️ Deployment

1. Push your code to GitHub.
2. Create a **Web Service** on [Render.com](https://render.com):
   - Link your GitHub repository.
   - Configure build and start commands:
     ```bash
     Build: npm install
     Start: node index.js
     ```
   - Input environment variables in the Render dashboard.
3. Deploy and access your live platform.

---

## 📁 Project Structure

```
WanderNest/
├── cloudConfig/        # Cloudinary configuration
├── controllers/        # Route handling logic
├── init/               # Initial setup and sample data
├── middleware/         # Authentication and validation logic
├── models/             # Mongoose schemas for data modeling
├── routes/             # Express route definitions
├── seedDB/             # Database seeding utilities
├── utils/              # Helper functions and custom error handling
├── views/              # EJS templates for dynamic rendering
├── public/             # Static assets (CSS, JS, images)
├── .env                # Environment variables (excluded from git)
├── index.js            # Application entry point
└── package.json        # Project dependencies and scripts
```

---

## 🤝 Contributing

We welcome contributions to enhance WanderNest! Follow these steps:

1. **Fork** the repository.
2. Create a **feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: describe your enhancement"
   ```
4. Push and submit a **Pull Request**.

---

## 📬 Contact

**Shaik Raiyan**

- GitHub: [@SHAIK-RAIYAN](https://github.com/SHAIK-RAIYAN)
- Email: [shaikraiyan2005@gmail.com](mailto:shaikraiyan2005@gmail.com)

---
⭐ **Show Some Love**  
If you enjoy this project, drop a star ⭐ on the repo and share your thoughts! 🚀

> *Crafted with passion ⚡ by SHAIK RAIYAN*
