# 💬 Chat App

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A real-time chat application with rooms, online presence and typing indicators — built with **Next.js**, **PostgreSQL**, **Drizzle ORM** and **Server-Sent Events (SSE)**.

## ✨ Features

- 🏠 Multiple chat rooms (create & switch)
- ⚡ Real-time messages via Server-Sent Events
- 🟢 Online users list
- ✍️ Typing indicators
- 👤 Simple username join (no sign-up needed)
- 🎨 Tailwind CSS UI

## 🧰 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | Next.js 16, React 19, Tailwind CSS 4 |
| Backend   | Next.js API routes, SSE       |
| Database  | PostgreSQL + Drizzle ORM      |
| Language  | TypeScript                    |

## 📋 Requirements

- [Node.js](https://nodejs.org/) 20 or newer
- [PostgreSQL](https://www.postgresql.org/) 14 or newer (local or Docker)

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/b2kproedit/chat-app.git
cd chat-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL

Using Docker Compose (easiest):

```bash
docker compose up -d
```

Or with plain Docker:

```bash
docker run --name chat-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_db -p 5432:5432 -d postgres:16
```

Or create a database named `app_db` in your local PostgreSQL.

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if your database credentials differ:

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

> If you change the URL, also update `drizzle.config.json`.

### 5. Create database tables

```bash
npm run db:push
```

### 6. Run the app

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. Open a second tab to chat with yourself 🙂

## 🛠️ Available Commands

| Command             | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Start development server (hot reload)    |
| `npm run build`     | Build for production                     |
| `npm start`         | Run the production build                 |
| `npm run lint`      | Lint the code with ESLint                |
| `npm run typecheck` | Check TypeScript types                   |
| `npm run db:push`   | Sync database schema to PostgreSQL       |
| `npm run db:studio` | Open Drizzle Studio to browse the DB     |

### Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/          # API routes (messages, rooms, users, typing, sse, health)
│   ├── layout.tsx
│   └── page.tsx
├── components/       # UI components (ChatApp, ChatView, RoomSidebar, ...)
├── db/               # Drizzle schema & DB connection
├── hooks/            # React hooks (useSSE)
├── lib/              # SSE client store
└── types/            # Shared TypeScript types
```

## 🔌 API Endpoints

| Method | Route               | Purpose                     |
|--------|---------------------|-----------------------------|
| GET    | `/api/health`       | Health check                |
| GET/POST | `/api/rooms`      | List / create rooms         |
| GET/POST | `/api/messages`   | Get / send messages         |
| POST/PATCH | `/api/users`    | Join / update user (presence) |
| GET    | `/api/users/room`   | List users in a room        |
| POST   | `/api/typing`       | Send typing status          |
| GET    | `/api/sse`          | Real-time event stream      |

## ⚡ Quick Start (all commands)

```bash
git clone https://github.com/b2kproedit/chat-app.git
cd chat-app
npm install
docker compose up -d
cp .env.example .env
npm run db:push
npm run dev
```

> On Windows (Command Prompt) use `copy .env.example .env` instead of `cp`.

## 🩺 Troubleshooting

| Problem | Fix |
|---------|-----|
| `DATABASE_URL is required` | You forgot to create `.env` — run `cp .env.example .env` |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL isn't running — run `docker compose up -d` |
| `relation "rooms" does not exist` | Tables aren't created — run `npm run db:push` |
| Port 3000 already in use | Run on another port: `npm run dev -- -p 3001` |
| Check the server is healthy | Open `http://localhost:3000/api/health` |

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Emoji reactions
- [ ] File & image sharing
- [ ] Private (direct) messages
- [ ] Dark / light theme toggle

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.


1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
