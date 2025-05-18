# Course Management System

![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.x-blue.svg)
![React](https://img.shields.io/badge/React-v18+-61DAFB.svg)

A full-stack Course Management System with user-friendly admin panel, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Features

### Backend Features
- **Authentication & Authorization**
  - JWT-based admin authentication
  - Protected admin routes with middleware verification
  
- **Course Management**
  - Create, read, update, and delete courses
  - Course categorization and search

- **Coupon System**
  - Create and manage discount coupons
  - Coupon verification and application

- **Payment Processing**
  - Payment request handling
  - Payment status updates and management

- **Contact Management**
  - Call request handling
  - Contact form submissions

- **Career Applications**
  - Career request submissions and tracking
  - Application management for admins

- **Notifications**
  - System notifications for users and admins
  - Customizable notification management

### Admin Panel Features
- Comprehensive dashboard with analytics
- Course creation and management interface
- User management tools
- Payment tracking and processing
- Coupon generation and management
- Notification system management
- Career application review system


## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication mechanism
- **Middleware** - Custom middleware for route protection
- **RESTful API** - Standard API architecture

### Frontend & Admin Panel
- **Lovable.dv** - used this to create layout
- **TypeScript.js** - Frontend library
- **Material UI/Bootstrap** - UI components
- **Axios** - HTTP client

## 📋 API Endpoints

### Admin Routes
```javascript
POST   /api/admin/login              - Admin login
POST   /api/admin/logout             - Admin logout
GET    /api/admin/loggedin           - Check if admin is logged in
GET    /api/admin/calls              - Get all call requests
POST   /api/admin/delete-call/:id    - Delete a call request
POST   /api/admin/update-call/:id    - Update call request status
GET    /api/admin/payments           - Get all payment requests
POST   /api/admin/update-payment/:id - Update payment status
POST   /api/admin/delete-payment/:id - Delete payment request
POST   /api/admin/create-coupon      - Create new coupon
POST   /api/admin/delete-coupon      - Delete coupon
POST   /api/admin/delete-join-request/:id - Delete career request
GET    /api/admin/career-requests    - Get all career requests
```

### Career Routes
```javascript
POST   /api/career/create            - Create career request
```

### Contact Routes
```javascript
POST   /api/contact/request          - Create call request
```

### Coupon Routes
```javascript
POST   /api/coupons/verify           - Verify coupon
POST   /api/coupons/create           - Create coupon (admin)
POST   /api/coupons/delete/:id       - Delete coupon (admin)
GET    /api/coupons/get              - Get all coupons (admin)
```

### Course Routes
```javascript
POST   /api/courses/create           - Create course (admin)
POST   /api/courses/update           - Update course (admin)
POST   /api/courses/delete/:id       - Delete course (admin)
GET    /api/courses/get-all          - Get all courses
GET    /api/courses/get-course/:id   - Get course by ID
```

### Notification Routes
```javascript
POST   /api/notifications/create     - Create notification (admin)
GET    /api/notifications/get        - Get all notifications
POST   /api/notifications/delete/:id - Delete notification (admin)
GET    /api/notifications/get-single/:id - Get notification by ID (admin)
POST   /api/notifications/update/:id - Update notification (admin)
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/RAGHAV-0202/Admin-Panel-CMS.git
   cd course-management-system/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT = 5000
   MONGO_URI = your_mongodb_connection_string
   DB_NAME = your_mongodb_db_name
   CLOUDINARY_KEY = your_cloudinary_api_key
   CLOUDINARY_SECRET = your_cloudinary_api_secret
   CLOUDINARY_URL=your_cloudinary_url
   CLOUDINARY_NAME = your_cloudinary_cloud_name
   ADMIN_ACCESS_TOKEN_SECRET = any_hash
   ADMIN_ACCESS_TOKEN_EXPIRY = 10d
   ```

4. Start the backend server
   ```bash
   npm run dev
   ```

### Admin Panel Setup
1. Navigate to the admin directory
   ```bash
   cd ../admin
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the admin panel
   ```bash
   npm start
   ```

## 📁 Project Structure

```
course-management-system/
│
├── backend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin.controllers.js
│   │   │   ├── career.controllers.js
│   │   │   ├── contact.controllers.js
│   │   │   ├── coupons.controller.js
│   │   │   ├── course.controllers.js
│   │   │   ├── createcourse.js
│   │   │   ├── notification.controller.js
│   │   │   └── payment.controllers.js
│   │   ├── db/
│   │   │   └── connectDB.js
│   │   ├── middlewares/
│   │   │   └── verifyAdminJWT.js
│   │   ├── models/
│   │   │   ├── admin.models.js
│   │   │   ├── Calls.models.js
│   │   │   ├── career.models.js
│   │   │   ├── coupons.models.js
│   │   │   ├── course.models.js
│   │   │   ├── notification.models.js
│   │   │   └── payment.models.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   ├── career.routes.js
│   │   │   ├── contact.routes.js
│   │   │   ├── coupons.routes.js
│   │   │   ├── course.routes.js
│   │   │   └── notification.routes.js
│   │   └── utils/
│   │       ├── apiError.js
│   │       ├── apiResponse.js
│   │       ├── asyncHandler.js
│   │       ├── cloudinary.js
│   │       └── index.js
│   ├── app.js
│   └── index.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

Your Name - [raghavkapoor16947@gmail.com](raghavkapoor16947@gmail.com)

Project Link: [https://github.com/RAGHAV-0202/Admin-Panel-CMS](https://github.com/RAGHAV-0202/Admin-Panel-CMS)

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [JWT](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/)
