# RentPortal

A modern property management web application built with React, TypeScript, and Firebase.

## Live Demo
Visit the live application at: https://rental-portal-8c099.web.app

## Features
- User authentication and role-based access control
- Property management and listings
- Maintenance request tracking
- Document management
- Payment processing with Stripe
- Real-time notifications
- Responsive design

## Tech Stack
- React with TypeScript
- Firebase (Authentication, Firestore, Storage)
- Stripe for payments
- Tailwind CSS for styling
- Vite for build tooling

## Development
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables in `.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```
4. Run development server:
```bash
npm run dev
```

## Deployment
The application is automatically deployed to Firebase Hosting when changes are pushed to the main branch.

## Testing
Run tests with:
```bash
npm test
```

## License
MIT
