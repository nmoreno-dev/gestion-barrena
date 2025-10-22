# Copilot Instructions - Gestión Barrena

## Project Overview

This is a React frontend application for managing "deudores" (debtors) data, built with modern tooling and focused on CSV data import/processing. It's a specialized SaaS application for financial data management.

## Tech Stack & Architecture

- **React 19 + TypeScript** with Vite as build tool
- **TanStack Start** for full-stack React framework
- **TanStack Router** with file-based routing (`src/routes/`)
- **TanStack Query** for data fetching and caching
- **TanStack Table** for data grid functionality
- **Tailwind CSS + DaisyUI** for styling (theme: "dracula")
- **IndexedDB** for local data persistence (no backend API yet)
- **PapaParse** for CSV processing

## Key Patterns & Conventions

### File Structure

```
src/
├── app/          # Global config (constants, httpClient, styles)
├── common/       # Reusable components & hooks
├── features/     # Domain modules (deudores/)
├── routes/       # File-based routes (__root.tsx, index.tsx)
└── utils/        # Generic utilities
```

### Feature-Based Organization

The `deudores` feature demonstrates the pattern:

- `interfaces/` - TypeScript types (Deudor, Acreedor enums)
- `components/` - Feature-specific components (TablaDeudores, CSVLoader)
- `utils/` - Feature utilities (localStorage operations, message templates)
- `hooks/` - Custom hooks (useCsvParser)

### Data Models

- **Deudor**: Core entity with CUIL, name, email, debt amounts
- **Acreedor**: Predefined creditors with bank details (BBVA, Santander, etc.)
- Hardcoded ACREEDORES array in `interfaces/acreedor.ts`

### Routing Pattern

- File-based routing with TanStack Router
- Routes export Route objects: `export const Route = createFileRoute('/')({...})`
- Root route (`__root.tsx`) sets up global layout with lazy-loaded devtools
- Context includes QueryClient for data fetching integration

### State Management

- **Local state** with React hooks for component state
- **IndexedDB persistence** via custom utilities in `features/deudores/utils/localStorage.ts`
- **React Query** for async state (configured in router context)
- No global state management - data flows through props and local storage

### Styling Conventions

- **DaisyUI components**: `btn`, `card`, `modal`, `table`, `alert`, etc.
- **Responsive patterns**: `flex-col md:flex-row`, mobile-first approach
- **Theme**: Uses "dracula" theme set in `<html data-theme="dracula">`
- **Size variants**: Components support xs/sm/md/lg/xl sizing

### Local Data Persistence

Critical pattern: All data stored in IndexedDB, not backend API

- `saveDeudoresToStorage()` - Saves CSV data with metadata
- `loadDeudoresFromStorage()` - Retrieves data on app load
- `clearStoredDeudores()` - Clears all local data
- Data includes fileName, loadDate, totalRecords for user feedback

## Development Workflows

### Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - TypeScript check + Vite build
- `npm run lint` - ESLint with max warnings = 0
- `npm run format:check/write` - Prettier formatting

### DevTools Integration

- TanStack Router Devtools (bottom-right, dev only)
- React Query Devtools (bottom-left, dev only)
- Lazy-loaded to avoid production bundle

### CSV Data Flow

1. User uploads CSV via `CSVLoader` component
2. PapaParse processes file into Deudor objects
3. Data saved to IndexedDB automatically
4. `TablaDeudores` displays data with TanStack Table
5. User can clear data to upload new CSV

## Component Patterns

### Table Component

- Generic `<Table>` component in `common/components/Table/`
- Comprehensive README with usage examples
- Supports variants (default/zebra/bordered), pagination, row selection
- TanStack Table v8 integration with TypeScript generics

### Modal Pattern

- Native DaisyUI modal classes: `modal modal-open`
- Confirmation modals for destructive actions (data clearing)
- State managed with boolean flags in parent component

### Loading States

- DaisyUI loading spinner: `loading loading-spinner loading-lg`
- Conditional rendering based on async operations
- User feedback with toast notifications (`utils/toast.ts`)

### Error Handling

- Global error boundaries in router config
- Custom ErrorPage and NotFoundPage components
- Toast notifications for user-facing errors

## Important Files to Reference

### Core Configuration

- `vite.config.ts` - TanStack Start plugin configuration
- `router.tsx` - Router setup with QueryClient context
- `routes/__root.tsx` - Global layout and devtools

### Feature Implementation

- `routes/index.tsx` - Main page with complete data flow example
- `features/deudores/utils/localStorage.ts` - IndexedDB operations
- `features/deudores/interfaces/` - Type definitions and hardcoded data

### Reusable Components

- `common/components/Table/` - Generic table with extensive documentation
- `common/components/Modal/index.tsx` - Modal wrapper patterns

## Environment & Configuration

- Environment variables: `VITE_API_BASE_URL` (for future backend)
- Constants in `app/constants.ts` import package.json and env vars
- TypeScript strict mode with path mapping (`@/` alias)

## Code Quality Tools

- **ESLint** with TypeScript, React, and Prettier integration
- **Husky + lint-staged** for pre-commit hooks
- **Commitlint** with conventional commits
- **Semantic Release** for automated versioning

Remember: This is a client-only app with IndexedDB persistence. No API calls yet, but structure is prepared for future backend integration through the httpClient and React Query setup.
