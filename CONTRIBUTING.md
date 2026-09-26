# Contributing to Chat App

Thanks for your interest in contributing! 🎉

## How to contribute

1. **Fork** the repository and clone your fork.
2. Create a branch: `git checkout -b feature/my-feature`
3. Set up the project by following the steps in [README.md](README.md#-getting-started).
4. Make your changes.
5. Check that everything passes:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
6. Commit with a clear message: `git commit -m "Add emoji reactions"`
7. Push and open a **Pull Request**.

## Guidelines

- Use TypeScript and keep types in `src/types/`.
- Keep components small and put them in `src/components/`.
- If you change the database schema (`src/db/schema.ts`), run `npm run db:push`.
- Never commit your `.env` file.

## Reporting bugs

Open an issue and include what you expected, what happened, and steps to reproduce.
