# AI Agent Selector

A comprehensive Vue 3 + TypeScript application that provides a unified interface for interacting with multiple AI agents and services. This application features a modern dashboard with various AI-powered functionalities including chatbots, workflow automation, analytics, and financial tools.

## 📋 Features

### 🤖 AI Agent Management
- **Multi-Agent Interface**: Seamlessly switch between different AI agents
- **Chatbot Integration**: Customer support and program advisor chatbots
- **Workflow Automation**: N8N integration for automated workflows
- **Real-time Chat**: Interactive chat interface with AI agents

### 📊 Dashboard & Analytics
- **Analytics Dashboard**: Data visualization and insights
- **Finance Dashboard**: Financial tracking and analysis
- **Crypto Dashboard**: Cryptocurrency monitoring and analytics
- **Interactive Charts**: ApexCharts integration for data visualization

### 🛠️ Additional Tools
- **Data Management**: CSV parsing and Excel export capabilities
- **File Handling**: PDF processing and image manipulation
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
├── AI Agent Component/     # Core AI agent functionality
│   ├── AIBasepage.vue     # Main agent interface
│   ├── AISelectorBar.vue  # Agent selection component
│   ├── AIChatArea.vue     # Chat interface
│   ├── chatbot/           # Chatbot implementations
│   └── workflow/          # Workflow automation
├── components/            # Reusable Vue components
├── views/                 # Page components
│   ├── index.vue         # Home dashboard
│   ├── analytics.vue     # Analytics dashboard
│   ├── finance.vue       # Finance dashboard
│   └── crypto.vue        # Crypto dashboard
├── stores/               # Pinia state management
├── router/              # Vue Router configuration
├── layouts/             # Layout components
└── locales/             # Internationalization
```

## 🎯 Key Components

### AI Agent System
The core of the application revolves around the AI Agent system which provides:
- Dynamic agent selection and switching
- Integrated chat interface
- Support for different agent types (customer support, program advisor, etc.)
- Workflow automation capabilities

### Dashboard Modules
- **Analytics**: Comprehensive data analysis and visualization
- **Finance**: Financial tracking, budgeting, and reporting
- **Crypto**: Cryptocurrency portfolio management and market analysis

## 🔧 Configuration

### Development Setup
The application uses Vite for fast development and hot reloading. Configuration files:
- `vite.config.ts` - Vite configuration
- `tailwind.config.cjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Environment Variables
Create a `.env` file in the root directory for environment-specific configurations.

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
