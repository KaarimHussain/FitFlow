import { useNotification } from '@/context/notification-context';
import { Notification } from './notification';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end gap-2 px-4 py-6 sm:p-6"
    >
      <div className="flex w-full flex-col items-end space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}