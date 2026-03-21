# Gym PT Reservation Demo

A demo web app for booking personal training (PT) sessions. Built with **Vue 3 (Vite)** frontend and **Node.js + Express** backend, using **SQLite** and **TailwindCSS**.

## Project structure

```
GymPTReservationDemo/
├── backend/          # Express API + SQLite
│   ├── db/
│   │   └── init.js   # DB init & schema
│   ├── routes/
│   │   ├── trainers.js
│   │   └── reservations.js
│   └── server.js
├── frontend/         # Vue 3 + Vite + Tailwind
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── router/
│   │   └── views/
│   └── ...
└── README.md
```

## Setup

**처음 한 번만** 의존성 설치:

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 로컬 백엔드로 개발 (한 터미널로 둘 다 실행)

**프로젝트 루트**에서:

```bash
npm run dev
```

- 백엔드: `http://localhost:3001`
- 프론트: `http://localhost:5173` (브라우저는 여기 접속)
- `/api` 요청은 Vite 프록시로 백엔드로 전달됩니다.

(백엔드/프론트를 각각 따로 실행하려면: 터미널 1 `cd backend && npm run dev`, 터미널 2 `cd frontend && npm run dev`)

### 프론트만 실행 + Lambda(실전) API 테스트

```bash
cd frontend
npm run dev:lambda
```

- 백엔드는 실행하지 않습니다. API 요청은 `.env.lambda`의 API Gateway URL로 갑니다.
- 배포 전 실전 API 연동 확인용으로 사용하세요.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trainers` | List trainers |
| GET | `/api/reservations` | List reservations (optional `?date=YYYY-MM-DD`) |
| GET | `/api/reservations/available?trainer=&date=` | Available time slots |
| POST | `/api/reservations` | Create reservation |
| DELETE | `/api/reservations/:id` | Cancel reservation (sets status to Cancelled) |

## Pages

- **Home** – Hero, intro, “Book PT Session” CTA
- **Book PT Session** (`/reserve`) – Trainer, date, time slot, PT type, name, phone
- **Reservation Complete** (`/complete`) – Summary after booking
- **Admin** (`/admin`) – Reservations table with date filter and cancel action

## Trainers (demo data)

- **Mike** – Strength Training  
- **Anna** – Diet & Body Shape  
- **Chris** – Rehabilitation Training  

Time slots: 06:00, 07:00, 08:00, 09:00, 18:00, 19:00, 20:00. Booked slots are disabled when selecting a trainer and date.
