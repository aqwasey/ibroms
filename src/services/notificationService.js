import { ref, reactive } from 'vue';

const notifications = reactive([]);
const notificationId = ref(0);

/**
 * Notification service for managing alert messages across the application
 */
const notificationService = {
  /**
   * Add a new notification
   * @param {object} notification - Notification object
   * @param {string} notification.type - Type of notification ('success', 'error', 'warning', 'info')
   * @param {string} notification.message - Message to display
   * @param {string} [notification.title] - Optional title
   * @param {boolean} [notification.dismissable] - Whether notification can be dismissed
   * @param {boolean} [notification.autoClose] - Whether notification should auto-close
   * @param {number} [notification.duration] - Duration in ms before auto-close
   * @returns {number} The notification ID
   */
  add(notification) {
    const id = notificationId.value++;
    notifications.push({
      id,
      type: notification.type || 'info',
      message: notification.message,
      title: notification.title || '',
      dismissable: notification.dismissable !== false,
      autoClose: notification.autoClose !== false,
      duration: notification.duration || 5000,
      timestamp: Date.now()
    });
    return id;
  },

  /**
   * Success notification shorthand
   * @param {string} message - Success message
   * @param {string} [title] - Optional title
   * @param {object} [options] - Additional options
   * @returns {number} The notification ID
   */
  success(message, title = '', options = {}) {
    return this.add({
      type: 'success',
      message,
      title,
      autoClose: true,
      ...options
    });
  },

  /**
   * Error notification shorthand
   * @param {string} message - Error message
   * @param {string} [title] - Optional title
   * @param {object} [options] - Additional options
   * @returns {number} The notification ID
   */
  error(message, title = '', options = {}) {
    return this.add({
      type: 'error',
      message,
      title,
      dismissable: true,
      ...options
    });
  },

  /**
   * Warning notification shorthand
   * @param {string} message - Warning message
   * @param {string} [title] - Optional title
   * @param {object} [options] - Additional options
   * @returns {number} The notification ID
   */
  warning(message, title = '', options = {}) {
    return this.add({
      type: 'warning',
      message,
      title,
      ...options
    });
  },

  /**
   * Info notification shorthand
   * @param {string} message - Info message
   * @param {string} [title] - Optional title
   * @param {object} [options] - Additional options
   * @returns {number} The notification ID
   */
  info(message, title = '', options = {}) {
    return this.add({
      type: 'info',
      message,
      title,
      ...options
    });
  },

  /**
   * Remove a notification by ID
   * @param {number} id - Notification ID to remove
   */
  remove(id) {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  },

  /**
   * Remove all notifications
   */
  clearAll() {
    notifications.splice(0, notifications.length);
  },

  /**
   * Get all current notifications
   * @returns {Array} Array of notification objects
   */
  getAll() {
    return notifications;
  }
};

export default notificationService;
