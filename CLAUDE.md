# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `composer dev` - Start development server with all services (Laravel, queue, logs, Vite)
- `php artisan serve` - Start Laravel development server only
- `npm run dev` - Start Vite dev server for frontend assets
- `npm run build` - Build frontend assets for production

### Testing
- `composer test` - Run all tests (clears config and runs artisan test)
- `php artisan test` - Run tests using Pest testing framework
- `php artisan test --filter=TestName` - Run specific test

### Code Quality
- `./vendor/bin/pint` - Run Laravel Pint code formatter
- `php artisan config:clear` - Clear configuration cache
- `php artisan migrate` - Run database migrations
- `php artisan migrate:fresh --seed` - Fresh migrations with seeders

## Architecture

This is a Laravel 12 application with React frontend using Inertia.js. The application is a note-taking app called "NotePad" with user authentication.

### Backend Structure
- **Models**: `Note` model with user relationships, scopes for filtering (favorites, archived, search)
- **Controllers**: API-style controllers returning JSON responses, using authorization policies
- **Authentication**: Laravel Breeze with Inertia.js integration
- **Database**: SQLite database with comprehensive indexing on notes table

### Frontend Structure  
- **Framework**: React 18 with Inertia.js for SPA-like experience
- **Styling**: Tailwind CSS with custom components
- **Components**: Reusable UI components in `resources/js/Components/`
- **Pages**: Inertia pages in `resources/js/Pages/` following Laravel Breeze structure

### Key Features
- Note CRUD operations with title, content, tags (JSON array)
- Note states: important, favorite, archived
- User-scoped notes with authorization policies
- Search functionality across title and content
- Statistics dashboard
- Responsive design with sidebar navigation

### API Endpoints
All note APIs are under `/api/` prefix within web middleware for CSRF protection:
- `GET /api/notes` - List notes with filtering and sorting
- `POST /api/notes` - Create note  
- `PUT /api/notes/{note}` - Update note
- `DELETE /api/notes/{note}` - Delete note
- `POST /api/notes/{note}/toggle-favorite` - Toggle favorite status
- `POST /api/notes/{note}/toggle-archive` - Toggle archive status
- `GET /api/notes-stats` - Get user note statistics

### Database Schema
- Users table (Laravel default with modifications)
- Notes table with user_id foreign key, JSON tags field, boolean flags for states
- Comprehensive indexing for performance on user queries