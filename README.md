# Airbnb MVP Clone

A simple Airbnb-like platform built in less than a week as a technical case/challenge.

## Features

- **User Authentication** (Sign up, Log in)
- **Host Dashboard**:
  - View list of own properties
  - Add new properties (with images)
- **Guest Dashboard**:
  - Browse available properties
  - View property details
  - Rent a property (with booking dates)
- **Booking System**:
  - Prevents double-booking for the same property and date range
  - Guests can see a list of their bookings
- **Role Separation** between Guests and Hosts

## Tech Stack

| Layer | Technologies | Justification |
|:---|:---|:---|
| Frontend | Next.js 14 (App router) + Tailwind CSS | Rapid UI development, component-based structure, optimized performance |
| Backend | FastAPI (Python) | High-performance API, simple asynchronous programming |
| Database | SQLite (local) | Lightweight for MVP; designed for easy future migration to PostgreSQL afterwards|
| ORM | SQLModel | Combines Pydantic models and SQLAlchemy in a clean, efficient way |
| Authentication | JWT (JSON Web Tokens) | Stateless, scalable authentication mechanism |
| API Testing | Swagger UI | Built-in FastAPI |

I specially chose Next.js because I wanted to learn it, and Python because I have background on it and I needed speed (it was an one week project).

## ⚙️ Setup Instructions

Obs: For following the setup it is required to have python3 installed in your machine.

### **Clone the Repository**
```
git clone https://github.com/pedroaurgomes/Airbnb-Clone.git
cd Airbnb-Clone
```

### Start the Backend
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload
```
--> Backend will run at http://localhost:8000

### Start the Frontend
```
cd frontend
npm install
npm run dev
```
--> Frontend will run at http://localhost:3000

### environment
Make a local copy of .env.example and fill it with your own values.

## AI Usage and Design Decisions
You can find detailed explanations of:
- How AI tools assisted in the project (/docs/AI_USAGE.md)
- Key technical and design choices (/docs/DESIGN_DECISIONS.md)

## Folder Structure
``` .
├── LICENSE
├── README.md
├── backend
│   ├── alembic
│   ├── app
│   ├── database
│   └── requirements.txt
├── docs
│   ├── AI_usage.md
│   └── Design_decisions.md
└── frontend
    ├── README.md
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.js
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── postcss.config.mjs
    ├── public
    ├── src
    ├── tailwind.config.js
    └── tsconfig.json
```

## Future improvements
If I were to keep developing and scaling the project, I would: 
- Enhance the UX by rethinking user types (probably would have an account that you can start with either guest or host and then upgrade to act as both.
- Add search and filters for properties.
- Add messaging system between hosts and guests.
- Improve mobile responsiveness.
- Migrate to PostgreSQL with Alembic migrations.
- Add payment gateway integration (e.g., Stripe).
- Idea of AI feature: personalizaed recommendation system (POC: embedding of properties + graph with locations)


