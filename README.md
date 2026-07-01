# BMA Digital Project - Frontend

An enterprise-level digital project management and approval system designed for robust performance, scalability, and maintainability. This repository houses the frontend application built with a modern React ecosystem and a Feature-Driven Architecture.

## Tech Stack

This project utilizes a modern and type-safe tech stack:

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + PostCSS
*   **UI Library:** Custom components & Shadcn UI (located in `src/components/ui`)
*   **Package Manager:** pnpm (Workspace enabled)
*   **Validation:** Zod

---

## Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
*   Node.js (v18.x or later recommended)
*   pnpm (v8.x or later)

### Installation & Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Environment Variables:**
    Create a `.env.local` file in the root directory and configure the necessary environment variables (e.g., API endpoints, authentication secrets).

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:3000`.

---

## Project Architecture & Structure

This project strictly follows a **Feature-Driven Architecture (FDA)**. This means code is organized by business domains (features) rather than technical roles (components, hooks, etc.). 

### High-Level Directory Tree

```text
src/
├── app/              # Next.js App Router (Routing & Pages only)
│   ├── (protected)/  # Authenticated routes (dashboard, projects, meetings, etc.)
│   ├── login/        # Public authentication routes
│   └── register/     # Public authentication routes
├── components/       # Global/Shared UI components
│   ├── custom/       # Domain-agnostic complex components (e.g., app-sidebar)
│   └── ui/           # Base UI elements (buttons, inputs, dialogs)
├── features/         # 🌟 Core Business Logic (Domain-driven modules)
│   ├── auth/         # Authentication logic and forms
│   ├── meetings/     # Board meeting and resolution management
│   ├── projects/     # Project workspace and tracking
│   ├── proposals/    # Multi-step proposal wizard and document generation
│   └── users/        # User management and RBAC
├── hooks/            # Global custom React hooks (e.g., use-mobile.ts)
├── lib/              # Global utilities and configurations (e.g., utils.ts)
├── types/            # Global TypeScript models (e.g., models.ts)
└── data/             # Global static data or lookup tables (e.g., lookup.ts)
```

### Feature Module Pattern
Every directory under src/features/ represents a self-contained business domain. A typical feature module looks like this:  

```text
src/features/[feature-name]/
├── components/       # UI components specific to this feature
├── hooks/            # Custom hooks for local state and data fetching
├── actions/          # Server actions or API call functions
├── schemas/          # Zod validation schemas
├── stores/           # Local state management (Zustand/Context)
├── utils/            # Helper functions specific to this feature
├── data/             # Feature-specific mock data or constants
└── types.ts          # TypeScript interfaces/types specific to this feature
```

## 🎨 UI & Styling Guidelines
- Tailwind CSS: Use Tailwind for all styling[cite: 1]. Avoid writing custom CSS unless absolutely necessary (add to src/app/globals.css)[cite: 1].
- Component Composition: Use the cn() utility (located in src/lib/utils.ts) to merge Tailwind classes dynamically[cite: 1].
- Base Components: Always utilize the foundational components from src/components/ui/ (e.g., ```<Button>, <Input>, <Table>```) before building custom ones[cite: 1].

## 🤖 AI Developer Notes (System Prompt Instructions)
If you are an AI Assistant, Copilot, or Cursor agent working on this repository, you MUST adhere to the following rules:

Architecture Compliance: Strictly follow the Feature-Driven Architecture[cite: 1]. Do not clutter src/app with business logic[cite: 1]. Pages in src/app should merely act as orchestrators.

Type Safety: Use TypeScript strictly. Avoid any. Rely on Zod schemas (in src/features/[feature]/schemas/) to infer types for forms and API payloads whenever possible[cite: 1].

Imports: Prefer absolute imports ```(@/...)``` over relative paths ```(../../...)```.

Global vs. Local: Do not import feature-specific files into global components. Dependencies should point inward (App -> Features -> Global Components).

State Management: When dealing with complex forms (e.g., the proposal wizard), utilize the designated store inside src/features/[feature]/stores/ (e.g., useProposalFormStore.ts) to prevent excessive prop drilling[cite: 1].