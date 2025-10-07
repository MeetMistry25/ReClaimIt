# ReClaimIt - Online Lost & Found Application

A comprehensive lost and found application for university campuses, built with React frontend and Node.js backend with MongoDB integration. ReClaimIt streamlines the process of reporting, finding, and claiming lost items within a campus environment.

## 🚀 Features

- **User Authentication**: Secure login/registration system with JWT
- **Lost Item Reporting**: Report lost items with detailed descriptions, images, and verification questions
- **Found Item Reporting**: Report found items with location, images, and pickup details
- **Smart Matching**: AI-powered matching algorithm between lost and found items
- **Admin Dashboard**: Administrative controls for managing items and users
- **User Dashboard**: Personalized dashboards for lost and found items
- **Search & Filters**: Advanced search and filtering by category, date, location
- **Image Upload**: Support for multiple item images with Cloudinary integration
- **Real-time Updates**: Live status updates for items and claims
- **Claim Processing**: Structured workflow for processing and verifying claims

## 💻 Tech Stack

### Frontend
- **React.js**: Modern UI library for component-based architecture
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Router**: Client-side routing for single-page application
- **Context API**: State management across components
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime for server-side logic
- **Express.js**: Web framework for RESTful API development
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB schema modeling
- **JWT Authentication**: Secure user authentication and authorization
- **Multer**: Middleware for handling file uploads
- **Cloudinary**: Cloud storage for image management
- **bcrypt**: Password hashing for security

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Cloudinary account (for image storage)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ReClaimIt1
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and another in the `server` directory:

**Root .env file:**
```env
# React App Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
```

**Server .env file:**
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/reclaimit

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Start the application

```bash
# Start the backend server (from the server directory)
cd server
npm run dev

# Start the frontend application (from the client directory)
cd ../client
npm start
```

The backend server will run on `http://localhost:5000` and the frontend application will open in your browser at `http://localhost:3000`

## 📊 Database Schema

### Users
- **User Information**: Name, email, password (hashed)
- **Academic Details**: Roll number, branch, year
- **Contact Information**: Phone number, alternate email
- **Profile**: Avatar, bio, preferences
- **Activity Tracking**: Items reported, claims submitted, notifications

### Lost Items
- **Item Details**: Name, description, category, subcategory
- **Temporal Information**: Date lost, time lost
- **Spatial Information**: Location lost, area description
- **Verification**: Custom questions for ownership verification
- **Media**: Multiple images, attachments
- **Status**: Active, matched, claimed, resolved, archived

### Found Items
- **Item Details**: Name, description, category, subcategory
- **Temporal Information**: Date found, time found
- **Spatial Information**: Location found, current storage location
- **Finder Details**: Contact information, pickup arrangements
- **Media**: Multiple images from different angles
- **Status**: Active, claimed, returned, archived

### Claims
- **Claim Details**: Timestamp, claimant information
- **Verification Responses**: Answers to verification questions
- **Status**: Pending, approved, rejected, completed
- **Resolution Details**: Handover information, feedback

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with token

### Items
- `POST /api/items/lost` - Report lost item
- `GET /api/items/lost` - Get all lost items
- `GET /api/items/lost/:id` - Get specific lost item
- `PUT /api/items/lost/:id` - Update lost item
- `DELETE /api/items/lost/:id` - Delete lost item
- `POST /api/items/found` - Report found item
- `GET /api/items/found` - Get all found items
- `GET /api/items/found/:id` - Get specific found item
- `PUT /api/items/found/:id` - Update found item
- `DELETE /api/items/found/:id` - Delete found item

### Claims
- `POST /api/claims/create` - Submit a claim
- `GET /api/claims` - Get all claims for user
- `GET /api/claims/:id` - Get specific claim
- `PUT /api/claims/:id` - Update claim status
- `DELETE /api/claims/:id` - Cancel claim

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/items` - Get all items
- `GET /api/admin/claims` - Get all claims
- `PUT /api/admin/items/:id` - Update item status
- `PUT /api/admin/claims/:id` - Process claim

## 📱 Usage Guide

1. **Register/Login**: Create an account or sign in with your credentials
2. **Report Items**: 
   - Lost something? Use "Report Lost Item" with detailed description
   - Found something? Use "Report Found Item" with location details
3. **Browse Items**: View all reported items in the respective dashboards
4. **Search & Filter**: Use category, date, and location filters to find specific items
5. **Claim Process**: 
   - Submit a claim for a found item that matches your lost item
   - Answer verification questions to prove ownership
   - Arrange pickup/delivery of the item
6. **Track Status**: Monitor the status of your reported items and claims
7. **Notifications**: Receive updates when potential matches are found

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
