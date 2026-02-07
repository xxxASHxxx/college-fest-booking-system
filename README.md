<div align="center">

# 🎊 FESTIFY - College Fest Booking System

### *Where Events Meet Excellence* ✨

<img src="./fest-booking-ui/public/festify.png" alt="Festify Logo" width="200"/>

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-key-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

**FESTIFY** is a full-stack, enterprise-grade **College Festival Event Booking System** that revolutionizes how students experience campus events. Built with modern technologies and offline-first architecture, it provides a seamless, lightning-fast booking experience from browsing to confirmation.

> 🏆 **Perfect for**: College tech fests, cultural events, sports tournaments, workshops, hackathons, and any campus celebration!

### 🎯 Why FESTIFY?

- ⚡ **Lightning Fast** - Instant booking confirmations, no waiting
- 🔒 **Secure** - JWT-based authentication with Spring Security
- 📱 **Responsive** - Beautiful UI that works on any device
- 🌐 **Offline-First** - Works completely offline, perfect for demos
- 🎨 **Modern Design** - Premium glassmorphism UI with smooth animations
- 📊 **Admin Dashboard** - Real-time analytics and event management
- 🎫 **Smart Booking** - Multi-tier pricing, capacity management, venue assignment
- 🚀 **Production Ready** - Clean architecture, validated DTOs, comprehensive error handling

---

## ✨ Key Features

### 👥 **For Students**
- 🔍 **Event Discovery** - Browse and search through exciting campus events
- 🎟️ **Easy Booking** - Select price tier, choose seats, instant confirmation
- 📋 **Booking History** - Track all your event registrations
- 👤 **User Profile** - Manage personal information and preferences
- 🎨 **Immersive UI** - Stunning interface with background videos and animations

### 🛠️ **For Admins**
- 📊 **Analytics Dashboard** - Real-time stats on bookings, revenue, and capacity
- 🎪 **Event Management** - Create, update, and manage events effortlessly
- 🏛️ **Venue Control** - Manage venues with capacity tracking
- 💰 **Price Tiers** - Flexible pricing (Early Bird, Regular, VIP, etc.)
- 👥 **User Management** - View and manage user accounts
- 📈 **Revenue Tracking** - Monitor earnings across events and tiers

### 🔧 **Technical Highlights**
- 🔐 **JWT Authentication** - Secure token-based auth with refresh tokens
- 🗃️ **Dual Database Support** - MySQL for production, H2 for quick demos
- 📦 **Auto Data Seeding** - Pre-populated with sample events and users
- 🎯 **RESTful API** - Clean, documented endpoints
- ✅ **Input Validation** - Spring Validation with custom constraints
- 🏗️ **Layered Architecture** - Controller → Service → Repository pattern
- 🔄 **CORS Enabled** - Seamless frontend-backend integration
- 📝 **Lombok Powered** - Clean, boilerplate-free code

---

## 🚀 Quick Start

### Prerequisites

- ☕ **Java 17+** ([Download](https://adoptium.net/))
- 🗄️ **MySQL 8.0+** ([Download](https://dev.mysql.com/downloads/mysql/))
- 📦 **Node.js 18+** ([Download](https://nodejs.org/))
- 🔧 **Maven 3.8+** (included via wrapper)

### 🎬 Installation

#### **Backend Setup (Spring Boot)**

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/festify.git
cd festify

# 2. Configure MySQL
# Create database
mysql -u root -p
CREATE DATABASE fest_booking;
EXIT;

# 3. Update application.properties (already configured!)
# Located at: src/main/resources/application.properties
# Default credentials: root / root
# Update if your MySQL has different credentials

# 4. Build & Run
./mvnw clean package -DskipTests
./mvnw spring-boot:run

# Backend runs on: http://localhost:8080
```

#### **Frontend Setup (React + Vite)**

```bash
# 1. Navigate to frontend directory
cd fest-booking-ui

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Frontend runs on: http://localhost:5173
```

### 🎭 Demo Accounts

Once the backend starts, these accounts are auto-created:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@festbook.com` | `admin123` | 👑 Admin | Full dashboard access |
| `student1@college.edu` | `student123` | 🎓 Student | Regular user |
| `student2@college.edu` | `student123` | 🎓 Student | Regular user |
| `student3@college.edu` | `student123` | 🎓 Student | Regular user |

### 🎪 Pre-loaded Events

The system seeds **5 awesome events** on startup:

1. 🎵 **Starlight Music Fest 2026** - Main Auditorium (500 capacity)
2. 💻 **Tech Innovation Summit** - Open Air Theatre (1000 capacity)
3. ⚽ **Annual Sports Championship** - Sports Complex (300 capacity)
4. 🎭 **Cultural Night: Colors of India** - Main Auditorium
5. 🚀 **HackFest 2026** - Tech Hub

---

## 🛠️ Tech Stack

### **Backend**
- 🍃 **Spring Boot 3.2.1** - Application framework
- 🔐 **Spring Security** - Authentication & authorization
- 💾 **Spring Data JPA** - Database abstraction
- 🗄️ **MySQL / H2** - Relational databases
- 🎫 **JWT (JJWT 0.12.3)** - Token-based auth
- ✉️ **Spring Mail** - Email notifications (optional)
- ✅ **Hibernate Validator** - Input validation
- 🧹 **Lombok** - Reduces boilerplate code
- ☕ **Java 17** - Latest LTS version

### **Frontend**
- ⚛️ **React 18.3.1** - UI library
- ⚡ **Vite 5.1** - Lightning-fast build tool
- 🧭 **React Router DOM 6** - Client-side routing
- 📡 **Axios** - HTTP client
- 🎨 **TailwindCSS** - Utility-first styling
- 📊 **Recharts** - Data visualization
- 🎊 **React Confetti** - Celebration effects
- 🔣 **React Icons** - Icon library
- 📅 **date-fns** - Date utilities

### **Development Tools**
- 🔧 **Maven** - Dependency management (backend)
- 📦 **npm** - Package manager (frontend)
- 🎨 **ESLint** - Code linting
- 💅 **Prettier** - Code formatting
- 🔄 **Hot Reload** - Live development

---

## 📐 Architecture

### **System Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                   FESTIFY SYSTEM                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌───────────────┐         ┌──────────────────┐        │
│  │   Frontend    │◄───────►│     Backend      │        │
│  │  React + Vite │  REST   │   Spring Boot    │        │
│  │  Port: 5173   │   API   │   Port: 8080     │        │
│  └───────────────┘         └──────────────────┘        │
│         │                           │                   │
│         │                           ▼                   │
│         │                  ┌─────────────────┐         │
│         │                  │  MySQL Database │         │
│         │                  │  fest_booking   │         │
│         │                  └─────────────────┘         │
│         │                                               │
│         └───────────► Browser Storage (JWT)            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### **Backend Architecture**

```
📦 com.collegefest.booking
 ├── 🎛️ controller/          # REST API endpoints
 │   ├── AuthController       # Login, register, JWT refresh
 │   ├── EventController      # Event CRUD
 │   ├── BookingController    # Booking management
 │   ├── VenueController      # Venue operations
 │   ├── UserController       # User profile
 │   ├── AdminDashboardController  # Analytics
 │   └── TicketController     # Ticket generation
 │
 ├── 🔧 service/              # Business logic
 │   ├── AuthService          # Authentication
 │   ├── EventService         # Event operations
 │   ├── BookingService       # Booking workflow
 │   ├── UserService          # User management
 │   ├── VenueService         # Venue handling
 │   ├── TicketService        # Ticket generation
 │   └── DashboardService     # Analytics aggregation
 │
 ├── 🗂️ repository/          # Database layer
 │   ├── UserRepository
 │   ├── EventRepository
 │   ├── BookingRepository
 │   ├── VenueRepository
 │   └── PriceTierRepository
 │
 ├── 📊 entity/              # JPA entities
 │   ├── User                # User account
 │   ├── Event               # Event details
 │   ├── Booking             # Booking record
 │   ├── Venue               # Venue info
 │   ├── PriceTier           # Pricing options
 │   └── Ticket              # Generated tickets
 │
 ├── 🔐 security/            # Security config
 │   ├── JwtAuthenticationFilter
 │   ├── JwtTokenProvider
 │   ├── SecurityConfig
 │   └── UserDetailsServiceImpl
 │
 ├── 📝 dto/                 # Data transfer objects
 │   ├── request/
 │   └── response/
 │
 ├── ⚙️ config/             # Application config
 │   ├── CorsConfig
 │   ├── DataSeederConfig    # Sample data loader
 │   └── WebConfig
 │
 └── ⚠️ exception/          # Error handling
     ├── GlobalExceptionHandler
     ├── ResourceNotFoundException
     └── ValidationException
```

### **Frontend Architecture**

```
📦 fest-booking-ui/src
 ├── 📄 pages/               # Route components
 │   ├── HomePage            # Landing page with hero video
 │   ├── EventsPage          # Event listing & search
 │   ├── EventDetailsPage    # Single event view
 │   ├── BookingPage         # Booking flow
 │   ├── MyBookingsPage      # User bookings
 │   ├── ProfilePage         # User profile
 │   ├── auth/
 │   │   ├── LoginPage
 │   │   └── RegisterPage
 │   └── admin/
 │       └── AdminDashboard  # Admin panel
 │
 ├── 🧩 components/          # Reusable components
 │   ├── Navbar
 │   ├── Footer
 │   ├── EventCard
 │   ├── BookingCard
 │   ├── ProtectedRoute
 │   └── LoadingSpinner
 │
 ├── 🌐 services/           # API integration
 │   ├── api.js             # Axios instance
 │   ├── authService.js     # Auth API calls
 │   ├── eventService.js    # Event API calls
 │   └── bookingService.js  # Booking API calls
 │
 ├── 🎨 styles/             # Global styles
 │   └── index.css          # Tailwind + custom CSS
 │
 └── 🔧 utils/              # Utility functions
     ├── formatDate.js
     ├── formatCurrency.js
     └── validation.js
```

---

## 🔌 API Documentation

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | 🔐 |
| GET | `/api/auth/user` | Get current user | 🔐 |

### **Event Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | Get all events | ❌ |
| GET | `/api/events/{id}` | Get event details | ❌ |
| POST | `/api/events` | Create event | 👑 Admin |
| PUT | `/api/events/{id}` | Update event | 👑 Admin |
| DELETE | `/api/events/{id}` | Delete event | 👑 Admin |
| GET | `/api/events/{id}/price-tiers` | Get pricing tiers | ❌ |

### **Booking Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking | 🔐 |
| GET | `/api/bookings/user` | Get user bookings | 🔐 |
| GET | `/api/bookings/{id}` | Get booking details | 🔐 |
| DELETE | `/api/bookings/{id}` | Cancel booking | 🔐 |
| GET | `/api/bookings/event/{eventId}` | Get event bookings | 👑 Admin |

### **Admin Dashboard Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Get dashboard stats | 👑 Admin |
| GET | `/api/admin/users` | List all users | 👑 Admin |
| GET | `/api/admin/bookings` | All bookings | 👑 Admin |

### **Venue Endpoints**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/venues` | Get all venues | ❌ |
| POST | `/api/venues` | Create venue | 👑 Admin |

---

## 📁 Project Structure

```
festify/
├── 📂 fest-booking-ui/              # React Frontend
│   ├── public/                      # Static assets
│   │   ├── festify.png              # App logo
│   │   ├── festmainvideo.mp4        # Hero video
│   │   ├── allred.mp4               # Events page video
│   │   └── ...
│   ├── src/                         # Source code
│   ├── package.json
│   └── vite.config.js
│
├── 📂 src/main/
│   ├── java/com/collegefest/booking/  # Backend code
│   └── resources/
│       ├── application.properties     # MySQL config
│       └── application-dev.properties # H2 config (optional)
│
├── 📂 target/                       # Compiled backend
├── pom.xml                          # Maven config
├── mvnw / mvnw.cmd                  # Maven wrapper
├── .env.development                 # Frontend env vars
├── .gitignore
├── LICENSE
└── README.md                        # You are here!
```

---

## 🎨 Screenshots

<div align="center">

### 🏠 Landing Page
*Stunning hero section with background video*

### 📋 Event Listing
*Browse events with search and filters*

### 🎟️ Event Details
*Detailed event view with pricing tiers*

### 👑 Admin Dashboard
*Real-time analytics and management*

</div>

---

## 🔒 Security Features

- 🔐 **JWT Authentication** - Secure, stateless auth
- 🔑 **BCrypt Password Hashing** - Industry-standard encryption
- 🛡️ **CORS Protection** - Configured for secure origins
- ✅ **Input Validation** - All DTOs validated
- 🚫 **SQL Injection Prevention** - JPA parameterized queries
- 🔍 **XSS Protection** - React's built-in escaping
- 🎯 **Role-Based Access Control** - Admin vs User permissions

---

## 🌐 Environment Configuration

### **Backend** (`src/main/resources/application.properties`)

```properties
# Database (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/fest_booking
spring.datasource.username=root
spring.datasource.password=root

# JWT Configuration
jwt.secret=your-256-bit-secret-key-here
jwt.expiration=86400000

# Server
server.port=8080

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### **Frontend** (`.env.development`)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=FESTIFY
```

---

## 🧪 Testing

### **Run Backend Tests**

```bash
./mvnw test
```

### **Run Frontend Tests**

```bash
cd fest-booking-ui
npm test
```

---

## 📦 Deployment

### **Production Build**

#### Backend (generates JAR)

```bash
./mvnw clean package
java -jar target/booking-0.0.1-SNAPSHOT.jar
```

#### Frontend (generates static files)

```bash
cd fest-booking-ui
npm run build
# Output in: dist/
```

### **Docker Deployment** (Coming Soon!)

```bash
docker-compose up -d
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 **Fork the repository**
2. 🌿 **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. 💾 **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. 📤 **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. 🔃 **Open a Pull Request**

### **Code Style**

- ✅ Follow existing code patterns
- 📝 Add comments for complex logic
- 🧪 Write tests for new features
- 📋 Update documentation

---

## 🗺️ Roadmap

- [ ] 📱 Mobile App (React Native)
- [ ] 🎫 QR Code Ticket Generation
- [ ] 💳 Payment Gateway Integration (Razorpay/Stripe)
- [ ] 📧 Email Notifications
- [ ] 📊 Advanced Analytics
- [ ] 🔔 Push Notifications
- [ ] 🌙 Dark Mode
- [ ] 🌍 Multi-language Support
- [ ] 📱 PWA Support
- [ ] 🐳 Docker Compose Setup

---

## 🐛 Known Issues & Limitations

- ⚠️ H2 database has cascade constraint issues (use MySQL instead)
- ⚠️ Payment integration not yet implemented (instant booking for now)
- ⚠️ Email service disabled for offline operation
- ⚠️ QR code generation temporarily removed for simplicity

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Ashmit** - *Initial work* - [GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- 🎨 Design inspiration from modern event booking platforms
- 🌐 Spring Boot community for excellent documentation
- ⚛️ React team for the amazing framework
- 🎓 Built as a DBMS project for academic excellence

---

## 📞 Support

Having issues? We'd love to help!

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/festify/issues)
- 💬 **Questions**: [Discussions](https://github.com/yourusername/festify/discussions)
- 📧 **Email**: support@festify.com

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

Made with ❤️ by the FESTIFY Team

[⬆ Back to Top](#-festify---college-fest-booking-system)

</div>
