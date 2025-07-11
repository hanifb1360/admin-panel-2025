<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Admin Panel and Dashboard Project

This is a modern admin panel and dashboard application built with React, TypeScript, Tailwind CSS, and TanStack libraries.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and design system
- **TanStack Query** - Server state management
- **TanStack Table** - Data table functionality
- **Vite** - Build tool and development server
- **Lucide React** - Icons

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/lib/` - Utility functions and API services
- `src/types/` - TypeScript type definitions
- `src/hooks/` - Custom React hooks

## Key Features

- Responsive sidebar navigation with collapse functionality
- Dashboard with statistics cards and data tables
- User management with filtering and sorting
- Modern UI with Tailwind CSS
- Type-safe API integration with TanStack Query
- Sortable and searchable data tables

## Development Guidelines

- Use TypeScript for all new files
- Follow the existing component structure and naming conventions
- Use Tailwind CSS utility classes for styling
- Implement proper error handling and loading states
- Use TanStack Query for data fetching and caching
- Maintain consistent code formatting and linting

## Custom Components

- `Layout` - Main application layout with sidebar and header
- `Sidebar` - Collapsible navigation sidebar
- `Header` - Top navigation bar with search and user info
- `DataTable` - Reusable table component with sorting and filtering
- `StatsCard` - Dashboard statistics display component

## Styling

- Custom color palette defined in `tailwind.config.js`
- Utility classes for common UI patterns in `src/index.css`
- Responsive design using Tailwind's responsive utilities
- Inter font family for consistent typography
