import { Bell } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import socket from "@/utilities/socket";
import { useEffect, useState, useRef } from "react";
import NotificationListView from "./NotificationListView";
import axios from "axios";
import { Switch } from "@/components/ui/switch"; // Import shadcn's Switch component

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isShaking, setIsShaking] = useState(false); // State for shake animation
  const [showUnreadOnly, setShowUnreadOnly] = useState(false); // State for toggle

  // Initialize the audio instance
  const notificationAudio = useRef(null);
  useEffect(() => {
    // If using public directory
    notificationAudio.current = new Audio("/assets/sounds/notification.mp3");
  }, []);

  useEffect(() => {
    // Function to sort notifications from newest to oldest
    const sortNotifications = (notifArray) => {
      return notifArray.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    };

    // Handle initial notifications
    const handleInitialNotifications = (initialNotifications) => {
      console.log("Received initial notifications:", initialNotifications);
      const sortedNotifications = sortNotifications(initialNotifications);
      setNotifications(sortedNotifications);
      triggerShake();
    };

    // Handle new notifications
    const handleNewNotification = (notification) => {
      console.log("Received new notification:", notification);
      setNotifications((prevNotifications) => {
        const updatedNotifications = [notification, ...prevNotifications];
        return sortNotifications(updatedNotifications);
      });
      // Play notification sound
      if (notificationAudio.current) {
        notificationAudio.current.play().catch((error) => {
          console.error("Error playing notification sound:", error);
        });
      }
      // Trigger shake animation
      triggerShake();
    };

    // Listen for 'initialNotifications' event
    socket.on("initialNotifications", handleInitialNotifications);

    // Listen for 'newNotification' events
    socket.on("newNotification", handleNewNotification);

    // Cleanup on unmount
    return () => {
      socket.off("initialNotifications", handleInitialNotifications);
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  // Function to trigger shake animation
  const triggerShake = () => {
    setIsShaking(false); // Reset the state
    // Use a timeout to allow the state to reset before re-triggering
    setTimeout(() => setIsShaking(true), 10);
  };

  // Handler for animation end to reset shake state
  const handleAnimationEnd = () => {
    setIsShaking(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Calculate unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead // Ensure consistent property name
  ).length;

  // Filter notifications based on toggle
  const displayedNotifications = showUnreadOnly
    ? notifications.filter((notification) => !notification.isRead)
    : notifications;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={`relative ${isShaking ? "animate-shake" : ""}`}
          onAnimationEnd={handleAnimationEnd}
        >
          <Bell className="hover:text-gray-700 hover:cursor-pointer" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[40vh] p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Notifications</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Unread Only</span>
            <Switch
              checked={showUnreadOnly}
              onCheckedChange={setShowUnreadOnly}
              className="bg-gray-200 focus:ring-0"
            />
          </div>
        </div>
        <NotificationListView
          notifications={displayedNotifications}
          handleMarkAsRead={handleMarkAsRead}
        />
      </HoverCardContent>
    </HoverCard>
  );
}
