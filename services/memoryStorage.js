class MemoryStorage {
  constructor() {
    this.codes = {};
    this.tokens = {};
  }

  save(param, key, value) {
    this[param][key] = value;
  }

  find(param, key) {
    return this[param] && this[param][key] || null;
  }

  delete(param, key) {
    delete this[param][key];
  }
}

module.exports = new MemoryStorage();
