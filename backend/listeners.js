const taskEvents = require("./events");

/**
 * Practical 10: Event Listeners Registration
 * Demonstrates non-blocking background processing via Node.js EventEmitter.
 */

// =============================================================================
// 1. Task Created Listener (with simulated slow async notification: 2 seconds)
// =============================================================================
taskEvents.on("task-created", (task) => {
  const receivedAt = new Date().toISOString();
  console.log(`[Notification Listener] Event 'task-created' received at ${receivedAt} for Task: "${task.title}" (ID: ${task._id})`);

  // Simulate a slow background job (e.g. sending email, push notifications, audit logging)
  // Artificial delay: 2000ms
  setTimeout(() => {
    try {
      // Supplementary Problem: Catch errors and emit to error listener
      if (task.simulateError) {
        throw new Error(`Simulated async background failure for task: "${task.title}"`);
      }

      const completedAt = new Date().toISOString();
      console.log(
        `[Notification Listener] [ASYNC COMPLETED +2000ms] Notification dispatched successfully!\n` +
        `   • Title: "${task.title}"\n` +
        `   • Assigned User: ${task.assignedUser || "Unassigned"}\n` +
        `   • Finished At: ${completedAt}`
      );
    } catch (err) {
      // Forward background error to EventEmitter 'error' listener without crashing server
      taskEvents.emit("error", err);
    }
  }, 2000);
});

// =============================================================================
// 2. Task Deleted Listener (Supplementary Problem 1)
// =============================================================================
taskEvents.on("task-deleted", (task) => {
  const receivedAt = new Date().toISOString();
  console.log(`[Notification Listener] Event 'task-deleted' received at ${receivedAt} for Task: "${task.title}" (ID: ${task._id})`);

  // Asynchronous cleanup / alert notification
  setTimeout(() => {
    const completedAt = new Date().toISOString();
    console.log(
      `[Notification Listener] [ASYNC COMPLETED] Task Deleted Notification Processed!\n` +
      `   • Deleted Task: "${task.title}"\n` +
      `   • Task ID: ${task._id}\n` +
      `   • Deleted By: ${task.deletedBy || "System"}\n` +
      `   • Time: ${completedAt}`
    );
  }, 1000);
});

// =============================================================================
// 3. Error Event Listener (Supplementary Problem 2)
// =============================================================================
taskEvents.on("error", (err) => {
  console.error(
    `[Notification Listener] [ERROR CAUGHT] Background processing encountered an error at ${new Date().toISOString()}:\n` +
    `   • Reason: ${err.message}`
  );
});

console.log("⚡ Practical 10: Task event listeners registered successfully ('task-created', 'task-deleted', 'error').");
