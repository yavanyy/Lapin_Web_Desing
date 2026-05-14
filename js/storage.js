export default class StorageService {
  static get(key, defaultValue) {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Storage parse error:', error);
      return defaultValue;
    }
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
