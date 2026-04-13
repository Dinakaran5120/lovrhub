import React, { createContext, useCallback, useContext, useState } from 'react';

export type NotifType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'join_request'
  | 'join_approved';

export type AppNotification = {
  id: string;
  type: NotifType;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
};

type NotificationContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (type: NotifType, message: string, avatar?: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Pre-populated mock notifications
const initialNotifications: AppNotification[] = [
  { id: '1', type: 'like',         message: 'Alex liked your mood post 💔',                  time: '2m ago',   read: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
  { id: '2', type: 'comment',      message: 'Jordan commented: "Same here, stay strong 💕"', time: '15m ago',  read: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { id: '3', type: 'follow',       message: 'Sam joined your Night Owls community 🦉',        time: '1h ago',   read: false, avatar: 'https://images.unsplash.com/photo-1546572797-e8c933a75a1f?w=100' },
  { id: '4', type: 'join_request', message: 'Taylor requested to join Fitness & Dating 💪',   time: '2h ago',   read: true,  avatar: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?w=100' },
  { id: '5', type: 'like',         message: 'Morgan and 4 others liked your post 🔥',          time: '3h ago',   read: true,  avatar: 'https://images.unsplash.com/photo-1653419403196-ab64c4c740c3?w=100' },
  { id: '6', type: 'join_approved',message: 'You were approved to join VIP Lounge 👑',        time: 'Yesterday',read: true },
];

const notifIcons: Record<NotifType, string> = {
  like:          '❤️',
  comment:       '💬',
  follow:        '👥',
  join_request:  '🔔',
  join_approved: '✅',
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const addNotification = useCallback(
    (type: NotifType, message: string, avatar?: string) => {
      const n: AppNotification = {
        id: Date.now().toString(),
        type,
        message: `${notifIcons[type]} ${message}`,
        time: 'Just now',
        read: false,
        avatar,
      };
      setNotifications(prev => [n, ...prev]);
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead, markRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
