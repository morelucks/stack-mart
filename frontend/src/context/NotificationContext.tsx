import React, { createContext, useContext, useState, useCallback } from 'react';

export interface RewardNotification {
    id: string;
    title: string;
    message: string;
    points?: number;
    type: 'points' | 'achievement' | 'referral';
}

interface NotificationContextType {
    notifications: RewardNotification[];
    addNotification: (notification: Omit<RewardNotification, 'id'>) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<RewardNotification[]>([]);

    const addNotification = useCallback((n: Omit<RewardNotification, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications(prev => [...prev, { ...n, id }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {notifications.map(n => (
                    <NotificationToast key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};

const NotificationToast: React.FC<{ notification: RewardNotification; onClose: () => void }> = ({ notification, onClose }) => {
    return (
        <div
            className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 shadow-2xl min-w-[300px] animate-in slide-in-from-right-8 fade-in flex items-start gap-4 cursor-pointer hover:border-orange-500/30 transition-all"
            onClick={onClose}
        >
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-xl shrink-0">
                {notification.type === 'points' ? '✨' : notification.type === 'achievement' ? '🏆' : '🤝'}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{notification.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                {notification.points && (
                    <div className="mt-2 text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                        +{notification.points} BUILDER POINTS
                    </div>
                )}
            </div>
            <button className="text-gray-600 hover:text-white transition-colors">
                <span className="text-lg">×</span>
            </button>
        </div>
    );
};
