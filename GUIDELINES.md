# ShopEZ: E-Commerce Application — Project Guidelines

---

## Introduction

ShopEZ is your one-stop destination for effortless online shopping. With a user-friendly interface and a comprehensive product catalog, finding the perfect items has never been easier. Seamlessly navigate through detailed product descriptions, customer reviews, and available discounts to make informed decisions. Enjoy a secure checkout process and receive instant order confirmation. For sellers, our robust dashboard provides efficient order management and insightful analytics to drive business growth. Experience the future of online shopping with ShopEZ today.

---

## Scenario: Sarah's Birthday Gift

Sarah, a busy professional, is scrambling to find the perfect birthday gift for her best friend, Emily. She knows Emily loves fashion accessories, but with her hectic schedule, she hasn't had time to browse through multiple websites to find the ideal present. Feeling overwhelmed, Sarah turns to ShopEZ to simplify her search.

1. **Effortless Product Discovery** — Sarah opens ShopEZ and navigates to the fashion accessories category. She's greeted with a diverse range of options. Using the filtering options, Sarah selects "bracelets" and refines her search based on Emily's preferred style and budget.

2. **Personalized Recommendations** — As Sarah scrolls through the curated selection of bracelets, she notices a section labeled "Recommended for You." She discovers a stunning gold bangle that perfectly matches Emily's taste and adds it to her cart.

3. **Seamless Checkout Process** — With the bracelet in her cart, Sarah proceeds to checkout. She enters Emily's address as the shipping destination and selects her preferred payment method. ShopEZ's secure and efficient checkout process lets Sarah complete the transaction in just a few clicks.

4. **Order Confirmation** — Moments after placing her order, Sarah receives a confirmation email from ShopEZ.

5. **Efficient Order Management for Sellers** — The seller of the gold bangle receives a notification of Sarah's purchase through ShopEZ's seller dashboard. They quickly process the order and prepare it for shipment.

6. **Celebrating with Confidence** — On Emily's birthday, Sarah presents her with the beautifully packaged bracelet, knowing it was chosen with care. Emily's eyes light up with joy as she adorns the bracelet.

---

## System Requirements

### 1. Software Requirements

| Tool | Version / Details |
|---|---|
| Operating System | Windows 10/11, macOS, or Linux |
| Node.js | v16 or above |
| npm | v8 or above |
| React.js | JavaScript library for UI |
| Express.js | Lightweight web framework for RESTful APIs |
| MongoDB | NoSQL database (Users, Admin, Products, Orders, Cart) |
| Browser | Google Chrome / Firefox (latest version) |
| Postman | Tool for testing APIs during development |
| Visual Studio Code | Preferred code editor |
| Git & GitHub | Version control and collaborative development |

### 2. Hardware Requirements

| Component | Specification |
|---|---|
| Processor | Intel Core i5 (8th Gen+) / AMD Ryzen 5 or better |
| RAM | Minimum 8 GB (16 GB recommended) |
| Storage | At least 1 GB free space |
| Display | 1366×768 or higher |

---

## Project Architecture

### Overview

The application follows a classic **3-tier architecture**:

- **Frontend** — React.js UI including: User Authentication, Cart, Products, Profile, Admin Dashboard, etc.
- **Backend** — Express.js API endpoints for Users, Orders, Products, Admin Authentication, and Admin Dashboard.
- **Database** — MongoDB collections for Users, Cart, Orders, and Products.

### MVC Pattern

The backend follows the **Model-View-Controller (MVC)** architectural pattern:

- **Model Layer** — Handles all data-related logic. Schemas and database operations using Mongoose.
- **Controller Layer** — Acts as an intermediary between routes and models. Processes requests, calls model methods, and returns responses.
- **View Layer (Routing Layer)** — Defines API endpoints that respond to HTTP requests (GET, POST, PUT, DELETE) and invoke the appropriate controller functions.

**Advantages of MVC in this project:**
- **Separation of Concerns** — Each layer has a clearly defined responsibility.
- **Scalability** — New features are added easily by creating new routes, controllers, and models.
- **Reusability** — Logic in controllers and models can be reused across the app.
- **Testing** — Each layer can be tested independently.
- **Collaboration-Friendly** — Multiple developers can work on different layers simultaneously.

---

## ER Diagram Entities

| Entity | Description |
|---|---|
| **User** | Individuals registered on the platform. |
| **Admin** | Stores important details such as Banner image and Categories. |
| **Products** | All products available on the platform. |
| **Cart** | Products added to cart by users, differentiated by `userId`. |
| **Orders** | All orders made by users on the platform. |

---

## Features

1. **Comprehensive Product Catalog** — Extensive catalog with detailed descriptions, customer reviews, pricing, and available discounts.

2. **Shop Now Button** — Each product listing has a "Shop Now" button. Clicking it initiates the purchasing process for that product directly.

3. **Order Details Page** — After clicking "Shop Now", the user is directed to an order details page to provide shipping address, payment method, and specific product requirements.

4. **Secure and Efficient Checkout** — Personal information is handled with the utmost security. The process is swift and trouble-free.

5. **Order Confirmation and Details** — After placing an order, the user receives a confirmation notification and is directed to an order details page showing all order info.

6. **Seller / Admin Dashboard** — Robust dashboard for admins/sellers to add products, manage listings, view order history, monitor customer activity, and access order details.

---

## Roles & Responsibilities

| Role | Responsibilities |
|---|---|
| **User** | Browse products, add to cart, place orders, view order history in profile. |
| **Admin** | Manage products (Add/Edit/Delete), manage orders, update order status, configure banner and categories. |

---

## User Flow

1. Users start by **registering** for an account.
2. After registration, they can **log in** with their credentials.
3. Once logged in, they can **browse available products** on the platform.
4. Users can **add products to their cart** and proceed to order.
5. They then **enter address and payment details** during checkout.
6. After ordering, they can **check their orders in the Profile section**.

---

## Database Development

### Schema Definitions

#### 1. User Schema
- **Model:** `User`
- Fields: `username`, `email` (unique), `password`
- Used for user registration and authentication.

#### 2. Product Schema
- **Model:** `Product`
- Fields: `name`, `description`, `price`, `image`, `category`, `stock`
- Used to store all product details.

#### 3. Orders Schema
- **Model:** `Orders`
- Fields: `userId`, `productId`, `productName`, `quantity`, `size`, `orderDate`, `shippingAddress`, `totalAmount`, `status`
- Stores all orders made by users. `userId` is a reference to the `User` model.

#### 4. Cart Schema
- **Model:** `Cart`
- Fields: `userId`, `productId`, `productName`, `quantity`, `size`
- Stores products added to the cart. `userId` references the `User` model.

#### 5. Admin Schema
- **Model:** `Admin`
- Fields: `banner`, `categories`
- Stores essential admin configuration data such as the homepage banner and product categories list.

---

## Backend Development

### Setup Steps

1. **Setup Express Server**
   - Create `index.js` file.
   - Create an Express server on your desired port.
   - Define APIs.

2. **Database Configuration**
   - Set up MongoDB locally or via MongoDB Atlas / MongoDB Compass.
   - Create a database and define collections for: `admin`, `users`, `products`, `orders`, `cart`.

3. **Create Express.js Server**
   - Set up Express to handle HTTP requests and serve API endpoints.
   - Configure middleware: `body-parser` for request bodies, `cors` for cross-origin requests.

4. **Define API Routes**
   - Create separate route files for: users, orders, authentication, products, cart, admin.
   - Define necessary routes for listing products, user registration/login, managing orders, etc.

5. **Implement Data Models**
   - Define Mongoose schemas for: products, users, orders, cart, admin.
   - Implement CRUD operations (Create, Read, Update, Delete) for each model.

6. **User Authentication**
   - Create routes and middleware for user registration, login, and logout.
   - Set up authentication middleware (JWT) to protect routes.

7. **Handle Products and Orders**
   - Create routes and controllers for product listings (fetch from DB).
   - Implement ordering (buy) functionality with validation and database updates.

8. **Admin Functionality**
   - Routes and controllers for admin-specific actions (add products, manage orders, configure banner/categories).
   - Authentication and authorization checks to restrict access to admins only.

9. **Error Handling**
   - Implement error handling middleware to catch and handle errors.
   - Return appropriate error responses with messages and HTTP status codes.

---

## Frontend Development

### Setup Steps

1. **Setup React Application**
   - Create a React app inside the `client` folder using Vite.
   - Install required libraries.
   - Create required pages and components and add routes.

2. **Design UI Components**
   - Create reusable components.
   - Implement layout and styling.
   - Add navigation.

3. **Implement Frontend Logic**
   - Integration with backend API endpoints.
   - Implement data binding.

---

## Project Setup & Configuration

### Folder Structure
```
<project-name>/
├── client/      ← React frontend
└── server/      ← Express backend
```

### Client Setup (React via Vite)
```bash
# Inside the client folder:
npm create vite@latest . -- --template react
# Select: React → JavaScript
npm install
npm run dev
# App runs at: http://localhost:5173
```

### Server Setup
```bash
# Inside the server folder:
npm init -y
# Create: index.js
# Create folders: models/, controllers/, routes/
```

### Environment Variables
Inside `server/`, create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/<dbname>
PORT=8000
JWT_SECRET=your_secret_key
```

---

## Project Execution

### Step 1: Start the Frontend
```bash
cd client
npm run dev
# Runs at: http://localhost:5173
```

### Step 2: Start the Backend
```bash
cd server
nodemon index.js
# Runs at: http://localhost:8000
```

---

## Output Screens (Expected Pages)

| Page | Description |
|---|---|
| **Landing Page** | Homepage of the application. |
| **Products Page** | Lists all available products with search, filter, and sort. |
| **Authentication** | Registration and Login forms. |
| **User Profile** | Displays user details and their order history. |
| **Cart** | Users can view, add, or remove products from their cart. |
| **Admin Dashboard** | Overview of stats: Total Products, Orders, Revenue. |
| **Admin - All Orders** | Admin can view and update order statuses. |
| **Admin - All Products** | Admin can view, edit, or delete all products. |
| **Admin - New Product** | Admin can add a new product with details. |
