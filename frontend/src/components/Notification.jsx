import { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose }) => {
    // type: 'success', 'error', 'info', 'warning'

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const icons = {
        success: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#4ade80" />
            </svg>
        ),
        error: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z" fill="#f87171" />
            </svg>
        ),
        info: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#3b82f6" />
            </svg>
        )
    };

    return (
        <div className={`notification-card notification-${type}`}>
            <div className="notification-icon">
                {icons[type] || icons.info}
            </div>
            <div className="notification-content">
                <div className="notification-title">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div className="notification-message">{message}</div>
            </div>
            <button onClick={onClose} className="notification-close">
                ×
            </button>
            <div className="notification-progress"></div>
        </div>
    );
};

export default Notification;
