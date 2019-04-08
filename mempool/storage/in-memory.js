function InMemoryStorage({ cancelableDelay }) {
  const storage = {};
  const has = key => storage[key] !== undefined;
  const get = key => (storage[key] || {}).value;
  const del = key => {
    if (!has(key)) {
      return undefined;
    }

    const { value, cancel } = storage[key];
    cancel();
    delete storage[key];

    return value;
  };
  const set = (key, value) => {
    if (has(key)) {
      return get(key);
    }

    storage[key] = {
      value,
      cancel: cancelableDelay(del, key),
    };

    return value;
  };

  return {
    has,
    get,
    del,
    set,
  };
}

module.exports = InMemoryStorage;
