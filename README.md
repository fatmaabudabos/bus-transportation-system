# 🚌 AUB Bus Transportation System

A comprehensive, full-stack web application for managing bus transportation with user authentication, route search, booking, and admin management. Features a beautiful light-mode UI with AUB's official color scheme and a realistic user portal.

## ✨ Enhanced Features

### 🔐 **Authentication System**
- Sign up/Login for users and admins
- Role-based access control
- Secure session management

### 👤 **User Portal Dashboard**
- **📊 Personal Dashboard**: Statistics overview with total trips, spending, and upcoming bookings
- **🎫 My Trips**: Complete booking history with status tracking
- **🔍 Search & Book**: Integrated search with date selection and real-time booking
- **👤 Profile Management**: User information and account details
- **📱 Responsive Sidebar Navigation**: Easy switching between portal sections

### 🚌 **Booking System**
- Real-time seat availability
- Travel date selection
- Booking confirmation with unique IDs
- Status tracking (Confirmed, Completed, Pending)
- Price calculation and payment tracking

### ⚙️ **Admin Panel**
- Complete trip management (Add/Edit/Delete)
- Real-time booking overview
- User management capabilities
- Analytics and reporting

### 🎨 **Modern UI Design**
- **AUB Color Scheme**: Official Maroon (#8B1538) and Gold (#FFD700) colors
- **Light Mode**: Clean, professional light theme
- **Card-Based Interface**: Modern layouts with subtle shadows and hover effects
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Smooth Animations**: Professional transitions and micro-interactions
- **Accessibility**: Proper focus states and color contrast

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, CORS, RESTful API
- **Frontend**: React 19, Vite, Styled Components
- **Styling**: Custom theme system with AUB branding
- **Development**: ESLint, Nodemon, Hot Reload
- **Data**: In-memory storage with realistic mock data

## 🚀 Quick Start

1. **Install dependencies:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. **Start both servers:**
```bash
./start-dev.sh
```

Or manually:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## 🎯 Demo Accounts

- **👑 Admin**: admin@bus.com / admin123
  - Full system access
  - Trip management
  - User oversight
  
- **👤 User**: user@bus.com / user123 (John Doe)
  - Personal dashboard
  - Booking history
  - Trip search and booking

## 🔗 Enhanced API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration  
- `POST /auth/logout` - User logout

### User Portal
- `GET /user/bookings` - Get user's booking history
- `GET /user/stats` - Get user statistics (trips, spending, etc.)

### Trips & Search
- `GET /trips/search?from=&to=` - Search trips with filters
- `GET /trips` - Get all available trips

### Bookings
- `POST /bookings` - Create new booking with travel date
  ```json
  {
    "tripId": 1,
    "seats": 2,
    "travelDate": "2024-09-15"
  }
  ```

### Admin Management
- `POST /admin/trips` - Add new trip
- `PUT /admin/trips/:id` - Update existing trip
- `DELETE /admin/trips/:id` - Delete trip
- `GET /admin/bookings` - Get all bookings with user details

## 📖 User Experience

### 🏠 **User Portal Flow**
1. **Login**: Secure authentication with demo accounts
2. **Dashboard**: Overview of personal statistics and recent bookings
3. **My Trips**: Complete history with booking details and status
4. **Search & Book**: Find routes, select dates, and book instantly
5. **Profile**: View and manage account information

### 👑 **Admin Experience**
- Switch between User Portal and Admin Panel
- Comprehensive trip management
- Real-time booking oversight
- User activity monitoring

### 🎫 **Booking Process**
1. Search routes by origin/destination
2. Select preferred trip and travel date
3. Choose number of seats
4. Instant booking confirmation
5. Track booking status in "My Trips"

## 🌐 Application URLs

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📊 Realistic Data Features

- **User Statistics**: Total trips, spending, upcoming/completed bookings
- **Booking History**: Complete records with dates, prices, and status
- **Trip Details**: Comprehensive information including booking IDs
- **Status Tracking**: Real-time updates on booking status
- **Date Management**: Travel date selection and booking timestamps

## 🎨 UI Highlights

### User Portal
- **Sidebar Navigation**: Clean, intuitive menu with active states
- **Statistics Cards**: Visual overview of user activity
- **Trip Cards**: Detailed booking information with status badges
- **Search Interface**: Integrated booking system with date pickers
- **Profile Section**: Complete user information display

### Design Elements
- **Avatar System**: Personalized user avatars with initials
- **Status Badges**: Color-coded booking status indicators
- **Hover Effects**: Subtle animations and interactive feedback
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **AUB Branding**: Consistent color scheme and typography

## 🔧 Development Features

- **Hot Reload**: Instant updates during development
- **ESLint**: Code quality and consistency
- **Modern ES Modules**: Clean, maintainable code structure
- **Component Architecture**: Reusable, modular components
- **Theme System**: Centralized styling with AUB colors

The system now provides a complete, realistic bus transportation experience with professional UI/UX design that reflects AUB's brand identity while offering comprehensive functionality for both users and administrators.