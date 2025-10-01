<<<<<<< HEAD
# ReClaimIt - Campus Lost & Found Application

A comprehensive lost and found application for university campuses, built with React frontend and Node.js backend with MongoDB integration.

## Features

- **User Authentication**: Secure login/registration system
- **Lost Item Reporting**: Report lost items with images and verification questions
- **Found Item Reporting**: Report found items with location and pickup details
- **Smart Matching**: AI-powered matching between lost and found items
- **Dashboard Views**: Separate dashboards for lost and found items
- **Search & Filters**: Advanced search and filtering capabilities
- **Image Upload**: Support for item images
- **Real-time Updates**: Live status updates for items

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ReClaimIt1
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Install frontend dependencies
```bash
cd ../client
npm install
```

### 4. Set up environment variables
Create a `.env` file in the `server` directory:

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
```

### 5. Start MongoDB
Make sure MongoDB is running on your system. If using MongoDB locally:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### 6. Start the backend server
```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### 7. Start the frontend application
```bash
cd client
npm start
```

The application will open in your browser at `http://localhost:3000`

## Database Schema

### Users
- Basic user information (name, email, password)
- Academic details (roll number, branch)
- Contact information
- Active claims tracking

### Lost Items
- Item details (name, description, category)
- Location and date information
- Verification questions for ownership
- Status tracking (active, claimed, resolved)

### Found Items
- Item details (name, description, category)
- Location and date information
- Pickup location details
- Status tracking (active, claimed, resolved)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Items
- `POST /api/items/lost` - Report lost item
- `GET /api/items/lost` - Get all lost items
- `POST /api/items/found` - Report found item
- `GET /api/items/found` - Get all found items
- `GET /api/items/search` - Search items
- `GET /api/items/matches` - Get potential matches

## Usage

1. **Register/Login**: Create an account or sign in
2. **Report Items**: Use the "Report Lost Item" or "Report Found Item" pages
3. **Browse Items**: View all reported items in the respective dashboards
4. **Search & Filter**: Use advanced search and filtering options
5. **Claim Items**: Claim found items that match your lost items
6. **Track Status**: Monitor the status of your reported items

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
=======
# ReClaimIt
>>>>>>> 71fa446add8cebe2ec83b0f00dc24fd63cf52766
