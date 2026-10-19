# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Course / Outcomes:** CO4 / PO3, PO5  
**Domain:** Advanced Web Development / Node.js Backend Engineering  
**Technology Stack:** Node.js native `EventEmitter` (`events` module), Express.js, MongoDB / Mongoose, Postman.

---

## 1. Objective
To implement non-blocking asynchronous background processing using Node.js native `EventEmitter` without external message broker dependencies (such as RabbitMQ, Kafka, or Redis).

---

## 2. Architecture & Flow Diagram

```
                Client (Postman / Frontend)
                            │
               POST /api/tasks (JSON body)
                            ▼
              Express Router (`taskRoutes.js`)
                            │
              1. Save Task to MongoDB
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
2. Immediate HTTP Response (201)        3. `taskEvents.emit('task-created', taskData)`
   Client receives task in ~50ms                 │
   (Unblocked!)                                  ▼
                                        `listeners.js` Event Listener
                                                 │
                                        4. Non-blocking Async Job
                                           (Simulated 2-sec delay: setTimeout)
                                                 │
                                                 ▼
                                        5. Logs notification:
                                           • Task title
                                           • Assigned user
                                           • Completion timestamp (+2.0s later)
```

---

## 3. Key Analysis Questions & Answers (Viva / Theory)

### Q1: Why does emitting an event not block the API response, even though both run on the same Node.js process?
**Answer:**  
Node.js runs on a single-threaded Event Loop. When `taskEvents.emit()` triggers a listener that initiates an asynchronous non-blocking operation (such as `setTimeout`, file I/O, database logging, or network requests), Node.js registers the callback into the event loop phases (e.g., Timers or Poll queue) and immediately returns control. The HTTP response is dispatched synchronously through `res.status(201).json(task)`, while the listener callback executes later in a subsequent tick of the event loop.

### Q2: What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?
**Answer:**  
If the notification logic (e.g., sending emails, SMS, external webhook calls, or audit logging) were placed directly inline inside the route handler with `await`, the API response would be blocked until that entire operation finished. For instance, a 2-second email delivery would inflate client response latency from **~40ms to >2040ms**. Using `EventEmitter` decouples secondary side effects from the primary request-response cycle, keeping API response latency under 50ms.

### Q3: Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?
**Answer:**  
- **Why it is great for this scale:** It is built directly into Node.js runtime, requires zero third-party dependencies, introduces zero network overhead, and has ultra-fast in-memory dispatch.
- **Why it is insufficient for enterprise/high-scale production:**
  1. **In-Memory Volatility:** Events exist solely in process memory. If the Node.js process crashes, restarts, or runs out of memory, pending events in the queue are permanently lost.
  2. **No Horizontal Distribution:** Standard `EventEmitter` cannot emit events across multiple container replicas or server instances.
  3. **No Backpressure or Retries:** Lacks persistent queues, worker rate-limiting, dead-letter queues (DLQ), and automatic retry semantics offered by dedicated message brokers (RabbitMQ, Apache Kafka, BullMQ/Redis).

---

## 4. Code Implementation Files

1. **`backend/events.js`**: Singleton EventEmitter subclass.
2. **`backend/listeners.js`**: Registered listeners for `'task-created'`, `'task-deleted'`, and `'error'`.
3. **`backend/routes/taskRoutes.js`**: Emits events immediately after database operations.
4. **`backend/models/Task.js`**: Includes `assignedUser` schema property.
5. **`backend/server.js`**: Loads `listeners.js` on startup.
6. **`backend/verify_events_script.js`**: Automated verification test suite.

---

## 5. Lab Practical File Screenshot Guide

Here are the **4 exact screenshots** to capture and paste into your practical file/journal:

### Screenshot 1: Postman — Immediate Task Creation (POST /api/tasks)
- **Title:** `Fig 10.1: Immediate HTTP 201 Response on Task Creation in Postman`
- **Method & URL:** `POST http://localhost:5000/api/tasks`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_jwt_token>`
- **Body (raw JSON):**
  ```json
  {
    "title": "Build Practical 10 Lab Report",
    "description": "Demonstrating EventEmitter architecture",
    "priority": "High",
    "status": "Pending",
    "assignedUser": "student@college.edu"
  }
  ```
- **What to show in the screenshot:**
  - Status code: `201 Created`
  - Response time: **< 100ms** (highlight this in Postman)
  - Returned task JSON showing `assignedUser` and `_id`.

---

### Screenshot 2: Server Console — Timestamp Comparison Proof (Async Non-Blocking Proof)
- **Title:** `Fig 10.2: Server Console Log Proving Non-Blocking Execution with Timestamps`
- **What to show in the screenshot (Terminal output):**
  ```text
  [API] Response sent at 2026-10-19T16:39:37.490Z (Status: 201 Created, Task: "Build Practical 10 Lab Report")
  [Notification Listener] Event 'task-created' received at 2026-10-19T16:39:37.495Z for Task: "Build Practical 10 Lab Report"
  [Notification Listener] [ASYNC COMPLETED +2000ms] Notification dispatched successfully!
     • Title: "Build Practical 10 Lab Report"
     • Assigned User: student@college.edu
     • Finished At: 2026-10-19T16:39:39.508Z
  ```
- **Explanation to write in report:**
  > Note that the API response was returned at `16:39:37.490Z`, while the notification finished at `16:39:39.508Z` (+2018ms later). This proves the client was not forced to wait for the slow notification handler to complete.

---

### Screenshot 3: Postman & Console — Supplementary Problem 1 (Task Deletion Event)
- **Title:** `Fig 10.3: Emitting and Handling 'task-deleted' Event on DELETE /api/tasks/:id`
- **Method & URL:** `DELETE http://localhost:5000/api/tasks/<task_id>`
- **What to show in the screenshot:**
  - Postman returns `200 OK` with message `"Task deleted successfully"`.
  - Server console outputs:
    ```text
    [API] Response sent at 2026-10-19T16:39:40.050Z (Status: 200 OK)
    [Notification Listener] Event 'task-deleted' received at 2026-10-19T16:39:40.053Z
    [Notification Listener] [ASYNC COMPLETED] Task Deleted Notification Processed!
       • Deleted Task: "Build Practical 10 Lab Report"
       • Deleted By: student@college.edu
    ```

---

### Screenshot 4: Terminal — Automated Verification Suite & Error Event (Supplementary Problem 2)
- **Title:** `Fig 10.4: Automated Test Execution Output with Comparison Table & Error Listener`
- **Command executed:** `npm run test:events`
- **What to show in the screenshot:**
  - The verification summary table showing:
    - `POST /api/tasks (API Response)` -> `~106ms`
    - `task-created Listener` -> `~2000ms simulated delay`
    - `DELETE /api/tasks/:id` -> `~42ms`
    - `Background Listener Error` -> `Caught by error listener; zero process crash`
  - The green checkmark: `ALL PRACTICAL 10 REQUIREMENTS & SUPPLEMENTARY CHECKS PASSED SUCCESSFULLY!`

---

## 6. How to Verify Anytime
1. Start the backend:
   ```bash
   cd e:\AWDF\backend
   npm start
   ```
2. In a second terminal, run the automated test:
   ```bash
   cd e:\AWDF\backend
   npm run test:events
   ```
