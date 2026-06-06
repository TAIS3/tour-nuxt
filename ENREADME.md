# EZ Travel Platform

> 🚀 A modern, highly secure, multi-language travel e-commerce platform built by a solo full-stack developer.

EZ Travel is a comprehensive, full-stack travel e-commerce project designed to provide seamless booking experiences for both **individual tourist attractions** and **customized multi-day tour packages**. This project deeply integrates Nuxt 3 (SSR) with a PHP (FastAdmin) backend, successfully handling complex real-world workflows such as cross-border multi-language (I18n) routing, real-time dynamic pricing, calendar-based inventory management, and a unified international payment gateway (PayPal).

## ✨ Core Features

- **🌍 Deep Localization (Nuxt I18n)**: Seamless multi-language SSR routing and database-level dictionary synchronization.
- **🛍️ Complex E-commerce Workflows**: Supports booking for single items (tickets) and bundled packages (multi-day tours) with real-time dynamic pricing and calendar-based inventory locking.
- **💳 Unified Payment Gateway**: Refactored backend payment architecture based on DRY principles, seamlessly integrating PayPal REST APIs with robust webhook handling to prevent dropped orders.
- **📱 Modern Responsive UI**: Built with Vue 3 and Tailwind CSS / UnoCSS, featuring mobile-first interactions (e.g., smooth slide-in drawer navigations).
- **🛡️ Enterprise-Grade Security & Zero Trust**:
  - **Anti-Tampering**: Strict backend price calculation and inventory row locks (never trust frontend data).
  - **IDOR Prevention**: Rigorous ownership validation in core APIs like Refund and Ticket Verification to prevent Insecure Direct Object References.
  - **Database Hardening**: Advanced protection against complex conditional query vulnerabilities and SQL injections.

## 🛠️ Tech Stack

### Frontend
* **Framework**: Vue 3 (Composition API) + Nuxt 3 (Server-Side Rendering)
* **Styling**: Tailwind CSS / UnoCSS
* **Localization**: `@nuxtjs/i18n`
* **State Management**: Pinia
* **HTTP Client**: Axios / Nuxt `useFetch`

### Backend
* **Framework**: PHP + ThinkPHP 5 + FastAdmin
* **Database**: MySQL (complex joins and transaction management)
* **Caching**: Redis (for concurrency prevention and caching)
* **Integrations**: PayPal API

## 💡 Architecture Highlights

1. **Unified Payment Gateway (Payment.php)**: Eliminated business logic coupling by abstracting a unified payment controller. It dynamically handles different order types (tours/scenery) via strategy patterns, drastically reducing maintenance costs for future expansions (e.g., hotels, car rentals).
2. **Security-Driven Development**: Deep defensive designs against "business logic flaws" that traditional static scanners miss. All financial transaction endpoints feature strict contextual authorization.

## 🧑‍💻 Developer
Solo Designed & Developed
