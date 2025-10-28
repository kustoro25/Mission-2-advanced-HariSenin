ReactJS Course Management Application
📋 Project Overview
Aplikasi ReactJS untuk manajemen kursus online yang dinamis dan interaktif dengan integrasi API dan state management menggunakan Redux Toolkit.

🎯 Mission Objectives
Mengintegrasikan data static dengan penggunaan API untuk membangun aplikasi React yang dinamis dan interaktif

Mendalami framework React dengan implementasi best practices

Menerapkan state management dan API consumption secara efektif

🛠 Tech Stack & Skill Set
Core Technologies
ReactJS - Frontend framework

Redux Toolkit - State management

React Redux - React bindings for Redux

Axios - HTTP client for API calls

Tailwind CSS - Styling framework

Implemented Skills
✅ Custom Hooks implementation

✅ API consumption dengan Axios

✅ State Management dengan Redux Toolkit

✅ Component lifecycle management

✅ Form handling dan validation

✅ Error handling dan loading states

✅ Image optimization dan error fallbacks

📁 Project Structure
text
src/
├── components/          # React components
│   ├── CourseCard.jsx   # Main course display component
│   ├── CourseForm.jsx   # Add/Edit course form
│   ├── CourseItem.jsx   # Individual course item
│   ├── CourseListView.jsx # Course list view
│   ├── Footer.jsx       # Footer component
│   ├── Hero.jsx         # Hero section
│   ├── MainApp.jsx      # Main application component
│   ├── Navbar.jsx       # Navigation bar
│   └── Newsletter.jsx   # Newsletter subscription
├── hooks/               # Custom hooks
│   ├── useCourses.js    # Courses management hook
│   └── useImageUpload.js # Image upload handling
├── services/            # API services
│   └── api/
│       ├── axiosConfig.js    # Axios configuration
│       ├── courseService.js  # Course API service
│       └── fallbackService.js # Fallback data service
├── store/               # Redux store
│   ├── index.js         # Store configuration
│   └── slices/
│       └── coursesSlice.js # Courses state slice
└── App.jsx             # Root application component
🚀 Features Implemented
✅ STEP 4: API Integration (Mandatory)
GET Data Integration - Mengambil data kursus dari API

ADD Course - Menambahkan kursus baru dengan form validation

EDIT Course - Mengupdate data kursus yang sudah ada

DELETE Course - Menghapus kursus dengan konfirmasi

Real-time Updates - UI update otomatis setelah operasi CRUD

✅ STEP 3: State Management (Optional - Completed)
Redux Toolkit Setup - Store configuration dengan Redux Toolkit

Async Actions - Thunks untuk handling API calls

State Persistence - Global state management untuk courses data

Filtering & Categorization - State management untuk kategori dan filter

🎨 UI/UX Features
Responsive Design - Mobile-first responsive layout

Image Optimization - Safe image component dengan error handling

Loading States - Skeleton loading dan loading indicators

Error Handling - Comprehensive error handling dan user feedback

Form Validation - Client-side validation untuk forms

Category Filtering - Filter kursus berdasarkan kategori

🔧 API Integration
Endpoints Consumed
GET /courses - Mendapatkan semua kursus

POST /courses - Menambah kursus baru

PUT /courses/:id - Mengupdate kursus

DELETE /courses/:id - Menghapus kursus

Fallback System
MockAPI.io sebagai primary backend

Local fallback service untuk offline/error scenarios

Automatic fallback ketika API tidak tersedia

📊 State Management
Redux Store Structure
javascript
{
  courses: {
    items: [],           // All courses
    filteredItems: [],   // Filtered courses by category
    categories: [],      // Available categories
    activeCategory: '',  // Currently selected category
    loading: false,      // Loading state
    error: null,         // Error state
    initialized: false   // Initial data loaded
  }
}
Key Redux Actions
fetchCourses() - Load semua kursus

addCourse(courseData) - Tambah kursus baru

updateCourse({id, courseData}) - Update kursus

deleteCourse(id) - Hapus kursus

setActiveCategory(category) - Set kategori aktif

🎯 Component Architecture
Smart Components
MainApp - Root component dengan provider setup

CourseCard - Main container untuk manajemen kursus

CourseListView - List view dengan filtering

Presentational Components
CourseItem - Individual course display

CourseForm - Add/Edit form modal

Navbar, Hero, Footer - Layout components

Custom Hooks
useCourses() - Courses state management

useImageUpload() - Image handling utilities

🔄 Data Flow
Initial Load - MainApp → useCourses → fetchCourses → API

State Update - API Response → Redux Store → Component Re-render

User Actions - Component → Dispatch Action → Redux Middleware → API

UI Update - Store Update → Component Subscription → UI Update

🛡 Error Handling & Validation
Client-side Validation
Required field validation

Price, rating numeric validation

Image URL validation

Form error messaging

API Error Handling
Network error handling

Timeout management

Fallback data system

User-friendly error messages

📱 Responsive Features
Mobile-first design approach

Flexible grid layouts

Adaptive navigation

Touch-friendly interfaces

Optimized images for different screens

🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

npm atau yarn

Installation
Clone repository

Install dependencies: npm install

Start development server: npm run dev

Open browser: http://localhost:5173

Build for Production
bash
npm run build
📈 Performance Optimizations
Lazy loading images

Efficient re-renders dengan proper state management

Optimized bundle size

Memoized components dimana diperlukan

Efficient API calls dengan caching

🔮 Future Enhancements
Pagination untuk course list

Search functionality

User authentication

Course enrollment system

Payment integration

Advanced filtering options

Course progress tracking
