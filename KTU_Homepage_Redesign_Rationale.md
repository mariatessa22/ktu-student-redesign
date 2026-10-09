# KTU (APJ Abdul Kalam Technological University) Website Redesign Rationale

## 1. Executive Summary & Core Philosophy

The primary objective of this redesign is to transition the official website of **APJ Abdul Kalam Technological University (KTU)** from an **organization-first, information-dense portal** into a **student-first, task-oriented university portal** while upholding high institutional credibility and academic confidence.

### Standalone Client-Side Architecture
The portal is built with **pure plain HTML5, CSS3, and modern vanilla JavaScript**. It does not use React, Tailwind CSS, or any external JavaScript frameworks.

---

## 2. Complete Removal of All Emojis

In accordance with strict institutional guidelines, **all emojis have been removed** across the entire website, including navigation tabs, action buttons, notifications, section headers, forms, and status messages. SVG icons and CSS geometric indicators are used sparingly for visual clarity.

---

## 3. Flying Phoenix Visual Language & Color System

The visual design language takes inspiration from modern editorial publication design ("Flying Phoenix"), prioritizing **spaciousness, generous whitespace, soft lavender highlights, and high-contrast charcoal blocks**.

### Color Palette
- **Warm Cream**: `#F6F3EC` — Clean, non-glare surface for academic reading.
- **Deep Charcoal**: `#171717` — Establishes strong section breaks, instills institutional credibility, and forms high-contrast pill CTAs.
- **Muted Lavender**: `#B9A8D5` — Applied on secondary pills, login highlights, and feature badges.
- **Soft Lavender**: `#EAE3F3` / `#F4EFF9` — Applied on hero task boxes, quick action cards, and notice banners.
- **Typography**: `Manrope` for headings and `DM Sans` for body text.

---

## 4. Student Login Portal & Validation

A dedicated Student Login Portal view (`#view-login`) has been integrated into the existing project structure:

### Layout
- **Desktop**: Two-column editorial layout:
  - *Left Column*: Deep Charcoal card (`#171717`) with KTU branding, campus photography (`assets/images/ktu_hero.png`), and SSL security commitments.
  - *Right Column*: Minimal sign-in form with "Welcome back." heading, "Sign in to continue to your student services." text, and soft lavender accents.
- **Mobile**: Responsive stacked single-column layout.

### Functionality & Accessibility
- **Field Validation**: Verifies that both Registration Number and Password are provided. Displays inline error messages beside inputs if empty.
- **Value Preservation**: Retains the user's Registration Number input if validation fails.
- **Security Guarantee**: Never displays or stores passwords in `localStorage` or `sessionStorage`. Clears password input upon submission.
- **Show/Hide Password**: Accessible toggle button switching input type between `password` and `text`.
- **Forgot Password**: Links directly to the official KTU e-Governance recovery endpoint (`https://app.ktu.edu.in/`).
- **Demonstration Notice**: Explicitly indicates that the login is a frontend demonstration of the KTU student authentication interface.
