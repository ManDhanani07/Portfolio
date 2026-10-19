const EventEmitter = require("events");

/**
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Dedicated TaskEvents EventEmitter singleton module
 */
class TaskEvents extends EventEmitter {}

// Export singleton instance of TaskEvents
module.exports = new TaskEvents();
