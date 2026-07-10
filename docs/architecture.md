# Bubbly Day Nursery

# System Architecture Document

## Overview

This document serves as the source of truth for the architecture of the Bubbly Day Nursery platform.

Technology Stack:

- Next.js
- TypeScript
- Supabase
  - Auth
  - PostgreSQL
  - Storage
  - Realtime
  - Row Level Security (RLS)

Goals:

- Scalable architecture
- Future-proof database design
- Mobile-friendly experience
- Multi-phase delivery
- Multi-branch readiness
- Future mobile app integration

---

# Architecture Principles

1. Design for future phases from day one.
2. Avoid schema changes that break future features.
3. Use RBAC (Role Based Access Control).
4. Support multiple roles per user.
5. Store permissions separately from roles.
6. Use Supabase RLS for security.
7. Keep business domains isolated.
8. Prefer relational integrity over denormalization.
9. Every feature must support future SaaS expansion.

---

# System Domains

## Public Website

- Pages
- News
- Events
- Careers
- Gallery
- Contact

## Identity & Access

- Authentication
- Roles
- Permissions
- User Roles
- Audit Logs

## Nursery Core

- Parents
- Children
- Rooms
- Enrollments
- Attendance

## Learning & EYFS

- Observations
- Assessments
- Milestones
- Learning Journals

## Communication

- Messages
- Announcements
- Notifications
- Parent Comments

## Finance

- Invoices
- Payments
- Funding
- Outstanding Balances

## Staff

- Staff Profiles
- DBS Tracking
- Training Records
- Scheduling
- Timesheets

## Reporting

- Attendance Reports
- Finance Reports
- EYFS Reports
- Data Exports

---

# User Roles & Permissions

## Roles

- SUPER_ADMIN
- NURSERY_MANAGER
- ROOM_LEADER
- STAFF
- PARENT
- ACCOUNTANT

---

## User Roles (IMPORTANT FIX)

A user can have multiple roles.

### user_roles

| Column  | Type |
| ------- | ---- |
| id      | uuid |
| user_id | uuid |
| role_id | uuid |

---

## Permissions

- create_child
- update_child
- delete_child
- create_invoice
- approve_invoice
- manage_staff
- manage_website
- manage_observations

---

## role_permissions

| Column        | Type |
| ------------- | ---- |
| role_id       | uuid |
| permission_id | uuid |

---

# Database Design

## Identity

### profiles

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| email      | text      |
| first_name | text      |
| last_name  | text      |
| phone      | text      |
| avatar_url | text      |
| created_at | timestamp |
| updated_at | timestamp |

---

## Parent Domain

### parents

| Column              | Type      |
| ------------------- | --------- |
| id                  | uuid      |
| profile_id          | uuid      |
| address             | text      |
| emergency_contact   | text      |
| relationship_status | text      |
| created_at          | timestamp |

---

## Child Domain

### children

| Column        | Type      |
| ------------- | --------- |
| id            | uuid      |
| first_name    | text      |
| last_name     | text      |
| date_of_birth | date      |
| gender        | text      |
| medical_notes | text      |
| allergies     | text      |
| status        | text      |
| room_id       | uuid      |
| created_at    | timestamp |

---

### child_parents

Many-to-many relationship.

| Column          | Type    |
| --------------- | ------- |
| id              | uuid    |
| child_id        | uuid    |
| parent_id       | uuid    |
| relationship    | text    |
| primary_contact | boolean |

---

## Room Domain

### rooms

| Column         | Type    |
| -------------- | ------- |
| id             | uuid    |
| name           | text    |
| capacity       | integer |
| min_age_months | integer |
| max_age_months | integer |
| description    | text    |

Examples:

- Babies
- Toddlers
- Preschool

---

## Staff Domain

### staff

| Column     | Type |
| ---------- | ---- |
| id         | uuid |
| profile_id | uuid |
| job_title  | text |
| start_date | date |
| dbs_expiry | date |
| status     | text |

---

## Enrollment Domain

### enrollments

Tracks room history.

| Column     | Type |
| ---------- | ---- |
| id         | uuid |
| child_id   | uuid |
| room_id    | uuid |
| start_date | date |
| end_date   | date |
| status     | text |

---

# Future Domains (Phase 2+)

- attendance
- messages
- announcements
- observations
- learning_milestones
- invoices
- payments

---

# Storage Strategy (Supabase)

Buckets:

- avatars
- children
- gallery
- events
- news
- careers
- observations
- documents
- invoices

---

# Security Strategy (RLS)

## Helper Functions

- is_super_admin()
- has_permission(permission_key)
- is_parent_of_child(child_id)

## Access Rules

- Parents → only their children
- Staff → only assigned rooms
- Accountants → invoices only
- Managers → full nursery access
- Super Admin → full system access

---

# Application Structure

```
app/
├── (public)
├── (auth)
├── (admin)
└── (parent)
```

## Public

- /
- /about
- /gallery
- /careers
- /contact

## Auth

- /login
- /forgot-password

## Admin

- /dashboard
- /website
- /news
- /events
- /gallery
- /careers
- /parents
- /children
- /rooms
- /settings

## Parent

- /dashboard
- /child
- /reports
- /messages

---

# Delivery Roadmap

## Phase 1

- Architecture
- Authentication
- RBAC system
- Parent Registration
- Child Registration
- Website CMS
- Public Website
- Careers
- Gallery
- Contact
- Deployment

## Phase 2

- Parent Portal
- Messaging
- Announcements
- Notifications

## Phase 3

- Attendance
- Room Management
- Staff Dashboard

## Phase 4

- EYFS
- Observations
- Learning Journals

## Phase 5

- Finance
- Invoices
- Stripe Integration

## Phase 6

- Reporting
- Analytics
- Exports

## Phase 7

- Mobile App
- Multi-Branch Support
- AI Features

---

# Key Design Decisions

1. Supabase Auth is the single identity source.
2. Users can have multiple roles (critical scalability fix).
3. All permissions are database-driven.
4. Room history is handled via enrollments.
5. Child-parent relationship supports multiple guardians.
6. Architecture is SaaS-ready (multi-branch future).
7. All sensitive data is protected via RLS policies.
8. System is designed for mobile-first + future app expansion.
