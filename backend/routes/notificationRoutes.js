const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// Get notifications
router.get("/", getNotifications);

// Get one notification
router.get("/:id", getNotificationById);

// Mark notification as read
router.put("/:id/read", markAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    type VARCHAR(30) NOT NULL DEFAULT 'General',

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_notifications_type
        CHECK (
            type IN (
                'General',
                'Due Date',
                'Overdue',
                'Hold',
                'Circulation',
                'System'
            )
        )
);