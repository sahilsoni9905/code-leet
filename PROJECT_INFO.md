# 🚀 Codo-Leet Platform - Complete Project Documentation

## 📋 Project Overview

Codo-Leet is a comprehensive coding platform built with microservices architecture that allows users to solve programming problems, submit solutions, get real-time feedback, and compete on a leaderboard. The platform supports multiple programming languages (JavaScript and C++) and provides instant evaluation with WebSocket-powered real-time updates.

---

## 🏗️ System Architecture

### Microservices Architecture

The platform is built using a microservices architecture with 4 independent services, each handling specific responsibilities:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │ Problem Service │    │Submission Service│    │Evaluator Service│
│    Port 3001    │    │    Port 3002    │    │    Port 3003     │    │    Port 3004    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         └───────────────────────┼───────────────────────┼───────────────────────┘
                                 │                       │
                        ┌─────────────────┐    ┌─────────────────┐
                        │   Frontend      │    │   MongoDB Atlas │
                        │  Port 5173/5174 │    │   Cloud Database│
                        └─────────────────┘    └─────────────────┘
```

---

## 🔧 Service Details

### 1. 👤 User Service (Port 3001)

**Responsibility:** User authentication, authorization, and leaderboard management

**Key Features:**

- User registration and login
- JWT token generation and verification
- Password hashing with bcrypt
- Leaderboard data aggregation
- Admin user management

**Main Endpoints:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification
- `GET /api/auth/leaderboard` - Fetch leaderboard rankings

**Database Collections:**

- `users` - Stores user profiles, credentials, and admin status

---

### 2. 📝 Problem Service (Port 3002)

**Responsibility:** Managing coding problems, test cases, and problem metadata

**Key Features:**

- CRUD operations for coding problems
- Test case management
- Problem difficulty levels (Easy, Medium, Hard)
- Function signatures for different languages
- Problem categorization

**Main Endpoints:**

- `GET /api/problems` - List all problems with pagination
- `GET /api/problems/:id` - Get specific problem details
- `POST /api/problems` - Create new problem (Admin only)
- `PUT /api/problems/:id` - Update problem (Admin only)
- `DELETE /api/problems/:id` - Delete problem (Admin only)

**Database Collections:**

- `problems` - Stores problem statements, test cases, examples, and metadata

---

### 3. 📤 Submission Service (Port 3003)

**Responsibility:** Handling code submissions, evaluation coordination, and WebSocket management

**Key Features:**

- Code submission processing
- WebSocket server for real-time updates
- Submission history tracking
- Integration with evaluator service
- User-specific submission rooms
- Leaderboard data aggregation

**Main Endpoints:**

- `POST /api/submissions` - Submit code solution
- `GET /api/submissions/user/:userId` - Get user's submissions
- `GET /api/submissions/problem/:problemId` - Get problem submissions
- `GET /api/submissions/:id` - Get specific submission
- `GET /api/submissions/leaderboard-data` - Aggregated data for leaderboard

**Database Collections:**

- `submissions` - Stores code, language, status, test results, and execution metrics

**WebSocket Features:**

- Real-time submission status updates
- User-specific rooms (`user-${userId}`)
- Automatic connection on user login
- Live evaluation progress

---

### 4. ⚡ Evaluator Service (Port 3004)

**Responsibility:** Code execution, compilation, and testing

**Key Features:**

- Multi-language code execution (JavaScript, C++)
- Secure code evaluation
- Test case validation
- Performance metrics (runtime, memory)
- Logic validation for different problem types
- Error handling and timeout management

**Main Endpoints:**

- `POST /api/evaluate` - Evaluate submitted code against test cases

**Evaluation Process:**

1. Receives code, language, and test cases
2. Compiles/validates syntax
3. Runs code against each test case
4. Measures execution time and memory usage
5. Validates output against expected results
6. Returns comprehensive evaluation results

---

## 🌐 Frontend (Port 5173/5174)

**Technology Stack:**

- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- React Router for navigation
- Socket.IO client for WebSocket communication

**Key Pages:**

- **Login/Register** - User authentication
- **Problems** - Browse and filter coding problems
- **Problem Detail** - Solve individual problems with code editor
- **Submissions** - View submission history and status
- **Leaderboard** - Competitive rankings
- **Admin Panel** - Problem management (Admin only)

---

## 🔄 Complete Application Flow

### 1. 🔐 User Authentication Flow

```
User Registration/Login
        ↓
Frontend sends credentials to User Service (3001)
        ↓
User Service validates and creates JWT token
        ↓
Frontend stores token and connects to WebSocket (3003)
        ↓
User is redirected to Problems page
```

### 2. 📋 Problem Browsing Flow

```
User visits Problems page
        ↓
Frontend requests problem list from Problem Service (3002)
        ↓
Problem Service returns paginated problems with metadata
        ↓
Frontend displays problems with difficulty badges and filters
```

### 3. 💻 Code Submission Flow (Real-time with WebSocket)

```
User selects a problem and writes code
        ↓
User clicks "Submit Solution"
        ↓
Frontend sends code to Submission Service (3003)
        ↓
Submission Service:
  1. Creates submission record with "pending" status
  2. Returns submission ID immediately
  3. Emits "Evaluating..." toast notification via WebSocket
        ↓
Submission Service calls Evaluator Service (3004)
        ↓
Evaluator Service:
  1. Receives code and test cases
  2. Compiles/validates code
  3. Runs against each test case
  4. Calculates performance metrics
  5. Returns evaluation results
        ↓
Submission Service:
  1. Updates submission with results
  2. Emits real-time update via WebSocket to user's room
        ↓
Frontend receives WebSocket event and shows:
  - ✅ "Solution Accepted!" (if all tests pass)
  - ❌ "Wrong Answer" (if tests fail)
  - 💥 "Runtime Error" (if code crashes)
        ↓
Submission appears in user's history immediately
```

### 4. 🏆 Leaderboard Flow

```
User visits Leaderboard page
        ↓
Frontend requests leaderboard data from User Service (3001)
        ↓
User Service requests aggregated data from Submission Service (3003)
        ↓
Submission Service uses MongoDB aggregation to calculate:
  - Total submissions per user
  - Accepted submissions per user
  - Unique problems solved per user
        ↓
User Service combines user data with submission stats
        ↓
Frontend displays ranked leaderboard with current user highlighted
```

---

## 🔌 WebSocket Implementation

### Connection Flow

```
User logs in → Frontend connects to WebSocket → User joins personal room
```

### Real-time Events

1. **Connection**: `socket.emit('join-user-room', userId)`
2. **Submission Update**: `socket.to('user-${userId}').emit('submission-updated', data)`
3. **Status Changes**: Automatically broadcasted when evaluation completes

### Event Data Structure

```javascript
{
  submissionId: "submission_id",
  status: "accepted" | "wrong_answer" | "runtime_error",
  runtime: 150, // milliseconds
  testResults: [...],
  submission: { /* full submission object */ }
}
```

---

## 📊 Database Schema

### MongoDB Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Problems Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  difficulty: "Easy" | "Medium" | "Hard",
  examples: [{ input: String, output: String, explanation: String }],
  testCases: [{ input: String, expectedOutput: String }],
  functionSignatures: {
    javascript: String,
    cpp: String
  },
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Submissions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (User),
  problemId: ObjectId (Problem),
  code: String,
  language: "javascript" | "cpp",
  status: "pending" | "accepted" | "wrong_answer" | "runtime_error",
  runtime: Number, // milliseconds
  memory: Number, // bytes
  testResults: [{
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    runtime: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 How to Run the Project

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Development Setup

1. **Install Dependencies**

   ```bash
   npm install
   cd frontend && npm install
   cd ../services/user-service && npm install
   cd ../problem-service && npm install
   cd ../submission-service && npm install
   cd ../evaluator-service && npm install
   ```

2. **Environment Configuration**
   Each service has its own `.env` file:

   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   PORT=service_port
   ```

3. **Start All Services**
   ```bash
   npm run dev
   ```

### Port Configuration

- **Frontend**: 5173 (or 5174 if 5173 is busy)
- **User Service**: 3001
- **Problem Service**: 3002
- **Submission Service**: 3003
- **Evaluator Service**: 3004

---

## 🔧 Development Commands

```bash
# Start all services
npm run dev

# Start individual services
npm run dev:frontend
npm run dev:user-service
npm run dev:problem-service
npm run dev:submission-service
npm run dev:evaluator-service

# Seed database with sample data
node seed.js
```

---

## 🚦 API Response Format

All APIs follow a consistent response format:

```javascript
{
  success: boolean,
  data?: any,
  message?: string,
  error?: string
}
```

### Success Response

```javascript
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **CORS Configuration**: Proper cross-origin settings
4. **Input Validation**: Server-side validation for all inputs
5. **Admin Protection**: Role-based access control
6. **Rate Limiting**: Prevents API abuse (can be added)

---

## 🎯 Key Features Summary

### ✅ Implemented Features

- **Multi-language Support**: JavaScript and C++
- **Real-time Updates**: WebSocket-powered instant feedback
- **Competitive Leaderboard**: Ranking system based on problems solved
- **Comprehensive Testing**: Multiple test cases per problem
- **Performance Metrics**: Runtime and memory tracking
- **User Management**: Registration, login, admin roles
- **Problem Management**: CRUD operations for problems
- **Submission History**: Complete tracking of all attempts
- **Responsive Design**: Mobile-friendly interface
- **Toast Notifications**: Beautiful real-time feedback

### 🔮 Future Enhancements

- **Docker Support**: Container deployment
- **More Languages**: Python, Java, Go support
- **Contest Mode**: Timed programming contests
- **Discussion Forums**: Community problem discussions
- **Hints System**: Progressive hints for problems
- **Code Reviews**: Peer code review system
- **Analytics Dashboard**: Performance insights

---

## 🛠️ Technology Stack

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **MongoDB**: NoSQL database
- **Socket.IO**: WebSocket implementation
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### Frontend

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS
- **React Router**: Client-side routing
- **Socket.IO Client**: WebSocket client
- **Lucide React**: Icon library

### Development Tools

- **Concurrently**: Run multiple services
- **tsx**: TypeScript execution
- **ESLint**: Code linting
- **Prettier**: Code formatting (can be added)

---

## 📈 Performance Considerations

1. **Database Indexing**: Proper indexes on frequently queried fields
2. **Aggregation Pipelines**: Efficient data aggregation for leaderboard
3. **Connection Pooling**: MongoDB connection optimization
4. **WebSocket Rooms**: Targeted message delivery
5. **Code Caching**: Function signature caching
6. **Error Handling**: Comprehensive error management

---

## 🎉 Conclusion

The Codo-Leet platform demonstrates a modern, scalable approach to building coding platforms with:

- **Microservices Architecture** for modularity and scalability
- **Real-time Communication** for instant user feedback
- **Comprehensive Testing** for code validation
- **Competitive Features** for user engagement
- **Clean Architecture** for maintainability

This platform can serve as a foundation for building larger coding education or competition platforms, with easy extensibility for additional features and programming languages.
