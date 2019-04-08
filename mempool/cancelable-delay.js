function CancelableDelay(ttl) {
  return (fn, ...args) => {
    const handler = setTimeout(fn, ttl * 1000, ...args);
    return () => {
      if (handler) {
        clearTimeout(handler);
      }
    };
  };
}

module.exports = CancelableDelay;
