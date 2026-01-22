# 🐾 Pet Hospital Management System

A comprehensive full-stack web application for managing pet hospital operations, including patient records, appointments, inventory, billing, and real-time communication.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-app.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue)](https://github.com/YOUR-USERNAME/pet-hospital-system)

## 🚀 Features

### For Pet Owners
- 🔐 **Secure Authentication** - Register and login with OTP verification
- 🐕 **Pet Records Management** - Add, view, and manage pet profiles
- 📅 **Appointment Booking** - Schedule appointments with veterinarians
- 💬 **Real-time Messaging** - Chat with hospital staff
- 🤖 **AI Chatbot** - Get instant answers to common questions
- 📄 **Medical History** - Access complete medical records and prescriptions
- 💰 **Invoice Management** - View and download invoices

### For Hospital Staff
- 👥 **User Management** - Manage pet owners and staff accounts
- 🏥 **Appointment Management** - View and manage all appointments
- 📋 **Medical Records** - Create and update pet medical records
- 💊 **Inventory Tracking** - Monitor medicine and supplies
- 📊 **Analytics Dashboard** - View hospital statistics and insights
- 🛒 **Purchase Requests** - Handle supplier orders
- 💳 **Billing System** - Generate invoices and track payments

### Admin Features
- 👮 **Role-Based Access Control** - Assign roles and permissions
- 🔍 **Security Logs** - Monitor user activities
- 📈 **Advanced Analytics** - Chatbot analytics, user stats
- ⚙️ **System Configuration** - Manage FAQs and chatbot knowledge base

## 🛠️ Tech Stack

### Frontend
- **React** 19.0.0 - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **jsPDF** - PDF generation
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Twilio** - SMS service
- **OpenAI** - AI chatbot integration

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/pet-hospital-system.git
cd pet-hospital-system
```

2. **Install dependencies**
```bash
npm run install-all
```

Or manually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**

**Backend** (`backend/.env`):
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** (`frontend/.env.development`):
```env
REACT_APP_API_URL=http://localhost:5001
```

4. **Run the application**

Option 1 - Run both servers:
```bash
npm run dev
```

Option 2 - Run separately:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 🌐 Deployment

See the detailed [DEPLOYMENT.md](./DEPLOYMENT.md) guide for step-by-step instructions to deploy to production.

### Quick Deploy
- **Frontend**: Vercel (recommended)
- **Backend**: Render (recommended)
- **Database**: MongoDB Atlas

## 📱 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register        - Register new user
POST   /api/auth/verify-otp      - Verify OTP
POST   /api/auth/login           - User login
GET    /api/auth/me              - Get current user
```

### Pet Records
```
GET    /pets                     - Get all pets
POST   /pets                     - Create pet record
GET    /pets/:id                 - Get pet by ID
PUT    /pets/:id                 - Update pet
DELETE /pets/:id                 - Delete pet
```

### Appointments
```
GET    /appointments             - Get all appointments
POST   /appointments             - Create appointment
PUT    /appointments/:nic        - Update appointment
DELETE /appointments/:nic        - Delete appointment
```

### Medical Records
```
GET    /medies/:petid            - Get medical records by pet ID
POST   /medies                   - Create medical record
PUT    /medies/:index            - Update medical record
DELETE /medies/:index            - Delete medical record
```

[See full API documentation](./API_DOCS.md)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- OTP verification for registration
- Role-based access control (RBAC)
- Protected routes
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📊 Project Structure

```
pet-hospital-system/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth & admin middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── api/         # API calls
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── pages/       # Page components
│       ├── services/    # Frontend services
│       └── utils/       # Helper functions
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kaveesha Athukorala**

- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn URL]
- GitHub: [@YOUR-USERNAME](https://github.com/YOUR-USERNAME)
- Email: kaveeshatech@gmail.com

## 🙏 Acknowledgments

- Built with React, Node.js, Express, and MongoDB
- Real-time features powered by Socket.IO
- AI chatbot integration with OpenAI
- UI components styled with TailwindCSS
- Icons from React Icons

## 📞 Support

For support, email kaveeshatech@gmail.com or create an issue in the repository.

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
