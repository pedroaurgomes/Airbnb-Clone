# 🏗️ Design and Technical Decisions

This document summarizes key design and technical choices made during the development of the Airbnb Clone project.

---

## 👤 User Roles and Account Management

The case description specified:

> "Users can create accounts as either guest or host."

For this MVP, the system strictly separates Guest and Host roles at signup.  
However, in a real-world scenario (similar to Airbnb, Uber, Amazon), the optimal UX would allow a **single account** to act as both Guest and Host dynamically, depending on actions taken.

✅ **MVP choice**: Role separation, aligned with the project description.

---

## 🚪 User Landing Flow

To minimize friction and optimize usability:

| User Type | Landing Page |
|:---|:---|
| Guest or (Guest + Host) | `/properties` (Browse Properties) |
| Host only | `/host/properties` (Host Dashboard) |

**Benefits:**
- Immediate access to primary action (browse or manage properties).
- Eliminates unnecessary intermediate clicks.
- Mirrors real-world platforms where users are dropped directly into their main activity.

---

## 💵 Booking Without Payment

Since the project description did not require payment features, the MVP assumes that bookings are **free of charge**.

✅ **Reasoning**:
- Focus on the core user flows: listing, browsing, and booking properties.
- Avoid unnecessary complexity.

**Principle applied**:  
> Always match implementation complexity to the problem requirements.

---

## 🧱 Minimal but Scalable MVP Principles

- **Simple but meaningful tests**:  
  Even in the MVP, minimal unit and integration tests were added to prevent technical debt and ensure scalability.

- **Authentication Security**:  
  Basic but sufficient authentication with JWT tokens to secure user actions.

- **API Versioning**:  
  Implemented from the start (`/api/v1`) to facilitate smooth future expansions.

---

## 🗄️ Database Choice: SQLite

For this MVP, **SQLite** was selected as the database engine.

**Reasons for choosing SQLite**:

| Reason | Why |
|:---|:---|
| Lightweight | No server installation needed. Simple to configure and operate locally. |
| Perfect for MVPs | Designed for small-to-medium applications and rapid prototyping. |
| Zero overhead | Single file database — easy to create, backup, and share. |
| Easy migration path | Project structure was kept ready to migrate to PostgreSQL or another RDBMS if necessary (via ORM abstraction with SQLModel). |
| Focus on product | Allows focusing on business logic and user flows instead of database infrastructure management at this stage. |

✅ **Real-world awareness**:  
If the platform needed to scale for production, a migration plan to PostgreSQL with Alembic migrations was already considered.

---

## 🆔 Synthetic ID Strategy: Integers vs UUIDs

| Option | Pros | Cons |
|:---|:---|:---|
| **UUIDs** | - Globally unique<br>- Harder to guess<br>- Good for distributed systems | - Harder to debug manually<br>- More storage<br>- Slightly slower queries |
| **Integers** | - Simpler to debug and test<br>- Faster queries<br>- Natural ordering | - Easier to guess (not a real issue with good design)<br>- Less scalable for distributed systems |

✅ **MVP choice**: Use **auto-incrementing integers** as primary keys.  
Prioritized simplicity, readability, and performance appropriate for an MVP context.

---
