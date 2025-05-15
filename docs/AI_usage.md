# 🤖 AI Usage Report

This document explains how AI tools were leveraged during the development of the Airbnb Clone project, in accordance with Paladium's case requirements.

---

## 🛠️ Use Cases

### 🧠 ChatGPT (AI Mentor and Assistant)

| Area | How AI Helped |
|:---|:---|
| **Learning and Concept Discussions** | - Acted as a personal tutor to deepen understanding of stack choices, system design, and software engineering best practices. |
| **Scaffolding** | - Assisted in setting up the backend, frontend, folder structure, and basic configurations.<br>- Generated initial project skeleton (branch: `init/scaffold`). |
| **Architecture Design** | - Discussed user roles (Host vs Guest) and account management strategies. |
| **Debugging** | - Helped interpret and solve error messages more quickly. |
| **Frontend Component Building** | - Generated Next.js components based on hand-drawn sketches and requirements, accelerating the UI development. |
| **Documentation** | - Generated the structure and summarized/organized the content of these documentation files based
on notes I wrote down during development. |

---

### 🧠 Cursor (AI-enhanced Coding Environment)

| Area | How AI Helped |
|:---|:---|
| **Dependency Management and System Debugging** | - Diagnosed and fixed dependency issues faster because Cursor had access to the full project context. |
| **Pair Programming** | - Assisted during coding sessions as a real-time AI collaborator. |
| **Test Generation** | - Helped suggest tests and improve code reliability where appropriate. |

---

## ⚡ Cautions and Limitations Observed

While AI tools were extremely helpful, I remained critically involved throughout the project. Key precautions taken:

- **Code Review and Validation**:  
  ChatGPT sometimes proposed oversimplified solutions, favoring ease over best engineering practices.
  
  Example:
  - It tended to **hardcode** API URLs instead of guiding to a more scalable approach (like using environment variables via `.env` files).

- **Architectural Oversight**:  
  All structural and architectural decisions were carefully reviewed and validated manually before adoption.

- **Best Practices Awareness**:  
  Efficiency, scalability, and maintainability were prioritized, sometimes requiring manual refinements after AI-generated suggestions.

---

## 🧩 Summary

Human in the loop is definetely mandatory, but the productivity enhancement is astonishing! Not only software engineers deliver faster results, but we can also learn much faster. 

