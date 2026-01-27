# AURA Frontend

React + TypeScript frontend for AURA System

## Setup

```bash
cd src/frontend
npm install
npm run dev
```

## Structure

```
src/
├── components/      # Reusable components (Button, Navigation, etc)
├── context/         # React Context (Auth)
├── pages/           # Page components (Landing, Login, Dashboard)
├── services/        # API services
├── types/           # TypeScript types
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── index.css       # Tailwind CSS
```

## Login Test Credentials

- **Patient**: any@email.com / password
- **Doctor**: doctor@test.com / password
- **Admin**: admin@test.com / password

## Features

- ✅ Landing Page with role info
- ✅ Login Form with mock auth
- ✅ Protected Routes (authentication required)
- ✅ Role-based Dashboard (Patient, Doctor, Clinic, Admin)
- ✅ Responsive Design (TailwindCSS)
- ✅ Component-based Architecture
- ✅ TypeScript support