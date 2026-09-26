# 💬 Chat App

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

Using Docker (easiest):

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

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
