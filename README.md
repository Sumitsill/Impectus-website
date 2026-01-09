# Care4You - Advanced Telemedicine Platform

Care4You is a next-generation healthcare platform designed to bridge the gap between rural communities and specialist healthcare providers. Built with a "premium-first" design philosophy, it combines AI-driven clinical intelligence with high-performance real-time communication.

## 🚀 Technology Stack

### Frontend (User Interface)
- **Core**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) for ultra-fast HMR and bundling.
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) for a utility-first, responsive design.
- **3D Graphics**: [Three.js](https://threejs.org/) with [React Three Fiber](https://r3f.docs.pmnd.rs/) for immersive landing page effects.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid UI transitions and micro-interactions.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, lightweight clinical iconography.
- **State Management**: React Context API for global states like Internationalization (i18n).

### Backend (Server Infrastructure)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) for high-performance API routing.
- **Database**: [PostgreSQL](https://www.postgresql.org/) for ACID-compliant clinical data management.
- **Real-time**: [Socket.io](https://socket.io/) for instant messaging and session coordination.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) with `bcryptjs` for secure clinical access.
- **Security**: `express-rate-limit` and `cors` for cross-origin resource protection.

### AI & Specialized Services
- **Generative AI**: [Google Gemini 1.5 Flash](https://aistudio.google.com/) for real-time consultation transcription and "Discovery Points" extraction.
- **ML Service**: Python-based microservice for specialized medical data processing.
- **PDF Engine**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) for dynamic clinical report generation.
- **Peer-to-Peer**: [Simple-Peer](https://github.com/feross/simple-peer) for direct WebRTC video streaming.

## 📱 Features
- **Global Language Selector**: Dynamic switching between English, Hindi (हिंदी), and Bengali (বাংলা).
- **Clinical AI Scribe**: Real-time extraction of symptoms and prescriptions during consultations.
- **Doctor Dashboard**: Specialized panels for Ayurvedic, Homeopathic, and General Physicians.
- **Secure Records**: End-to-end encrypted storage of patient health data.
- **Interactive Branding**: Glassmorphic UI with dynamic light pillar backgrounds.

## 🛠️ Getting Started

1. **Client Setup**:
   ```bash
   cd Impectus
   npm install
   npm run dev
   ```

2. **Server Setup**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **ML Service (Optional)**:
   ```bash
   cd ml_service
   pip install -r requirements.txt
   python main.py
   ```

## 📄 License
Proprietary System • Propriety of Care4You Healthcare.
