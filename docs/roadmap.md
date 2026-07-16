# Project Roadmap & Status Tracker

This document serves as the progressive tracking log for the Bubbly Day Nursery platform. It outlines the status of each development phase, lists completed items, and provides context for future developers or AI models regarding current progress.

---

## Overall Status Summary

- **Current Phase**: Planning / Initial Setup
- **Project Start Date**: July 10, 2026
- **Status Legend**:
  - 🔴 **Pending**: Not started yet.
  - 🟡 **In Progress**: Work has commenced.
  - 🟢 **Completed**: Fully implemented, tested, and verified.

| Phase | Description | Status | Target Date | Completed Date |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation, Auth, RBAC & Public Website | 🟡 In Progress | TBD | - |
| **Phase 2** | Parent Portal & Communication | 🔴 Pending | TBD | - |
| **Phase 3** | Attendance, Rooms & Staff Dashboard | 🔴 Pending | TBD | - |
| **Phase 4** | EYFS Tracking & Learning Journals | 🔴 Pending | TBD | - |
| **Phase 5** | Billing, Invoicing & Payments | 🔴 Pending | TBD | - |
| **Phase 6** | Reports & Analytics | 🔴 Pending | TBD | - |
| **Phase 7** | Mobile App Support & AI Integrations | 🔴 Pending | TBD | - |

---

## Detailed Phase Progress

### 🟡 Phase 1: Foundation, Auth, RBAC & Public Website
Focuses on establishing the database model, setting up secure authentication, configuring permissions, and delivering the public marketing website.

*   [x] **1.1 Project Structure & Theme Presets**
    *   [x] Create a Bubbly Day Nursery custom styling theme preset (`bubbly-nursery.css`).
    *   [x] Set up baseline layouts for public vs. authenticated zones.
*   [x] **1.2 Supabase Database Setup & Migrations**
    *   [x] Implement schemas for `profiles`, `parents`, `children`, `child_parents`, `rooms`, `staff`, and `enrollments`.
    *   [x] Implement user roles mapping and permissions tables (`user_roles`, `role_permissions`).
    *   [x] Write database helper functions (`is_super_admin`, `has_permission`, etc.).
    *   [x] Set up Row Level Security (RLS) policies for secure data access.
*   [x] **1.3 Authentication & Registration Flows**
    *   [x] Implement user login and password recovery.
    *   [x] Create multi-step registration forms for Parents and Children.
*   [x] **1.4 Public Website & CMS**
    *   [x] Homepage with hero, testimonials, and highlights.
    *   [x] About Us (safeguarding and EYFS overview).
    *   [x] Rooms page displaying daily routines and activities.
    *   [x] Curriculum detail page.
    *   [x] Careers page with job application and CV upload.
    *   [x] Contact Us with booking system for nursery tours.
    *   [x] Gallery page showcasing nursery classroom activities.
    *   [x] Parent Info page detailing fees, funding, and FAQs.
*   [x] **1.5 Nursery Admin Dashboard (Staff & Managers)**
    *   [x] Nursery CRM listing and registering parents and students.
    *   [x] Content Manager to publish jobs, news events, and gallery media.

---

### 🔴 Phase 2: Parent Portal & Communication
Focuses on the parent portal UI, message flows, and notifications.

*   [x] Parent Portal Dashboard page (welcomes parents, list linked children, notices).
*   [ ] Message board (real-time chat with room leaders and staff).
*   [ ] Announcement feed and push notifications.
*   [ ] Daily child reports visualizer.

---

### 🔴 Phase 3: Attendance, Rooms & Staff Dashboard
Focuses on staff workflows inside the nursery rooms.

*   [x] Rooms Management Dashboard (create classrooms, monitor capacities, review staff/rosters).
*   [ ] Staff dashboard and attendance registers.
*   [ ] Child check-in / check-out.
*   [ ] Live staff-to-child ratio compliance alerts.
*   [ ] Shift schedules, holiday requests, and timesheet logs.

---

### 🔴 Phase 4: EYFS Tracking & Learning Journals
Focuses on capturing observations and aligning with the UK Early Years Foundation Stage framework.

*   [ ] Observation logger (text, image, video).
*   [ ] EYFS curriculum tagger and milestone tracker.
*   [ ] Progress assessment reports and cohort summaries.
*   [ ] Parent comments and home learning submissions.

---

### 🔴 Phase 5: Billing, Invoicing & Payments
Focuses on financial operations.

*   [ ] Automated monthly invoice builder.
*   [ ] Funding hours allocation (15/30 free hours tracker).
*   [ ] Stripe and GoCardless integrations for credit card & direct debit payments.
*   [ ] Outstanding balance dashboards and payment reminders.

---

### 🔴 Phase 6: Reports & Analytics
Focuses on exporting operational and regulatory data.

*   [ ] Room occupancy forecast reports.
*   [ ] Attendance statistical reports.
*   [ ] Staff training and DBS renewal schedule trackers.
*   [ ] PDF/Excel exporter for all records.

---

### 🔴 Phase 7: Mobile App Support & AI Integrations
Focuses on future scalability and intelligence.

*   [ ] Mobile API / Supabase endpoint optimization for mobile viewports.
*   [ ] AI assistant for auto-generating EYFS summary reports.
*   [ ] Multi-branch support layout.
