# Clothing Store

## About

A fullstack ecommerce application built as a monorepo using [Turborepo](https://turborepo.com).

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ tanstack-start
      ├─ Fullstack E2E Typesafe API via tRPC
      └─ Tailwind CSS v4
packages
  ├─ api
  │   └─ tRPC v11 router definition
  ├─ auth
  │   └─ Authentication using better-auth
  ├─ db
  │   └─ Typesafe db calls using Drizzle & MySQL
  ├─ ui
  │   └─ Shared UI components using shadcn/ui
  └─ validators
      └─ Shared Zod validation schemas
tooling
  ├─ eslint
  │   └─ shared, fine-grained, eslint presets
  ├─ prettier
  │   └─ shared prettier configuration
  ├─ tailwind
  │   └─ shared tailwind theme and configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

## Quick Start

> [!NOTE]
>
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#L4) before proceeding.

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
cp .env.example .env

# Start the database
docker compose up -d

# Push the Drizzle schema to the database
pnpm db:push
```

### 2. Generate Better Auth Schema

```bash
pnpm auth:schema:generate
```

### 3. Run the dev servers

```bash
pnpm dev
```

### 4. Adding a new package

```bash
pnpm turbo gen init
```
