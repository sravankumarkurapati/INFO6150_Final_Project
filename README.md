# Flavor Fusion - Food Ordering Platform
This repository has been created for the final project of INFO 6150
## 🚀 Technologies Used

### Frontend
- React.js
- React Bootstrap
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (Image Uploads)
- Bcrypt (Password Encryption)
- JWT (Authentication)
- Stripe (Payment Gateway)
- Swagger (API Documentation)

  Render server used for deployment

---

## 📱 Application Overview

### 🔐 Authentication
- Role-based login for Admin, Customer, Restaurant, and Delivery users.
- JWT for secure sessions and Bcrypt for password hashing.

---

## 🖥️ Frontend Functionalities

### Admin Dashboard
- Manage Users and Restaurants.
- Assign restaurant owners.
- View commissions earned.
- Perform CRUD operations.

### Customer Dashboard
- Browse restaurants and menu items.
- Add to cart and pay using Stripe.
- Track order status: Preparing → Out for Delivery → Delivered.

### Restaurant Dashboard
- Add and edit menu items (image, price, availability).
- Track incoming orders.
- Update status and assign delivery personnel.

### Delivery Dashboard
- View assigned orders.
- Mark orders as completed after delivery.

---

## ⚙️ Backend Functionalities

- Role-based API routing with Express.
- Secure authentication and image uploads.
- CRUD operations for users, restaurants, items, and orders.
- Stripe integration for payment.
- Swagger-based API documentation.

---

## 📘 Swagger API Documentation

The backend API is documented using Swagger (OpenAPI 3.0).

You can view or import the generated Swagger JSON file into tools like [Swagger Editor](https://editor.swagger.io/) or [Postman](https://www.postman.com/).

➡️ **Download**: [generated_swagger.json](./generated_swagger.json)
