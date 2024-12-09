import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { Flag, Bell, ShoppingCart, AlertTriangle } from "lucide-react";

const notificationTypes = {
  flag: {
    icon: Flag,
    textColor: "text-orange-500",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-500",
    dotColor: "bg-orange-500",
  },
  reminder: {
    icon: Bell,
    textColor: "text-blue-500",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
    dotColor: "bg-blue-500",
  },
  bookingOpen: {
    icon: ShoppingCart,
    textColor: "text-green-500",
    bgColor: "bg-green-100",
    iconColor: "text-green-500",
    dotColor: "bg-green-500",
  },
  outOfStock: {
    icon: AlertTriangle,
    textColor: "text-red-500",
    bgColor: "bg-red-100",
    iconColor: "text-red-500",
    dotColor: "bg-red-500",
  },
};

const NotificationItem = ({ notification, handleMarkAsRead }) => {
  const { type, title, message, date, isRead, _id } = notification;
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

  const notificationType = notificationTypes[type] || {
    icon: Bell,
    textColor: "text-gray-500",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-500",
  };

  const IconComponent = notificationType.icon;

  // Define classes based on isRead status
  const containerClasses = `
    flex items-center p-3 gap-4 border rounded-lg border-gray-200 
    ${
      isRead
        ? "bg-gray-100 text-gray-500 hover:cursor-default"
        : "bg-white shadow-sm hover:bg-gray-50"
    }
    transition-colors duration-300
  `;

  const titleClasses = `
    text-lg font-semibold
    ${isRead ? "text-gray-500" : notificationType.textColor}
  `;

  const messageClasses = `
    mt-1
    ${isRead ? "text-gray-500" : "text-gray-700"}
  `;

  const timeAgoClasses = `
    text-sm
    ${isRead ? "text-gray-400" : "text-gray-500"}
  `;

  const iconContainerClasses = isRead
    ? "bg-gray-100"
    : notificationType.bgColor;

  const iconColorClasses = isRead
    ? "text-gray-500"
    : notificationType.iconColor;

  return (
    <div
      className={containerClasses}
      aria-label={`Notification: ${title}. ${message}. Received ${timeAgo}.`}
      role="button"
      tabIndex={0}
      onClick={() => handleMarkAsRead(_id)}
    >
      {/* Icon Container */}
      <div
        className={`flex-shrink-0 self-start ${iconContainerClasses} rounded-full p-2`}
      >
        <IconComponent
          className={`w-6 h-6 ${iconColorClasses}`}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className={titleClasses}>{title}</h3>
        <p className={messageClasses}>{message}</p>
        <span className={timeAgoClasses}>{timeAgo}</span>
      </div>

      {/* Dot for Unread Notifications */}
      {!isRead && (
        <div className="flex-shrink-0 flex items-center justify-center ml-2">
          <span
            className={`w-3 h-3 rounded-full ${notificationType.dotColor}`}
          />
        </div>
      )}
    </div>
  );
};

NotificationItem.propTypes = {
  handleMarkAsRead: PropTypes.func.isRequired,
  notification: PropTypes.shape({
    type: PropTypes.oneOf(["flag", "reminder", "bookingOpen", "outOfStock"])
      .isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default NotificationItem;
