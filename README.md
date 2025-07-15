# Blissful Cakes

A full-stack web application for a cake bakery business with user authentication, menu management, and file upload capabilities.

## Project Structure

```
blissful_Cakes/
├── backend/          # Node.js/Express API
├── frontend/         # React/Vite frontend
├── Authentication/   # Legacy authentication module
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
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

4. Set up your MySQL database and create a database named `blissful_cakes`

5. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Features

### Backend Features
- User authentication (register/login)
- JWT token-based authorization
- User profile management
- File upload functionality
- MySQL database integration
- RESTful API endpoints

### Frontend Features
- Responsive design
- User authentication pages
- Landing page with cake showcase
- Menu page with cake listings
- Contact and About Us pages
- Dashboard for authenticated users

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

## Technologies Used

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React
- Vite
- CSS for styling
- React Router for navigation

## Development

To run both backend and frontend simultaneously:

1. Start the backend:
   ```bash
   cd backend && npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend && npm run dev
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 