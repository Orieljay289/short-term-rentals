// logger.ts

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  console.log(`[frontend fetch] ${config?.method || "GET"} ${resource}`);
  return originalFetch(...args);
};

// Optional: Intercept XMLHttpRequest as well
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
  console.log(`[frontend xhr] ${method} ${url}`);
  return originalOpen.apply(this, arguments as any);
};
