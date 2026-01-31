<div align="center">

# 🎓 College Companion

**Your AI-Powered Academic Success Platform**

[![GitHub stars](https://img.shields.io/github/stars/Yugenjr/College_Companion?style=social)](https://github.com/Yugenjr/College_Companion/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Yugenjr/College_Companion?style=social)](https://github.com/Yugenjr/College_Companion/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Yugenjr/College_Companion)](https://github.com/Yugenjr/College_Companion/issues)
[![GitHub license](https://img.shields.io/github/license/Yugenjr/College_Companion)](https://github.com/Yugenjr/College_Companion/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Yugenjr/College_Companion/pulls)

[Live Demo](https://mernproj1.vercel.app/) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Contributing](#-contributing)

</div>

---

## About

College Companion is a comprehensive full-stack MERN application designed to help college students excel academically. Powered by advanced AI technologies, it offers intelligent tools for attendance management, syllabus analysis, question generation, and collaborative studying—all in one platform.

### ✨ Why College Companion?

- **AI-Powered Intelligence** - Leverage Groq, Google Gemini, and Perplexity AI for smart academic assistance
- **Real-Time Collaboration** - Study together with Socket.io-powered study rooms
- **Beautiful UI** - Modern, responsive design with smooth animations
- **All-in-One Solution** - Everything a student needs in a single platform

---

## Features

### 🔐 Authentication & Security
- Firebase Authentication with Google Sign-In
- Secure user profiles and session management
- Seamless onboarding experience

### 🤖 AI-Powered Tools

| Feature | Description |
|---------|-------------|
| **Attendance Advisor** | AI-driven attendance tracking with smart predictions and recommendations |
| **Syllabus Essentials** | Extract key topics from syllabus images/PDFs using Perplexity AI |
| **Question Generator** | Generate exam questions automatically using Groq AI |
| **Survival Plan** | Create personalized study plans based on your schedule |

### 👥 Study Arena
- Create and join collaborative study rooms
- Real-time chat and collaboration
- Share room codes with classmates
- Socket.io integration for seamless communication

### 📊 Dashboard
- Personalized academic overview
- Profile management
- Quick access to all tools

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** Lucide React

</td>
<td valign="top" width="50%">

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** Firebase Auth
- **Real-time:** Socket.io
- **AI/ML:** Groq SDK, Google Gemini, Perplexity AI
- **OCR:** Tesseract.js

</td>
</tr>
</table>

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB Atlas** account
- **Firebase** project with authentication enabled
- **API Keys:** Groq, Google Gemini, Perplexity

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yugenjr/College_Companion.git
   cd College_Companion
   ```

2. **Install dependencies**
   ```bash
   # Root (Frontend)
   npm install

   # Main Backend
   cd backend
   npm install
   cd ..

   # Question Generator Backend
   cd backend-question-generator
   npm install
   cd ..
   ```

3. **Configure environment variables**

   Create `.env` in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:5000
   VITE_QUESTION_API_URL=http://localhost:5001
   ```

   Create `.env` in `backend/`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   GOOGLE_API_KEY=your_google_gemini_key
   PORT=5000
   ```

   Create `.env` in `backend-question-generator/`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   PORT=5001
   ```

4. **Start all services**

   **Option A - PowerShell Script (Windows):**
   ```powershell
   .\start-all.ps1
   ```

   **Option B - Manual Start:**
   ```bash
   # Terminal 1 - Main Backend
   cd backend
   npm start

   # Terminal 2 - Question Generator Backend
   cd backend-question-generator
   npm start

   # Terminal 3 - Frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Main Backend: `http://localhost:5000`
   - Question Generator: `http://localhost:5001`

---

## 💡 Usage

1. **Sign Up/Login** - Create an account or sign in with Google
2. **Complete Onboarding** - Set up your profile and preferences
3. **Explore Dashboard** - Access all features from the main dashboard
4. **Track Attendance** - Use Attendance Advisor for smart tracking
5. **Extract Essentials** - Upload syllabus to get key topics
6. **Generate Questions** - Create practice questions automatically
7. **Join Study Rooms** - Collaborate with peers in real-time

---

## 📡 API Documentation

### Main Backend (Port 5000)

### 📚 Complete API Reference

**→ [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)** ⭐ **START HERE**

#### API Endpoints by Module:

| Module | Endpoints | Details |
|--------|-----------|---------|
| 🔐 **Profile** | GET/PUT/POST/DELETE `/api/profile/*` | [View](./COMPLETE_API_REFERENCE.md#-1-profile-management-apiprofile) |
| 📚 **Survival Kit** | POST/GET/DELETE `/api/survival/*` | [View](./COMPLETE_API_REFERENCE.md#-2-survival-kit-apisurvival) |
| 📝 **Notes** | POST/GET/PUT/DELETE `/api/notes/*` | [View](./COMPLETE_API_REFERENCE.md#-3-notes-management-apinotes) |
| ❓ **Questions** | POST/GET/DELETE `/api/questions/*` | [View](./COMPLETE_API_REFERENCE.md#-4-questions-generator-apiquestions) |
| 📊 **Attendance** | POST/GET/DELETE `/api/attendance/*` | [View](./COMPLETE_API_REFERENCE.md#-5-attendance-advisor-apiattendance) |
| 📖 **Essentials** | POST/GET `/api/essentials/*` | [View](./COMPLETE_API_REFERENCE.md#-6-essentials-extractor-apiessentials) |
| 🔄 **Revision** | POST/GET `/api/revision/*` | [View](./COMPLETE_API_REFERENCE.md#-7-revision-planner-apirevision) |
| 💬 **Doubt Solver** | POST/GET `/api/doubt/*` | [View](./COMPLETE_API_REFERENCE.md#-8-doubt-solver-apidoubt) |
| 💻 **Study Room** | Socket.io `/api/study-room-chat` | [View](./COMPLETE_API_REFERENCE.md#-9-study-room-chat-sockio-apistudy-room-chat) |

#### Quick Examples:
```bash
# Get user profile
curl -X GET http://localhost:5000/api/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a note
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"..."}'
```

#### Other Documentation:
- [AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md) - Legacy reference
- [backend/API_DOCS.md](./backend/API_DOCS.md) - AI Attendance backend

### Question Generator Backend (Port 5001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/questions/generate` | POST | Generate questions |
| `/api/questions/history` | GET | Get generation history |

---

## 📁 Project Structure

```
College_Companion/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   ├── pages/                    # Page components
│   │   ├── Auth/                # Login, Register, Onboarding
│   │   ├── Dashboard/           # Dashboard pages
│   │   ├── AttendanceAdvisor/   # Attendance tracking
│   │   ├── SemesterSurvival/    # Study tools
│   │   ├── StudyArena/          # Collaborative rooms
│   │   └── Profile/             # User profile
│   ├── contexts/                # React Context providers
│   ├── hooks/                   # Custom React hooks
│   └── services/                # API services
├── backend/                     # Main backend (Port 5000)
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── config/                  # Configuration files
│   └── server.js               # Entry point
├── backend-question-generator/  # Question generator (Port 5001)
└── public/                      # Static assets
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🐛 Troubleshooting

<details>
<summary><b>MongoDB Connection Failed</b></summary>

- Verify your MongoDB URI in `.env` files
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database name is correct
</details>

<details>
<summary><b>Firebase Authentication Error</b></summary>

- Verify all Firebase credentials in `.env`
- Ensure Firebase Authentication is enabled in your Firebase console
- Check Google Sign-In is configured properly
</details>

<details>
<summary><b>Port Already in Use</b></summary>

- Kill processes on ports 5000, 5001, or 5173
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
- Linux/Mac: `lsof -ti:5000 | xargs kill -9`
</details>

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

<table>
<tr>
    <td align="center">
        <a href="https://github.com/Yugenjr">
            <img src="https://github.com/Yugenjr.png" width="100px;" alt="Yugendra N"/>
            <br />
            <sub><b>Yugendra N</b></sub>
            <br />
            <sub>Project Admin</sub>
        </a>
    </td>
</tr>
</table>

Want to contribute? Check out our [Contributing Guidelines](#-contributing) and add yourself to this list! 🎉

---

## 🙏 Acknowledgments

- **AI Services:** Groq, Google Gemini, Perplexity AI
- **Icons:** Lucide React
- **UI Inspiration:** Modern web design best practices
- **Community:** All our contributors and users

---

## 📧 Support

- 🐛 **Bug Reports:** [Open an Issue](https://github.com/Yugenjr/College_Companion/issues/new)
- 💡 **Feature Requests:** [Discussions](https://github.com/Yugenjr/College_Companion/discussions)
- 📖 **Documentation:** Check our [guides](./COMPLETE_SETUP_GUIDE.md)

---

<div align="center">

**Made with ❤️ for students, by students**

⭐ Star us on GitHub — it helps!

[⬆ Back to Top](#-college-companion)

</div>