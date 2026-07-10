# Architecture Decision Records (ADR)

This document tracks major design, architectural, and technical decisions made during the development of Bubbly Day Nursery.

---

## ADR 1: Unified Next.js 16 & Supabase Stack
*   **Status**: Approved
*   **Date**: July 10, 2026
*   **Context**: The project requires a fast, secure, mobile-friendly marketing site combined with a secure parent portal and room management platform.
*   **Decision**: We use Next.js 16 (App Router) paired with Supabase as the single backend provider.
*   **Consequences**: 
    *   Supabase handles Authentication, PostgreSQL storage, real-time message syncing, and asset storage buckets.
    *   Row Level Security (RLS) policies are configured directly in Postgres to restrict data access cleanly between Parents, Staff, and Admins.

---

## ADR 2: Multi-Role Based Access Control (RBAC)
*   **Status**: Approved
*   **Date**: July 10, 2026
*   **Context**: Typical staff members might also have children at the nursery, meaning a single user account needs to access both the Parent Portal and the Staff Portal.
*   **Decision**: Users are mapped to roles using a many-to-many relationship table (`user_roles`). Permissions are assigned to roles via `role_permissions` and verified dynamically on the database level via Postgres triggers and helper functions.
*   **Consequences**:
    *   Eliminates the need for multiple accounts per user.
    *   Ensures that permission checks are granular (e.g. `create_invoice`, `manage_observations`) rather than basic role checks.

---

## ADR 3: Styling with Tailwind CSS v4 & Theme Presets
*   **Status**: Approved
*   **Date**: July 10, 2026
*   **Context**: The nursery requirements mandate soft pastel colors, simple navigation, and clean modern nursery design. However, the dashboard template contains dark mode, multiple sidebar settings, and layouts.
*   **Decision**: We implement a custom pastel theme preset (`bubbly-nursery.css`) in the Tailwind v4 styles directory. This custom preset overrides the theme CSS variables (colors, border radius, background) dynamically based on the selected HTML preset attribute.
*   **Consequences**:
    *   Allows seamless switching between the default administration dashboards and the pastel nursery view.
    *   Avoids hardcoded hex codes, preserving semantic tailwind variables (like `bg-background`, `text-primary`) so they map properly to both the public site and admin dashboards.

---

## ADR 4: Feature Colocation and Code Layout
*   **Status**: Approved
*   **Date**: July 10, 2026
*   **Context**: Large Next.js codebases can become hard to navigate if components, schemas, and hooks are placed in global folders far away from the routes that use them.
*   **Decision**: We enforce feature colocation following the rules in `AGENTS.md`:
    *   Dashboard routes: `src/app/(main)/dashboard/<screen>/page.tsx`
    *   Screen-specific components: `src/app/(main)/dashboard/<screen>/_components/`
    *   Only share components if they are actually used by two or more distinct screens.
*   **Consequences**:
    *   Makes deletions and refactoring of dashboard features highly clean.
    *   Ensures the route folders remain self-contained.

---

## ADR 5: Biome for Linting & Formatting
*   **Status**: Approved
*   **Date**: July 10, 2026
*   **Context**: Modern React 19/Next 16 development needs fast linting and formatting tooling that matches strict TypeScript environments.
*   **Decision**: Biome is utilized as the single tool for linting and formatting (replacing Prettier/ESLint).
*   **Consequences**:
    *   Imports are automatically sorted.
    *   Line length limit of 120 characters is enforced.
    *   Strict TypeScript checking must be run via `npm run check` and `npm run check:fix` prior to major commits.
