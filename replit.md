# CycleConnect

## Overview

CycleConnect is a full-stack web application for cycling enthusiasts that enables users to track activities, form groups, and share cycling experiences. The application features Strava integration for automatic activity synchronization and provides social features for cycling communities. Built with a modern React frontend and Express.js backend, it uses TypeScript throughout for type safety and includes a comprehensive UI component library based on shadcn/ui.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### OAuth Implementation (2025-08-04)
- Fixed OAuth URL generation to use correct Replit domain
- Resolved API response parsing issues
- Added proper error handling and debugging logs
- OAuth redirect URI: `https://workspace.chang2020.repl.co/api/strava/callback`

### Logout Functionality (2025-08-04)  
- Implemented complete user data reset on logout
- Added proper session management
- Fixed mutation response handling

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and Strava-inspired color scheme
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with status code management
- **Request Logging**: Custom middleware for API request/response logging
- **Development**: Vite integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and database operations
- **Database Provider**: Neon Database serverless PostgreSQL
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Development Storage**: In-memory storage implementation for rapid prototyping

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL backing store
- **User System**: Username and email-based user accounts
- **Group Permissions**: Role-based access control (owner, admin, member) for groups
- **API Security**: Session-based authentication for API endpoints

### External Dependencies
- **Strava Integration**: OAuth integration for automatic activity synchronization
- **Database Hosting**: Neon Database for serverless PostgreSQL hosting
- **UI Components**: Radix UI for accessible component primitives
- **Charts**: Chart.js for data visualization and activity tracking charts
- **Development Tools**: Replit-specific tooling for cloud development environment
- **Date Handling**: date-fns for localized date formatting (Korean locale support)
- **Form Validation**: Zod for runtime type checking and form validation
- **Build Tools**: esbuild for production server bundling, PostCSS for CSS processing

The application follows a monorepo structure with shared TypeScript types between client and server, enabling end-to-end type safety. The architecture supports both development and production environments with appropriate tooling for each.