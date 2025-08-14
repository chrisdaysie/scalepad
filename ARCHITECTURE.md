# ScalePad LMX - Architecture Documentation

## 🏗️ System Architecture Overview

ScalePad LMX is a modern web application built with Next.js that provides comprehensive client lifecycle management through QBR reports, assessments, and real-time data integration.

## 🎯 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   External      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • QBR Reports   │    │ • Assessment    │    │ • Cork API      │
│ • Assessments   │    │   APIs          │    │ • Other APIs    │
│ • Dashboard     │    │ • QBR APIs      │    │                 │
│ • Analytics     │    │ • Data Fetch    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static        │    │   File System   │    │   Data Storage  │
│   Assets        │    │                 │    │                 │
│                 │    │ • JSON Configs  │    │ • Assessment    │
│ • Documentation │    │ • Templates     │    │   Results       │
│ • Images        │    │ • Reports       │    │ • User Data     │
│ • Styles        │    │                 │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🏛️ Component Architecture

### 1. Frontend Layer (Next.js App Router)

#### Page Structure
```
src/app/
├── page.tsx                    # Landing page
├── lmx/                       # Main application
│   ├── page.tsx              # LMX dashboard
│   ├── deliverables/         # QBR reports system
│   │   ├── page.tsx         # Reports listing
│   │   ├── qbr/[id]/        # Dynamic QBR viewer
│   │   └── documentation/   # QBR documentation
│   ├── assessments/         # Assessment system
│   │   ├── page.tsx         # Assessment listing
│   │   ├── run/[id]/        # Assessment runner
│   │   ├── results/[id]/    # Assessment results
│   │   └── report/[id]/     # Assessment reports
│   └── projects/            # Project management
└── api/                     # API routes
    ├── assessments/         # Assessment APIs
    └── deliverables/        # QBR APIs
```

#### Component Hierarchy
```
App Layout
├── Navigation
├── Main Content
│   ├── QBR Reports
│   │   ├── Report List
│   │   ├── Report Viewer
│   │   └── Live Controls
│   └── Assessments
│       ├── Assessment List
│       ├── Assessment Runner
│       └── Results Display
└── Footer
```

### 2. API Layer (Next.js API Routes)

#### API Structure
```
src/app/api/
├── assessments/
│   ├── route.ts             # Assessment metadata
│   ├── [id]/
│   │   ├── route.ts         # Assessment data
│   │   ├── run/route.ts     # Run assessment
│   │   └── results/route.ts # Assessment results
└── deliverables/
    ├── route.ts             # QBR report metadata
    ├── cork/
    │   ├── clients/route.ts # Cork clients
    │   └── refresh/route.ts # Cork data refresh
    └── [id]/
        └── route.ts         # QBR report data
```

#### API Design Patterns
- **RESTful Design**: Standard HTTP methods and status codes
- **Type Safety**: Full TypeScript integration
- **Error Handling**: Consistent error responses
- **Data Validation**: Input validation and sanitization
- **Caching**: Strategic caching for performance

### 3. Data Layer

#### Data Sources
1. **Static JSON Files**: Configuration and templates
2. **External APIs**: Real-time data (Cork, etc.)
3. **File System**: Generated reports and results
4. **Environment Variables**: Configuration and secrets

#### Data Flow Patterns

##### QBR Reports Data Flow
```
1. JSON Template Load
   ↓
2. API Data Fetch (if live)
   ↓
3. Template Processing
   ↓
4. Data Merging
   ↓
5. Report Rendering
```

##### Assessment Data Flow
```
1. Assessment JSON Load
   ↓
2. User Input Collection
   ↓
3. AI Processing
   ↓
4. Recommendation Generation
   ↓
5. Results Storage
   ↓
6. Report Generation
```

## 🔄 Data Architecture

### 1. QBR Reports Data Model

#### Individual Reports
```typescript
interface QBRReport {
  id: string;
  title: string;
  company: string;
  lastUpdated: number;
  dateRange: string;
  type: 'individual';
  description: string;
  executiveSummary: string;
  heroMetric: HeroMetric;
  categories: Category[];
  risks: Risk[];
  insights: Insight[];
  recommendations: Recommendation[];
}
```

#### Aggregate Reports
```typescript
interface AggregateQBRReport extends QBRReport {
  type: 'aggregate';
  businessOverview: BusinessOverview;
  accountTeam: AccountTeam;
  userDirectory: UserDirectory;
  assessments: AssessmentSection;
  analytics: AnalyticsSection;
  assets: AssetsSection;
  roadmap: RoadmapSection;
}
```

### 2. Assessment Data Model

#### Assessment Template
```typescript
interface AssessmentTemplate {
  assessment_template_create_payload: {
    title: string;
    description: string;
    categories: Category[];
  };
}
```

#### Assessment Results
```typescript
interface AssessmentResult {
  id: string;
  assessmentId: string;
  timestamp: number;
  responses: Response[];
  scores: Score[];
  recommendations: Recommendation[];
}
```

## 🔌 Integration Architecture

### 1. Cork API Integration

#### Integration Pattern
- **JSON-First Approach**: Templates with placeholders
- **Real-time Data**: Live API calls for current metrics
- **Client Selection**: Multi-tenant support
- **Caching Strategy**: Intelligent caching for performance

#### Data Processing Pipeline
```
1. Template Load
   ↓
2. Placeholder Detection
   ↓
3. API Data Fetch
   ↓
4. Data Transformation
   ↓
5. Template Processing
   ↓
6. Report Generation
```

### 2. Assessment AI Integration

#### AI Processing Pipeline
```
1. User Responses
   ↓
2. Data Validation
   ↓
3. AI Analysis
   ↓
4. Recommendation Generation
   ↓
5. Score Calculation
   ↓
6. Report Creation
```

## 🎨 UI/UX Architecture

### Design System
- **Framework**: Tailwind CSS 4
- **Components**: Custom React components
- **Icons**: SVG-based icon system
- **Typography**: Inter font family
- **Colors**: Consistent color palette
- **Spacing**: Systematic spacing scale

### Responsive Design
- **Mobile-First**: Progressive enhancement
- **Breakpoints**: Standard Tailwind breakpoints
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch-Friendly**: Optimized for mobile interaction

### Accessibility
- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant contrast ratios

## 🔒 Security Architecture

### Authentication & Authorization
- **Environment Variables**: Secure API key storage
- **API Key Management**: Rotating keys and access control
- **Input Validation**: Sanitization and validation
- **CORS Policy**: Proper cross-origin configuration

### Data Security
- **HTTPS Only**: Secure communication
- **API Rate Limiting**: Protection against abuse
- **Data Validation**: Input sanitization
- **Error Handling**: Secure error messages

## 📊 Performance Architecture

### Optimization Strategies
1. **Static Generation**: Pre-built pages where possible
2. **Dynamic Imports**: Code splitting for better performance
3. **Image Optimization**: Next.js image optimization
4. **Caching**: Strategic caching at multiple levels
5. **Bundle Optimization**: Tree shaking and minification

### Monitoring & Analytics
- **Performance Metrics**: Core Web Vitals tracking
- **Error Monitoring**: Error tracking and reporting
- **Usage Analytics**: User behavior analysis
- **API Monitoring**: Endpoint performance tracking

## 🚀 Deployment Architecture

### Vercel Deployment
- **Automatic Deployments**: Git-based deployment
- **Environment Management**: Secure environment variables
- **Edge Functions**: Global CDN distribution
- **Preview Deployments**: Branch-based previews

### Environment Strategy
- **Development**: Local development environment
- **Staging**: Pre-production testing
- **Production**: Live application deployment

## 🔧 Development Architecture

### Development Workflow
1. **Feature Development**: Branch-based development
2. **Code Review**: Pull request workflow
3. **Testing**: Automated and manual testing
4. **Deployment**: Automated deployment pipeline

### Tooling
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit validation

## 📈 Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side state
- **CDN Distribution**: Global content delivery
- **API Scaling**: Independent API scaling
- **Database Scaling**: Future database considerations

### Performance Optimization
- **Caching Strategy**: Multi-level caching
- **Code Splitting**: Dynamic imports
- **Bundle Optimization**: Tree shaking
- **Image Optimization**: Next.js image handling

## 🔮 Future Architecture Considerations

### Planned Enhancements
1. **Database Integration**: Persistent data storage
2. **User Authentication**: User management system
3. **Real-time Features**: WebSocket integration
4. **Advanced Analytics**: Business intelligence features
5. **Mobile App**: React Native application

### Technical Debt
1. **API Documentation**: OpenAPI/Swagger specs
2. **Testing Coverage**: Comprehensive test suite
3. **Monitoring**: Advanced monitoring and alerting
4. **CI/CD**: Enhanced deployment pipeline

---

*This architecture documentation is a living document and should be updated as the system evolves.*
