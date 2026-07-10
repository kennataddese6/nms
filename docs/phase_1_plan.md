# Phase 1 Execution Plan: Foundation, Auth, RBAC & Public Website

This document outlines the detailed step-by-step plan for Phase 1. Mark items as completed as work progresses.

---

## Phase 1 Checklist

### 1. Style & Theme Setup
Initialize the aesthetic foundations matching the warm nursery requirements.

- [x] **1.1 Custom Pastel Theme Preset**
  - Create [bubbly-nursery.css](file:///home/kenna/projects/nms/src/styles/presets/bubbly-nursery.css) defining the pastel color system (`oklch` or `hsl` variables) using:
    - Primary: Soft Pastel Blue
    - Secondary: Soft Mint Green
    - Accent: Warm Pastel Yellow & Peach/Pink
    - Soft border radius (e.g., `1.25rem` or `1rem`)
  - Import the preset inside [globals.css](file:///home/kenna/projects/nms/src/app/globals.css).
- [x] **1.2 Setup App Preferences Defaults**
  - Add `bubbly-nursery` to the layout preference configurations so it can be defaulted in cookies.
- [x] **1.3 Root Redirect adjustments**
  - Modify [page.tsx](file:///home/kenna/projects/nms/src/app/%28external%29/page.tsx) to render a proper marketing home page instead of redirecting directly to `/dashboard/default`.

---

### 2. Database Schema & Supabase Setup
Create SQL migrations to setup the Postgres schema in Supabase.

- [x] **2.1 Core Profiles & Roles Tables**
  - Create table `profiles` linking to Supabase auth.
  - Create table `roles` (`id`, `name` like `SUPER_ADMIN`, `PARENT`, `STAFF`).
  - Create table `user_roles` (link user profiles to multiple roles).
  - Create table `permissions` and `role_permissions` mapping.
- [x] **2.2 Core Nursery Domains Tables**
  - Create table `rooms` (id, name, capacity, age ranges).
  - Create table `children` (id, first_name, last_name, DOB, room_id, medical notes, allergies).
  - Create table `parents` (id, address, emergency contact, relationship).
  - Create table `child_parents` (many-to-many relationship map with `primary_contact` flag).
  - Create table `staff` (id, job_title, start_date, dbs_expiry, status).
  - Create table `enrollments` (history of child room placements).
- [x] **2.3 Database Helper Functions & RLS Policies**
  - Implement security filters: `is_super_admin()`, `has_permission()`, and `is_parent_of_child()`.
  - Apply Row Level Security (RLS) on all tables to ensure parents only see their children, staff see their assigned rooms, and managers see everything.

---

### 3. Authentication & Registration Flows
Implement forms and server logic.

- [x] **3.1 Authentication Views**
  - Build custom login and forgot-password panels using standard shadcn inputs and buttons.
- [x] **3.2 Parent Self-Registration Flow**
  - Step 1: Parent personal details & contact.
  - Step 2: Child details, DOB, room preference, medical notes/allergies.
  - Step 3: Consent agreements (photo permissions, medical emergency consent).
  - Store values inside `profiles`, `parents`, `children`, and `child_parents` atomically.

---

### 4. Public Marketing Website
Create high-fidelity public-facing pages for Bubbly Day Nursery.

- [x] **4.1 Home Page**
  - Modern hero banner, nursery value highlights, reviews/testimonials carousel, and dynamic visit scheduling.
- [x] **4.2 About Us Page**
  - Safeguarding commitment statement, learning philosophy, and key management/staff profiles.
- [ ] **4.3 Rooms Page**
  - Detail sections for:
    - **Babies room** (0 - 2 years)
    - **Toddlers room** (2 - 3 years)
    - **Preschool room** (3 - 5 years)
  - Daily routine lists, room gallery, and age-specific learning goals.
- [ ] **4.4 Curriculum & EYFS Page**
  - Educational explanation of the Early Years Foundation Stage framework and how Bubbly Day Nursery supports child development.
- [ ] **4.5 Careers Page**
  - Active job postings (e.g. "Early Years Educator", "Room Leader").
  - Inline job application form supporting file attachments (CV upload).
- [ ] **4.6 Contact & Tour Booking System**
  - Contact submission form, location details, opening hours.
  - Visit Booking calendar (allowing parents to choose open slots for tours).

---

### 5. Navigation & Sidebar Config
Integrate new routes into the main app shell navigation.

- [ ] **5.1 Update Sidebar Items**
  - Add links for parent view (`/parent/dashboard`, `/parent/messages`) and manager view (`/dashboard/parents`, `/dashboard/children`, `/dashboard/rooms`) in [sidebar-items.ts](file:///home/kenna/projects/nms/src/navigation/sidebar/sidebar-items.ts).
