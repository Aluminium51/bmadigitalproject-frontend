# BMA Digital Project - Frontend

An enterprise-level digital project management and approval system designed for robust performance, scalability, and maintainability. This repository houses the frontend application built with a modern React ecosystem and a Feature-Driven Architecture.

## Project Background

Historically, government IT project proposals and budget approvals involved excessive paperwork, manual tracking, and complex hierarchical reviews. The **BMA Digital Project** was initiated to digitize and centralize this entire pipeline for the Bangkok Metropolitan Administration (BMA). 

The system ensures that all proposed IT projects align with the organization's Enterprise Architecture (EA) and strategic policies. It streamlines the lifecycle from the initial drafting of a proposal to the final executive board approval, providing transparency, reducing redundancy, and enabling efficient budget allocation.

## ✨ Core Features

*   📝 **Multi-Step Proposal Wizard:** A comprehensive, interactive form handling general information, strategic alignment (Enterprise Architecture), and detailed budget breakdowns (Hardware, Software, Personnel, and Training).
*   🔄 **Multi-Tier Approval Workflow:** A strict, state-driven routing system that moves projects through various screening phases (Secretary ➡️ Analyst ➡️ Screening Committee ➡️ Policy Board) with built-in revision loops (Revise/Fix).
*   🔐 **Role-Based Access Control (RBAC):** Secure, domain-specific access ensuring users only see and interact with data relevant to their specific role and department.
*   📊 **Real-Time Status Tracking:** Intuitive dashboards for users to monitor their project's status (Draft, Submitted, Passed, Need Revision, Rejected) at a glance.
*   📄 **Document Management:** Integrated file handling with automated PDF compression for supporting project documents and architectural diagrams.

## Target Audience (User Roles)

The system is designed to serve multiple stakeholders across the organization:

1.  **Project Creators (Agency Staff):** Personnel from various departments (เขต/สำนัก) who initiate, draft, and submit IT project proposals.
2.  **Secretaries (Initial Screeners):** Coordinators who perform the first round of checks for document completeness and compliance.
3.  **IT Analysts:** Technical experts who evaluate the project's technical feasibility, architecture alignment, and budget correctness.
4.  **Committee & Board Members (Executives):** Decision-makers in both the Screening Committee (Small Board) and Policy Board (Big Board) who grant final approvals.
5.  **System Administrators:** Super users responsible for managing master data, organizational lookups, and user permissions.

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