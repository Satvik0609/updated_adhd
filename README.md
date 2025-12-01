# 🎯 ByteForge - FocusFlow

> **Real-Time Meeting Assistant for ADHD and Neurodivergent Students**

A comprehensive full-stack web application designed to help students with ADHD and Autism manage their studies more effectively. The platform processes notes, transcribes audio/video content, generates intelligent summaries, and provides an AI-powered chat assistant with context-aware responses.

---

## ✨ Features

### 📝 Process Notes
- Upload and process PDF and text files
- Extract text content from PDFs using advanced parsing
- Generate ADHD-friendly summaries with key concepts, digestible chunks, and study tips
- Automatically break down complex content into manageable sections
- View and manage all processed notes in your dashboard

### 🎙️ Live Recording
- Real-time meeting and lecture recording using browser MediaRecorder API
- Instant transcription of recorded audio using Groq Whisper
- Role-aware summaries tailored to user's perspective (Student, Developer, etc.)
- Automatic generation of study artifacts (notes, flashcards, quizzes)
- Save recordings and transcripts for future reference

### 🎥 Upload Media
- Upload audio/video files or provide YouTube URLs
- Multiple transcription strategies with intelligent fallback:
  - Supadata API for fast transcriptions (if API key provided)
  - AssemblyAI for comprehensive summaries (if API key provided)
  - Local transcription via Groq Whisper (default)
  - YouTube download via ytdl-core with Piped fallback
- Generate study materials from video content
- Role-aware summaries based on your needs

### 💬 Ask Questions (Smart Chat)
- Context-aware AI chat assistant powered by Groq LLaMA
- **Intelligent Resource Filtering**: Automatically detects when you mention specific resources
  - "PDF notes" → Uses only PDF/notes context
  - "YouTube video" → Uses only video/YouTube context
  - "Live recording" → Uses only recording context
  - No mention → Uses all available context
- Retrieves context from all previous sessions stored in database
- Real-time conversation with ADHD-friendly responses
- Chat history management

### 📅 Study Schedule Generator
- Create personalized study schedules based on exam dates
- Input topics and available study hours
- AI-generated day-by-day study plans with breaks and variety
- Optimized for ADHD-friendly learning patterns

### ✅ Task Manager
- Create, update, and delete tasks
- Set task priorities (high, medium, low)
- Add reminders with date and time
- Recurring reminders support
- Task categories and notes
- Filter tasks by status (active, completed, all)
- Browser notifications for reminders
- Email reminders (if SMTP configured)

### ⏱️ Pomodoro Timer
- Focus timer with customizable work/break intervals
- Visual countdown display
- Browser notifications
- Session tracking
- Integration with browser extension

### 🎯 Focus Mode
- Website blocking during focus sessions
- Distraction-free environment
- Syncs with Pomodoro timer
- Customizable blocked sites list

### 📊 Progress Dashboard
- Track your study progress
- View statistics: notes processed, recordings completed, study hours, tasks completed, pomodoros completed
- Level system based on activity points
- Streak tracking
- Visual progress indicators

### 📝 Quick Notes
- Fast note-taking interface
- Save and manage quick notes
- Local storage for instant access

### 🔥 Energy Tracker
- Track your energy levels throughout the day
- Identify peak productivity times
- Plan study sessions around your energy patterns

### 🏠 Dashboard
- Overview of all your activities
- Quick access to all features
- Statistics and insights
- Recent activity feed

### 🌐 Browser Extension
- Block distracting websites during focus sessions
- Integrated Pomodoro timer
- Browser notifications
- Auto-syncs with main app timer

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **Groq SDK** - AI/ML services (LLaMA 3.3 & Whisper)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **pdf-parse** (v2.4.5) - PDF text extraction
- **ytdl-core** - YouTube video downloading
- **Zod** - Input validation
- **Nodemailer** - Email reminders (optional)

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local instance or MongoDB Atlas account)
- **Groq API Key** ([Get one here](https://console.groq.com/))

### Optional (for enhanced features)
- **Supadata API Key** (for fast YouTube transcriptions)
- **AssemblyAI API Key** (for advanced transcriptions)
- **yt-dlp** (for YouTube download fallback)
- **FFmpeg** (for audio conversion)
- **SMTP credentials** (for email reminders)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ByteForge
```

### 2. Backend Setup

```bash
cd backend
npm install
```



### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
# If using local MongoDB, make sure it's running
mongod
```

---

## 🏃 Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```


**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```


### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login

### Features
- `POST /api/process-notes` - Upload and process PDF/text files
- `POST /api/transcribe` - Transcribe audio file
- `POST /api/transcribe-media` - Upload media or YouTube URL
- `POST /api/chat` - Chat with AI assistant
- `POST /api/study-schedule` - Generate study schedule

### Task Management
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks (optional: `?filter=active|completed|all`)
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/reminders/upcoming` - Get upcoming task reminders
- `POST /api/reminders/:taskId/send-email` - Send email reminder for a task

### Results Management
- `GET /api/results` - List all user results (optional: `?type=notes|media|transcribe`)
- `GET /api/results/:id` - Get specific result
- `DELETE /api/results/:id` - Delete result

### Health Check
- `GET /api/health` - Server status

**Note:** All endpoints except `/api/health` and `/api/auth/*` require JWT authentication.

---

## 🌐 Browser Extension

A browser extension is included for site blocking and focus timer integration:

### Installation
1. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. The extension is now installed!

### Features
- 🚫 Block distracting websites during focus sessions
- ⏱️ Integrated Pomodoro timer
- 🔔 Browser notifications
- 🎯 Auto-syncs with main app timer

### Usage
1. Click the extension icon in your browser toolbar
2. Add websites to block (e.g., facebook.com, twitter.com)
3. Start timer from the main app or extension
4. Blocked sites are automatically blocked during focus sessions

---

## 📁 Project Structure

```
ByteForge/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/          # Business logic
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── mediaController.js
│   │   │   ├── notesController.js
│   │   │   ├── scheduleController.js
│   │   │   ├── transcribeController.js
│   │   │   ├── resultsController.js
│   │   │   ├── taskController.js  # Task CRUD operations
│   │   │   └── reminderController.js  # Email reminders
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   ├── errorHandler.js   # Error handling
│   │   │   └── validateInput.js # Input validation
│   │   ├── models/
│   │   │   ├── userModel.js      # User schema
│   │   │   ├── resultModel.js    # Results schema
│   │   │   └── taskModel.js      # Task schema
│   │   ├── routes/
│   │   │   ├── api.js            # API routes
│   │   │   └── authRoutes.js    # Auth routes
│   │   ├── utils/
│   │   │   ├── aiGenerator.js    # Groq AI integration
│   │   │   ├── fileHandler.js    # File upload config
│   │   │   ├── tokenUtils.js     # JWT utilities
│   │   │   └── youtube.js        # YouTube processing
│   │   └── server.js             # Express app setup
│   ├── uploads/                  # Temporary file storage
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatAssistant.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EnergyTracker.jsx
│   │   │   ├── FocusMode.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MeetingAssistant.jsx
│   │   │   ├── MeetingTranscriber.jsx
│   │   │   ├── NotesProcessor.jsx
│   │   │   ├── PomodoroTimer.jsx
│   │   │   ├── ProgressDashboard.jsx
│   │   │   ├── QuickNotes.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StudySchedule.jsx
│   │   │   ├── TaskManager.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Icon.jsx
│   │   ├── hooks/
│   │   │   └── useToast.js       # Toast notification hook
│   │   ├── App.jsx               # Main component
│   │   ├── App.css               # Global styles
│   │   └── main.jsx              # React entry point
│   └── package.json
└── browser-extension/            # Browser extension for site blocking
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── background.js
    ├── content.js
    ├── blocked.html
    └── icons/
```

---

## 🔑 Key Features Explained

### Context-Aware Chat System

The chat assistant intelligently filters context based on your question:
- **Resource Detection**: Analyzes your question for keywords like "PDF", "YouTube", "recording"
- **Smart Filtering**: Only uses relevant stored data from previous sessions
- **Context Combination**: Merges current tab context with database context
- **Real-time Updates**: Automatically loads context from all previous sessions

### Multi-Strategy YouTube Processing

When processing YouTube videos, the system uses multiple fallback strategies:
1. **Supadata API** (if configured) - Fast transcriptions
2. **AssemblyAI** (if configured) - Comprehensive summaries
3. **ytdl-core** - Direct download with Piped fallback
4. **Groq Whisper** - Local transcription as final fallback

### PDF Processing

Uses pdf-parse v2.4.5 with the new PDFParse class API:
- Creates parser instance with buffer data
- Extracts text using `getText()` method
- Properly cleans up resources with `destroy()`
- Handles both PDF and plain text files

### Role-Aware Summaries

Transcriptions can be customized for different roles:
- **Student**: Focus on learning objectives, key concepts
- **Developer**: Technical details, code references
- **Manager**: Action items, decisions, follow-ups
- **Default**: General-purpose summary

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based auth (7-day expiration)
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Zod schema validation for all user inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Comprehensive error handling with user-friendly messages

---

## 📝 Usage Examples

### Processing a PDF
1. Navigate to "Process Notes" tab
2. Drag and drop or select a PDF file
3. Wait for processing (shows progress)
4. View the processed, ADHD-friendly breakdown
5. Access processed notes from your results

### Recording a Meeting
1. Go to "Live Recording" tab
2. Click "Start Recording"
3. Speak or let the meeting record
4. Click "Stop Recording"
5. View transcript and AI-generated summary
6. Save for future reference

### Asking Questions
1. Go to "Ask Questions" tab
2. Type: "Summarize the key points from my PDF notes"
3. The system automatically filters to only PDF context
4. Get a precise answer based on your notes

### YouTube Video Processing
1. Go to "Upload Media" tab
2. Paste a YouTube URL or upload a media file
3. System downloads and transcribes automatically
4. Get transcript, summary, flashcards, and quiz

### Managing Tasks
1. Go to "Task Manager" tab
2. Create tasks with priorities and categories
3. Set reminders with date/time
4. Receive browser notifications
5. Track completed tasks

### Using Pomodoro Timer
1. Go to "Pomodoro Timer" tab
2. Set work and break intervals
3. Start timer
4. Get notifications when sessions end
5. Track your focus sessions

---


<<<<<<< HEAD
### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas cluster is accessible
- Check `.env` file has correct `MONGO_URI`
- Verify network connectivity

### PDF Parsing Errors
- Ensure PDF files are not corrupted
- Check file size (max 50MB)
- Verify pdf-parse package is installed correctly

### YouTube Download Failures
- Check if video is publicly accessible
- Enable fallback options in `.env`
- Verify yt-dlp is installed if using that option
- System will automatically try fallback methods

### AI API Errors
- Verify `GROQ_API_KEY` is set correctly
- Check API quota limits
- Ensure internet connection is stable

### Authentication Issues
- Clear browser localStorage and try logging in again
- Check JWT_SECRET is set in backend `.env`
- Verify token expiration (7 days)

---

## 🤝 Contributing

This project was built as a hackathon submission. Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- **Groq** for providing fast AI inference
- **MongoDB** for database services
- All open-source libraries used in this project

---

## 📧 Contact
=======
>>>>>>> a3a5ba9a879022dd42d76489c6464bb4d84192e9

For questions or support, please open an issue on the repository.

---

**Built with ❤️ for ADHD and Neurodivergent Students**
