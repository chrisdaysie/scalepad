# ScalePad - Lifecycle Manager X (LMX)

A comprehensive dashboard and management system for ScalePad's client lifecycle management, featuring QBR reports, assessments, and real-time data integration.

## 🎯 Project Overview

ScalePad LMX is a Next.js-based application that provides:

- **📊 QBR Reports**: Quarterly Business Review reports with live data integration
- **📋 Assessments**: Interactive client assessments with AI-powered recommendations
- **🔗 API Integration**: Real-time data from external services (Cork, etc.)
- **📈 Analytics**: Performance metrics and business intelligence
- **🎨 Modern UI**: Beautiful, responsive interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd scalepad

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables
Create a `.env.local` file with:
```env
# Cork API Integration
CORK_API_KEY=your_cork_api_key_here
CORK_BASE_URL=https://api.cork.dev

# Add other API keys as needed
```

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **State Management**: React hooks (useState, useEffect)
- **API**: Next.js API Routes

### Project Structure
```
scalepad/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── assessments/   # Assessment API endpoints
│   │   │   └── deliverables/  # QBR report API endpoints
│   │   ├── lmx/              # Main application pages
│   │   │   ├── assessments/  # Assessment system
│   │   │   ├── deliverables/ # QBR reports system
│   │   │   └── projects/     # Project management
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable React components
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
│   ├── deliverables-documentation.html
│   └── assessment-documentation.html
├── scripts/                 # CLI tools for management
└── README.md               # This file
```

### Core Systems

#### 1. QBR Reports System (`/lmx/deliverables/`)
- **Purpose**: Generate and display Quarterly Business Review reports
- **Features**: 
  - Individual platform reports (Cork, Backup Radar, etc.)
  - Comprehensive aggregate reports
  - Live data integration with external APIs
  - Interactive refresh controls
- **Data Flow**: JSON templates → API data → Rendered reports
- **Documentation**: [QBR Documentation](./src/app/lmx/deliverables/README.md)

#### 2. Assessment System (`/lmx/assessments/`)
- **Purpose**: Conduct client assessments with AI-powered recommendations
- **Features**:
  - Multiple assessment types (AI Readiness, Cyber Security, etc.)
  - Dynamic scoring and recommendations
  - PDF generation
  - Result tracking
- **Data Flow**: Assessment JSON → User responses → AI analysis → Recommendations
- **Documentation**: [Assessment Documentation](./src/app/lmx/assessments/README.md)

#### 3. API Integration Layer
- **Cork Integration**: Real-time security metrics and device data
- **Assessment APIs**: Dynamic content and AI recommendations
- **Data Processing**: Template-based approach for vendor collaboration

### Data Architecture

#### QBR Reports
```
JSON Templates → API Data Fetch → Template Processing → Rendered Report
     ↓              ↓                    ↓                ↓
Static Content  Live Metrics      Placeholder Replace  User Interface
```

#### Assessments
```
Assessment JSON → User Input → AI Processing → Recommendations → Results
      ↓             ↓            ↓              ↓              ↓
Question Set   Responses    Analysis Engine   Suggestions   PDF Report
```

## 🛠️ Development

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# QBR Report Management
node scripts/add-qbr-report.js <id> <company> [type]
node scripts/remove-qbr-report.js <id>

# Assessment Management  
node scripts/add-assessment.js <name>
node scripts/remove-assessment.js <name>
```

### Adding New Features
1. **QBR Reports**: Use the CLI scripts or follow the [QBR documentation](./src/app/lmx/deliverables/README.md)
2. **Assessments**: Use the CLI scripts or follow the [Assessment documentation](./src/app/lmx/assessments/README.md)
3. **API Routes**: Add new routes in `src/app/api/`
4. **Components**: Create reusable components in `src/components/`

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables for Production
Ensure these are set in your deployment environment:
- `CORK_API_KEY`: Cork API authentication
- `CORK_BASE_URL`: Cork API base URL
- Any other API keys for integrations

## 📚 Documentation

- **QBR Reports**: [Deliverables Documentation](./src/app/lmx/deliverables/README.md)
- **Assessments**: [Assessment Documentation](./src/app/lmx/assessments/README.md)
- **API Reference**: [Deliverables API Docs](./public/deliverables-documentation.html)
- **Assessment API**: [Assessment API Docs](./public/assessment-documentation.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to ScalePad.

---

**Built with ❤️ by the ScalePad team**
