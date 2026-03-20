# Saraswati Classes Coaching - Frontend

A modern, responsive frontend for Saraswati Classes Coaching Institute built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

- ✅ **Responsive Design** - Mobile-first approach with desktop optimization
- ✅ **Authentication System** - Secure login/registration for admins and students
- ✅ **Course Management** - Browse and manage courses with detailed views
- ✅ **Test Series** - Explore and enroll in test series
- ✅ **Student Dashboard** - Personalized learning experience
- ✅ **Admin Dashboard** - Comprehensive management interface
- ✅ **Content Management** - Blogs, resources, gallery, and results
- ✅ **Contact System** - Inquiry forms with backend integration
- ✅ **Modern UI/UX** - Clean, intuitive interface with smooth animations
- ✅ **Accessibility** - WCAG compliant components
- ✅ **Performance Optimized** - Lazy loading and efficient rendering
- ✅ **Type Safety** - Full TypeScript support

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API, Zustand
- **Forms**: React Hook Form
- **Validation**: Zod
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Build Tool**: Vite
- **Testing**: Vitest

## Prerequisites

- Node.js 18+
- npm or bun
- Backend API running (port 3000)

## Quick Start

### 1. Clone and Setup

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env .env.local
```

Edit `.env.local` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will start at `http://localhost:8080` (as configured in vite.config.ts)

## 📁 Project Structure

```
frontend/
├── public/               # Static assets
│   └── robots.txt
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── admin/        # Admin-specific components
│   │   ├── banner/       # Banner components
│   │   ├── student/      # Student-specific components
│   │   ├── ui/           # Shadcn/ui components
│   │   ├── Layout.tsx    # Main layout component
│   │   └── ...           # Other shared components
│   ├── context/          # React Context providers
│   │   ├── AppContext.tsx
│   │   └── AuthContext.tsx
│   ├── data/             # Mock data and constants
│   │   └── mockData.ts
│   ├── hooks/            # Custom React hooks
│   │   └── use-mobile.tsx
│   ├── layouts/          # Layout wrappers
│   │   ├── AdminLayout.tsx
│   │   └── StudentLayout.tsx
│   ├── lib/              # Utility functions and configs
│   │   ├── api.ts        # Axios configuration
│   │   └── utils.ts
│   ├── pages/            # Route components
│   │   ├── AdminDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── ...           # Other pages
│   ├── router/           # Routing configuration
│   │   └── appRouter.tsx
│   ├── services/         # API service layer
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── testSeriesService.ts
│   │   └── ...           # Other service files
│   ├── store/            # Zustand stores
│   │   └── authStore.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── course.ts
│   │   ├── testSeries.ts
│   │   └── ...           # Other type files
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── ...               # Other config files
├── components.json       # Shadcn/ui configuration
├── package.json
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md
```

## 🔌 API Integration

The frontend is fully integrated with the backend API through a comprehensive service layer:

### Service Files
- `authService.ts` - Authentication and user profile
- `courseService.ts` - Course management
- `testSeriesService.ts` - Test series management
- `studentService.ts` - Student data and enrollment
- `bannerService.ts` - Banner/poster management
- `contactService.ts` - Contact form submission
- `contentService.ts` - Blogs, resources, and results
- `enrollmentService.ts` - Enrollment processing

### HTTP Client
- Axios instance with interceptors for authentication
- Automatic JWT token refresh
- Error handling and retry mechanisms
- Base URL configuration via environment variables

### Context Integration
- `AppContext.tsx` - Centralized application state
- `AuthContext.tsx` - Authentication state management
- Data synchronization between API and local state
- Fallback mechanisms for offline scenarios

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

### Component Library

Built with [shadcn/ui](https://ui.shadcn.com/) components:

- Accessible components following WAI-ARIA standards
- Pre-designed with Tailwind CSS classes
- Easy to customize and extend
- Consistent design language across the application

## Production Deployment

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

### Build Process

```bash
# Create production build
npm run build

# The build artifacts will be in the dist/ directory
# Serve the dist/ directory with a static server
```

## Security Features

- ✅ Secure HTTP client with authentication interceptors
- ✅ JWT token management and storage
- ✅ Input sanitization and validation
- ✅ CSRF protection through headers
- ✅ Secure communication with backend

## Performance Optimizations

- ✅ Code splitting and lazy loading
- ✅ Memoization and efficient rendering
- ✅ Optimized bundle size
- ✅ Image optimization
- ✅ Efficient API request management

## Browser Compatibility

- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes with descriptive messages
4. Push to the branch
5. Open a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email contact@saraswaticlasses.com or create an issue in the repository.