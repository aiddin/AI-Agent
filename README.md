# AI Agent Selector

A comprehensive Vue 3 + TypeScript application that provides a unified interface for interacting with multiple AI agents and services. This application features a modern dashboard with various AI-powered functionalities including chatbots, workflow automation, analytics, and financial tools.

## 📋 Features

### 🤖 AI Agent Management
- **Multi-Agent Interface**: Seamlessly switch between different AI agents
- **Chatbot Integration**: Customer support, program advisor, pet trainer, and mortgage assistant chatbots
- **Workflow Automation**: N8N webhook integration for automated workflows
- **Real-time Chat**: Interactive chat interface with AI agents
- **Document Chat**: AI-powered document analysis with multi-format support

### 📊 Dashboard & Analytics
- **Analytics Dashboard**: Data visualization and insights
- **Finance Dashboard**: Financial tracking and analysis
- **Crypto Dashboard**: Cryptocurrency monitoring and analytics
- **Interactive Charts**: ApexCharts integration for data visualization

### 🛠️ Workflow Tools
- **Applicant Scoring**: UTP applicant evaluation and ranking system
- **Issue Classification**: Petbacker customer support ticket classification
- **Purchase Order Extraction**: Automated purchase order information extraction
- **Data Cleansing**: Multi-source data comparison and consolidation
- **Receipt Claim Analyzer**: Receipt analysis for HR expense claims
- **Document Chat**: Upload and chat with documents (PDF, images, audio, video, text)

### 📁 File Processing Capabilities
- **PDF**: Native browser PDF viewer and pdfjs-dist integration
- **Images**: JPG, PNG, GIF, BMP, WebP, SVG preview
- **Audio**: MP3, WAV, OGG, M4A player with native HTML5 controls
- **Video**: MP4, WebM, MOV playback with native controls
- **Text Files**: TXT, MD, JSON, XML, CSV with syntax highlighting
- **Documents**: DOC, DOCX, XLS, XLSX support via AI chat

### 🗺️ Additional Features
- **Data Management**: CSV parsing and Excel export capabilities
- **Maps Integration**: Leaflet maps with geolocation support
- **Calendar**: FullCalendar integration for scheduling
- **Form Management**: Advanced form handling with validation

## 🚀 Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Components**: Radix Vue, Headless UI
- **Charts**: ApexCharts
- **Mobile**: Capacitor for mobile app deployment

## 📦 Installation

### Prerequisites
- Node.js 22.0.0 or higher
- npm or yarn package manager

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd AI-Agent

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── AI Agent Component/           # Core AI agent functionality
│   ├── AIBasepage.vue           # Main agent interface
│   ├── AISelectorBar.vue        # Agent selection sidebar
│   ├── AIChatArea.vue           # Chat interface
│   ├── chatbot/                 # N8N webhook-based chatbots
│   │   ├── chatbot-configs.js   # Webhook URLs and configurations
│   │   └── chatbot-agent/       # Individual chatbot components
│   │       ├── PetbackerCS.vue
│   │       ├── ProgramAdvisor.vue
│   │       ├── PetSitterTrainer.vue
│   │       ├── MortgageApplicationData.vue
│   │       └── MortgageApplicationDocument.vue
│   └── workflow/                # Workflow automation tools
│       ├── Applicant_Scoring/
│       ├── Issue_Classification/
│       ├── Purchase Order/
│       ├── Data Cleansing/
│       ├── Receipt Claim Analyzer/
│       └── Document Chat/       # ⭐ NEW: Multi-format document viewer
├── components/                  # Reusable Vue components
│   ├── layout/                 # Layout components
│   │   ├── Sidebar.vue        # Main navigation sidebar
│   │   ├── Header.vue
│   │   └── Footer.vue
│   └── icon/                  # Icon components
├── views/                      # Page components
│   ├── index.vue              # Home dashboard
│   ├── analytics.vue          # Analytics dashboard
│   ├── finance.vue            # Finance dashboard
│   └── crypto.vue             # Crypto dashboard
├── stores/                    # Pinia state management
├── router/                    # Vue Router configuration
├── layouts/                   # App layouts (app-layout, auth-layout)
└── locales/                   # i18n translations
```

## 🎯 Key Components

### AI Agent System
The core of the application revolves around the AI Agent system which provides:
- Dynamic agent selection and switching via sidebar navigation
- Integrated chat interface with N8N webhooks
- Support for multiple agent types:
  - **Customer Support**: Petbacker FAQ and booking assistance
  - **Program Advisor**: Course and program recommendations
  - **Pet Trainer**: Pet sitter training guidance
  - **Mortgage Assistant**: Mortgage application help
- Real-time workflow automation capabilities

### Workflow Automation System
All workflows connect to N8N webhooks at `https://workflow.forwen.com/webhook/*`:
- **Applicant Scoring**: Multi-step scoring with candidate evaluation and program rankings
- **Issue Classification**: AI-powered support ticket categorization
- **Purchase Order Extraction**: Document analysis and data extraction
- **Data Cleansing**: Multi-source data reconciliation
- **Receipt Claim**: Expense receipt processing for HR
- **Document Chat**: ⭐ **NEW** - Interactive document analysis with preview

### Document Chat Feature (NEW)
A comprehensive document viewer and AI chat interface supporting:
- **3-panel layout**: File management (left) | Document preview (center) | AI chat (right)
- **Multi-format support**: PDF, Images, Audio, Video, Text files
- **Real-time preview**: Native browser rendering for all supported formats
- **AI interaction**: Ask questions about uploaded documents
- **File management**: Upload multiple files and switch between them
- **No external dependencies**: Uses HTML5 native players and FileReader API

### Dashboard Modules
- **Analytics**: Comprehensive data analysis and visualization
- **Finance**: Financial tracking, budgeting, and reporting
- **Crypto**: Cryptocurrency portfolio management and market analysis

## 🔧 Configuration

### Development Setup
The application uses Vite for fast development and hot reloading. Configuration files:
- `vite.config.ts` - Vite configuration with path aliases
- `tailwind.config.cjs` - Tailwind CSS with custom color palette
- `tsconfig.json` - TypeScript configuration (allowJs: true for mixing .js/.ts)
- `CLAUDE.md` - Project instructions for Claude Code AI assistant

### N8N Webhook Configuration
All chatbots and workflows use N8N webhooks defined in:
- `src/AI Agent Component/chatbot/chatbot-configs.js` - Chatbot webhook URLs
- Individual workflow components - Each has its own webhook endpoint

### Environment Variables
Create a `.env` file in the root directory for environment-specific configurations.

### Testing Setup
```bash
# Run Playwright E2E tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (browser visible)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

## 📱 Mobile Support

The application includes Capacitor configuration for mobile deployment:
- Android support via `@capacitor/android`
- Camera integration with `@capacitor/camera`
- Geolocation services with `@capacitor/geolocation`

## 🌐 Deployment

### Web Deployment
```bash
npm run build
# Deploy the contents of 'dist' folder to your hosting service
```

### Vercel Deployment
The project includes `vercel.json` configuration for easy Vercel deployment.

## 🛠️ Development

### Recommended IDE Setup
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Enable Volar's "Take Over Mode" for better TypeScript support in Vue files

### Type Support
TypeScript support is configured for Vue components. For optimal development experience:
1. Disable the built-in TypeScript extension in VS Code
2. Enable Volar's Take Over mode
3. Reload the VS Code window

### Project Commands
```bash
# Development
npm run dev              # Start dev server (default: http://localhost:5173)

# Build
npm run build           # TypeScript type-check + production build

# Preview
npm run preview         # Preview production build locally

# Testing
npm run test            # Run Playwright tests
npm run test:ui         # Run tests with UI
npm run test:headed     # Run tests in browser
npm run test:debug      # Debug tests
npm run test:report     # View test results
```

### Important Development Notes
- Node.js version **22.0.0** is required (specified in package.json engines)
- TypeScript `noImplicitAny: false` allows flexible typing
- Path alias `@/` maps to `src/` directory
- The app uses class-based dark mode (toggled via `dark` class on body)
- N8N chat widgets are injected into the DOM programmatically
- Clean up N8N chat elements when switching between agents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the project repository.

---

*Built with ❤️ using Vue 3, TypeScript, and modern web technologies*
