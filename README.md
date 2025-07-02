# WanderNest

**“Where Every Wander Finds a Nest”**

---

## 🚀 Project Overview

WanderNest is an end‑to‑end property listing platform, built to connect travelers with trusted hosts across India. Our goal is to streamline the discovery, booking, and management of unique stays—from beachfront cottages to urban lofts—through a robust, scalable web application.

---

## 🎯 Key Features

- **Dynamic Listings CRUD**
  - Create, Read, Update, Delete operations for hotel properties
  - Rich schema: title, description, image (with default & validation), price, location, country

- **Responsive, Dark‑Themed UI**
  - Mobile‑first design with Bootstrap 5
  - Glass‑morphism navbar that transitions to solid on scroll
  - Hero banner (desktop only) with overlay messaging
  - Card‑based listing grid (1 on mobile, 4 on desktop)

- **Templating & Routing**
  - Express.js router architecture
  - EJS templates with a shared layout and partials (navbar, footer)
  - Client‑side JS for enhanced interactivity (dynamic country dropdown, burger‑to‑X toggle)

- **Data Persistence**
  - MongoDB via Mongoose ODM
  - Environment‑agnostic connection string (local development)
  - Default image handling and schema setters for data integrity

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SHAIK-RAIYAN/WanderNest.git
   cd WanderNest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your database**

   By default, the app connects to:

   ```
   mongodb://127.0.0.1:27017/WanderNest
   ```

   To use a remote MongoDB Atlas cluster, set the environment variable `MONGO_URL` before starting the app.

4. **Run the app**
   ```bash
   npm run dev
   # or
   node index.js
   ```

5. **Browse the app**

   - Home / Listings: [http://localhost:3000/](http://localhost:3000/)
   - Add Listing: [http://localhost:3000/listings/new](http://localhost:3000/listings/new)
   - View Listing: [http://localhost:3000/listings/:id](http://localhost:3000/listings/:id)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feat/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature"
   ```
4. Push to GitHub:
   ```bash
   git push origin feat/your-feature
   ```
5. Open a pull request


---

## 📬 Contact

**Shaik Raiyan**

- 📧 shaikraiyan2005@example.com
