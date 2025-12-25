/**
 * Notification utilities for user feedback
 */

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

let notificationIdCounter = 0;

export const createNotification = (
  type: NotificationType,
  message: string,
  duration: number = 5000
): Notification => {
  return {
    id: `notification-${++notificationIdCounter}`,
    type,
    message,
    duration,
  };
};

export const showSuccess = (message: string): Notification => {
  return createNotification('success', message);
};

export const showError = (message: string): Notification => {
  return createNotification('error', message);
};

export const showInfo = (message: string): Notification => {
  return createNotification('info', message);
};

export const showWarning = (message: string): Notification => {
  return createNotification('warning', message);
};

