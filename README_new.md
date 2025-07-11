# Admin Panel & Dashboard

A modern, responsive admin panel and dashboard built with React, TypeScript, Tailwind CSS, and TanStack libraries.

## 🚀 Features

- **Modern UI**: Clean, responsive design using Tailwind CSS
- **Dashboard Analytics**: Statistics cards and data visualization
- **User Management**: Complete user management with filtering and sorting
- **Data Tables**: Powerful, sortable, and searchable data tables using TanStack Table
- **State Management**: Efficient server state management with TanStack Query
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with collapsible sidebar

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Data Tables**: TanStack Table for advanced table functionality
- **Icons**: Lucide React
- **Build Tool**: Vite for fast development and builds
- **Linting**: ESLint with TypeScript support

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Sidebar.tsx     # Collapsible navigation sidebar
│   ├── Header.tsx      # Top navigation bar
│   ├── DataTable.tsx   # Reusable data table component
│   └── StatsCard.tsx   # Statistics display card
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard page
│   └── Users.tsx       # User management page
├── lib/                # Utility functions and services
│   ├── api.ts          # API service functions
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
└── hooks/              # Custom React hooks
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🎨 Design System

The project uses a custom design system built with Tailwind CSS:

- **Colors**: Custom primary and gray color palettes
- **Typography**: Inter font family for consistent text
- **Components**: Reusable component classes for buttons, cards, and form inputs
- **Responsive**: Mobile-first responsive design

## 📊 Key Components

### Dashboard
- Real-time statistics cards
- Recent activities table
- User overview table
- Responsive layout

### User Management
- Complete user listing with pagination
- Advanced filtering and sorting
- User statistics overview
- Action buttons for user operations

### Data Tables
- Built with TanStack Table
- Sorting, filtering, and pagination
- Global search functionality
- Responsive design

## 🔧 Development

The project is set up with:

- **Hot Module Replacement (HMR)** for fast development
- **TypeScript** for type safety
- **ESLint** for code linting
- **Tailwind CSS** for styling
- **TanStack Query** for data fetching and caching

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
