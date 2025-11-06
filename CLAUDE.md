# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript application that provides a unified interface for interacting with multiple AI agents and workflow automation systems. The application connects to N8N webhooks for chatbot functionality and includes various workflow tools for document processing, data analysis, and customer support.

## Development Commands

### Standard Development
```bash
# Install dependencies (requires Node.js 22.0.0)
npm install

# Start development server (runs on http://localhost:5173 by default)
npm run dev

# Build for production (TypeScript type-check + Vite build)
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run Cypress E2E tests
npx cypress open

# Run Cypress tests headlessly
npx cypress run
```

## Architecture Overview

### Core AI Agent System

The application is structured around a two-component AI agent selector system:

1. **AISelectorBar** (`src/AI Agent Component/AISelectorBar.vue`) - Sidebar that displays available AI agents and workflows
2. **AIChatArea** (`src/AI Agent Component/AIChatArea.vue`) - Main content area that renders the selected agent's interface
3. **AIBasepage** (`src/AI Agent Component/AIBasepage.vue`) - Parent component that coordinates communication between selector and chat area

When an agent is selected, the AIBasepage component:
- Removes any existing N8N chat DOM elements
- Resets scroll positions across the document
- Updates the selectedAgent ref to trigger the chat area to render the new agent

### Chatbot System Architecture

All chatbots in this application follow a webhook-based architecture using the `@n8n/chat` package:

**Configuration Pattern** (`src/AI Agent Component/chatbot/chatbot-configs.js`):
- Each chatbot has a dedicated N8N webhook URL
- Configurations include webhook URLs, file upload settings, initial messages, and i18n strings
- Chatbots: MortgageApplicationData, MortgageApplicationDocument, PetbackerCS, PetSitterTrainer, ProgramAdvisor

**Component Pattern** (`src/AI Agent Component/chatbot/chatbot-agent/*.vue`):
- Each chatbot component imports its config from `chatbot-configs.js`
- Components dynamically load and mount the N8N chat widget via `@n8n/chat`
- File uploads are supported for specific agents (mortgage documents, program advisor)

**Key Implementation Details**:
- N8N chat widgets are injected into the DOM programmatically
- The chat interface must be cleaned up when switching between agents
- Webhook configurations use POST method with custom headers support

### Workflow System Architecture

Workflow components handle document processing and data analysis tasks:

**Available Workflows**:
- **Applicant Scoring** - Multi-step scoring system with candidate evaluation, program rankings, and document verification
- **Issue Classification** - Customer support ticket classification
- **Purchase Order** - Purchase order document viewing and processing
- **Data Cleansing** - Data quality improvement tools
- **Receipt Claim** - Receipt analysis and expense claim processing

**Routes** (`src/router/index.ts:66-91`):
- Workflows are accessed via `/workflow/[workflow-name]` routes
- Each workflow has its own dedicated route and component
- Lazy-loaded using webpack chunks for performance

### State Management

**Pinia Store** (`src/stores/index.ts`):
- Single store: `useAppStore` - Manages application-wide settings
- Controls: theme (light/dark/system), layout (full/boxed), menu style (vertical/horizontal), locale, RTL, animations, navbar position
- Persists settings to localStorage
- Theme changes are applied to document body class

**App Settings** (`src/app-setting.ts`):
- Initialization helper that loads saved preferences from localStorage
- Handles language switching with automatic RTL toggle for Arabic
- Controls page transition animations

### Routing Structure

**Layout System**:
- Two layouts: `app-layout` (main application) and `auth-layout` (authentication pages)
- Layout is determined by route meta field `layout: 'auth'`
- Default layout is 'app'

**Route Organization**:
- `/` - Home dashboard
- `/analytics`, `/finance`, `/crypto` - Dashboard pages
- `/apps/ai-agent` - Main AI agent interface (with optional :agentType parameter)
- `/chatbot/*` - Direct chatbot access routes
- `/workflow/*` - Workflow tool routes
- `/apps/*` - Additional application features (chat, calendar, notes, etc.)

### Styling and Theming

**Tailwind Configuration** (`tailwind.config.cjs`):
- Custom color palette: primary (blue), secondary (purple), success (green), danger (red), warning (orange), info (blue)
- Each color has DEFAULT, light, and dark-light variants
- Dark mode: class-based strategy (toggled via `dark` class on body)
- Typography plugin configured with custom heading sizes and margins
- Forms plugin with class strategy

**Path Alias**:
- `@/` resolves to `src/` directory (configured in vite.config.ts and tsconfig.json)

## Important Implementation Notes

### Working with Chatbots

When adding or modifying chatbot functionality:
1. Add webhook configuration to `chatbot-configs.js`
2. Create component in `chatbot/chatbot-agent/` that imports the config
3. Add route in `router/index.ts` under the chatbot routes section
4. The N8N chat widget handles all UI and API communication automatically

### Working with Workflows

When adding workflow components:
1. Create component in `src/AI Agent Component/workflow/[WorkflowName]/`
2. Add route in `router/index.ts` under workflow routes section (lines 66-91)
3. Ensure the component is added to the selector bar configuration

### TypeScript Configuration

- `noImplicitAny: false` - Allows implicit any types for flexibility
- `allowJs: true` - Allows mixing .js and .ts files (needed for chatbot-configs.js)
- Path alias `@/*` maps to `src/*`
- Module resolution: bundler (for Vite)

### N8N Integration

All chatbot and workflow integrations connect to `https://workflow.forwen.com/webhook/*` endpoints. When modifying webhook URLs:
- Update the configuration in `chatbot-configs.js` for chatbots
- For workflows, check individual component files for API endpoints
- Recent changes show webhook URLs are being updated for various features (see git commits)

### File Upload Handling

Chatbots that support file uploads (MortgageApplicationDocument, ProgramAdvisor):
- Set `allowFileUploads: true` in config
- Specify `allowedFilesMimeTypes` array (e.g., `['image/*', 'application/pdf']`)
- The N8N chat widget handles file upload UI and transmission

### Mobile Support

The application includes Capacitor configuration for mobile deployment:
- Camera and geolocation capabilities are integrated
- Test on mobile devices using Capacitor CLI commands (see Capacitor documentation)

## Common Patterns

### Importing AI Agent Components
```typescript
// Chatbot components - import from the chatbot/index.js barrel export
import { ProgramAdvisor, programAdvisorConfig } from '@/AI Agent Component/chatbot'

// Workflow components - import from the workflow/index.js barrel export
import { DocumentChat, PurchaseOrderViewer, DataCleansing } from '@/AI Agent Component/workflow'
```

### Adding a New Workflow
1. Create component directory in `src/AI Agent Component/workflow/[WorkflowName]/`
2. Create main component file (e.g., `WorkflowName.vue`)
3. Add export to `src/AI Agent Component/workflow/index.js`
4. Add route in `router/index.ts` under workflow routes section
5. Add card entry in `AISelectorBar.vue` under Workflow section
6. Test the workflow through the selector bar

### Adding a New Dashboard
1. Create view component in `src/views/`
2. Add route in `router/index.ts`
3. Ensure layout is set correctly (app or auth)
4. Add navigation link if needed

### Internationalization
- Locale files are in `src/locales/`
- Use vue-i18n for translations
- Language switching automatically handles RTL for Arabic
