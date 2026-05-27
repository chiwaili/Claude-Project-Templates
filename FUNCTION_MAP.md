# [Project Name] — Function Map

A reference for how all functions in the app connect and what each one does. Keep this updated when major functions are added or removed; line numbers are intentionally omitted as they go stale quickly.

---

## Architecture Overview

```mermaid
graph LR
  subgraph Browser
    UI["React Components"]
  end

  subgraph Services["Client Services"]
    SVC["services/"]
  end

  subgraph Backend
    CF["Cloud Function(s)"]
    AI["AI API"]
  end

  subgraph Firebase
    AUTH["Firebase Auth"]
    FS["Firestore"]
  end

  UI --> SVC
  SVC --> CF
  CF --> AI
  CF --> FS
  UI --> AUTH
```

---

## Key User Flows

### 1. [Primary Flow Name]

```mermaid
flowchart TD
  A["Step 1"] --> B["Step 2"]
  B --> C["Step 3"]
```

---

## Function Reference

### `src/lib/[filename].ts`

| Function | Description | Key Interactions |
|---|---|---|
| `functionName` | What it does | What it calls / what calls it |
