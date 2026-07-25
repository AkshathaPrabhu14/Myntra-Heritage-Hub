# 🪔 Myntra Heritage-Hub

> **Celebrating India's Rich Textile Legacy, Regional Artisans, and Cultural Attire.**

Myntra Heritage-Hub is a full-stack e-commerce web platform designed to promote and showcase India's traditional clothing, handloom weaves, and regional fashion heritage. It seamlessly connects lovers of ethnic fashion with authentic regional craftsmanship through interactive exploration, a gamified Heritage Passport, AI-assisted outfit planning, and a modern shopping experience.

---

## 🌟 Key Features

### 🗺️ 1. Interactive India Heritage Map
- Visual map of Indian states celebrating regional textile traditions (e.g., Kanjeevaram from Tamil Nadu, Banarasi from Uttar Pradesh, Phulkari from Punjab, Pashmina from Jammu & Kashmir).
- Direct navigation from state boundaries to curated regional product showcases.

### 🛂 2. Heritage Passport & Gamified Rewards
- Interactive digital passport tracking cultural exploration across Indian states.
- Collect unique digital stamps and achievement badges upon visiting state heritage collections and placing orders.
- Gamified experience that promotes awareness of traditional Indian handlooms and artisan crafts.

### 👗 3. AI Outfit Planner
- Interactive occasion-based ethnic outfit recommendation engine.
- Generates curated ensembles tailored for Weddings, Festivals, Formal Gatherings, and Casual Ethnic wear.
- Add generated outfits directly to cart with one click.

### 🛍️ 4. Full E-Commerce Shopping Suite
- **Advanced Filtering & Search**: Filter products by State, Category, Occasion, Price Range, Gender, and Ratings.
- **Product Details & Storytelling**: Deep-dive into artisan origins, fabric specifications, heritage history, size selectors, and customer reviews.
- **Shopping Cart & Wishlist**: Real-time price breakdown, discount calculation, and seamless item management.
- **Checkout & Order Management**: Comprehensive shipping forms, mock payment processing, instant order summaries, and history tracking.

### 🛡️ 5. Admin Dashboard & CMS
- **Metrics & Analytics**: View store metrics including total revenue, order counts, product stats, and state coverage.
- **Product Management**: Add, update, and remove products with real-time Cloudinary image upload integration.
- **Role-Based Access Control**: Secure administrator routing and protected API endpoints.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS (Custom Myntra design tokens)
- **Icons & Animation**: Lucide React, Framer Motion
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt.js
- **File Uploads**: Cloudinary + Multer

### **Deployment**
- **Backend API**: Render
- **Frontend App**: Vercel

---

## 📁 Repository Structure

```
Myntra/
├── backend/                   # Express API Server
│   ├── config/                # Database & Cloudinary config
│   ├── controllers/           # Auth, Order, Passport, Product controllers
│   ├── middleware/            # Auth JWT & Admin guard middleware
│   ├── models/                # User, Product, Order Mongoose schemas
│   ├── routes/                # Express API endpoints
│   ├── server.js              # Server entry point
│   └── package.json
│
└── frontend/                  # React + Vite Client
    ├── public/                # Favicon, SVGs, static assets
    ├── src/
    │   ├── assets/            # Graphics & media
    │   ├── components/        # Header, Footer, FilterPanel, IndiaMap, ProductCard
    │   ├── context/           # AuthContext, CartContext, WishlistContext
    │   ├── pages/             # Home, HeritageHub, StatePage, ProductDetails, Cart, Checkout, Passport, Admin pages
    │   ├── services/          # Axios API configuration & endpoints
    │   ├── utils/             # Helper utilities & state mapping
    │   ├── App.jsx            # Main app router
    │   └── main.jsx           # React DOM root
    ├── index.html             # Application HTML shell
    ├── tailwind.config.js     # Custom Tailwind styling & theme rules
    └── package.json
```

---

## ⚙️ Environment Variables

### Backend (`Myntra/backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server Port | `5000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://<user>:<password>@cluster.mongodb.net/myntra` |
| `JWT_SECRET` | Secret key for signing JWTs | `supersecretjwtkey123` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |

### Frontend (`Myntra/frontend/.env.production`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Production Backend API Endpoint | `https://myntra-heritage-backend.onrender.com/api` |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/AkshathaPrabhu14/Myntra-Heritage-Hub.git
cd Myntra-Heritage-Hub
```

### 2. Backend Setup
```bash
cd Myntra/backend
npm install
```

Create a `.env` file in `Myntra/backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
# Server runs at http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Myntra/frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Login user & return JWT token
- `POST /api/auth/admin/register` — Register admin account
- `POST /api/auth/admin/login` — Authenticate admin user
- `GET /api/auth/me` — Fetch current user details

### Products (`/api/products`)
- `GET /api/products` — Get products (supports query parameters for filter, search, state)
- `GET /api/products/:id` — Get single product details
- `POST /api/products` — Add a new product (Admin protected)
- `PUT /api/products/:id` — Update existing product (Admin protected)
- `DELETE /api/products/:id` — Remove product (Admin protected)

### Orders (`/api/orders`)
- `POST /api/orders` — Create new order & award passport stamps
- `GET /api/orders/my-orders` — Get logged-in user's order history
- `GET /api/orders` — Get all store orders (Admin protected)

### Heritage Passport (`/api/passport`)
- `GET /api/passport` — Retrieve user's passport stamps & badges
- `POST /api/passport/stamp` — Stamp a state in user passport

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p center="align"> Made with ❤️ to celebrate India's Handloom & Heritage Fashion.</p>
