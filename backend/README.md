# Blissful Cakes Backend

This is the backend API for the Blissful Cakes application.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=blissful_cakes
   JWT_SECRET=your-super-secret-jwt-key
   UPLOAD_PATH=uploads/
   MAX_FILE_SIZE=5242880
   ```

3. Set up your MySQL database and create a database named `blissful_cakes`

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## Project Structure

```
backend/
├── src/
│   ├── controller/
│   │   ├── auth/
│   │   │   └── authController.js
│   │   └── user/
│   │       └── userController.js
│   ├── database/
│   │   └── index.js
│   ├── middleware/
│   │   └── token-middleware.js
│   ├── models/
│   │   ├── index.js
│   │   └── user/
│   │       └── User.js
│   ├── route/
│   │   ├── auth/
│   │   │   └── authRoute.js
│   │   ├── user/
│   │   │   └── userRoute.js
│   │   └── uploadRoutes.js
│   └── index.js
├── uploads/
├── package.json
└── README.md
``` 