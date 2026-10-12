const NodeCache = require("node-cache");

// Initialize node-cache with stdTTL: 60 seconds (as specified in Practical 9)
// checkperiod: 120 seconds for automatic expired key sweeping
const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
  useClones: false,
});

// Cache Key Definitions
cache.KEYS = {
  ALL_TASKS: "all_tasks",
  taskKey: (id) => `task_${id}`,
};

module.exports = cache;
