/**
 * Storage shim — replaces Claude's window.storage API with localStorage.
 * Drop-in compatible: all existing get/set/delete/list calls just work.
 */
export function initStorage() {
  if (window.storage) return; // already initialized

  window.storage = {
    async get(key, _shared = false) {
      const value = localStorage.getItem(key);
      return value !== null ? { key, value, shared: _shared } : null;
    },

    async set(key, value, _shared = false) {
      localStorage.setItem(key, value);
      return { key, value, shared: _shared };
    },

    async delete(key, _shared = false) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: _shared };
    },

    async list(prefix = '', _shared = false) {
      const keys = Object.keys(localStorage).filter(
        (k) => !prefix || k.startsWith(prefix)
      );
      return { keys, prefix, shared: _shared };
    },
  };
}
