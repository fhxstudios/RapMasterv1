# RapMaster Simulator

## Overview

RapMaster Simulator is a music career life simulator game built as a full-stack web application. The game allows players to start as a rookie rapper at age 20 and build their career through jobs, music creation, albums, social media, and lifestyle purchases until retirement at age 60. Players progress by growing their Fame, Reputation, Fans, and Net Worth to become the #1 Rap Icon.

The application features a React-based frontend with a comprehensive UI component library, an Express.js backend with RESTful APIs, and PostgreSQL database integration using Drizzle ORM. The game includes character creation, multiple gameplay pages (jobs, studio, social media, shop, stats, skills), and persistent game state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing with page-based navigation (splash, menu, character creation, game interface)
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables and game-specific gradients/themes
- **State Management**: React Context API for global game state with local storage persistence
- **Data Fetching**: TanStack Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API endpoints
- **API Design**: Resource-based routes for game profiles, jobs, and shop items with proper HTTP methods
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement and custom logging middleware for request tracking
- **Static Serving**: Vite middleware integration for serving frontend assets in development

### Data Storage Solutions
- **Database**: PostgreSQL configured through environment variables
- **ORM**: Drizzle ORM for type-safe database operations with schema-first approach
- **Schema**: Structured tables for users, game profiles, jobs, and shop items with JSON fields for complex data
- **Migrations**: Drizzle Kit for database schema management and version control
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

### Authentication and Authorization
- **Session Management**: Basic user identification through profile IDs
- **Local Storage**: Client-side game state persistence for offline play capability
- **Profile System**: User-based game profiles with character customization and progress tracking

### Game Engine Architecture
- **Core Systems**: Dedicated game engine module for calculations (track quality, skill upgrades, fame/reputation)
- **Game Loop**: Work → Invest → Create → Release → Grow → Spend progression cycle
- **Progression Mechanics**: Skill-based improvements, random name generation, and asset value calculations
- **Mobile Optimization**: Responsive design with mobile-first UI components and touch-friendly interactions

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **PostgreSQL**: Primary database for persistent game data storage

### UI and Styling
- **Radix UI**: Comprehensive component primitives for accessible interface elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system integration
- **Lucide React**: Icon library for consistent iconography throughout the application

### Development Tools
- **TypeScript**: Static type checking for both frontend and backend code
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

### Game-Specific Features
- **React Hook Form**: Form management for character creation and game interactions
- **Date-fns**: Date manipulation for game timeline and progression
- **Class Variance Authority**: Component variant management for dynamic styling

### Replit Integration
- **Development Banner**: Replit-specific development tools and environment detection
- **Runtime Error Overlay**: Enhanced error reporting during development
- **Cartographer Plugin**: Replit-specific development tooling integration