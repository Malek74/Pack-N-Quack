import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "./NotificationItem";
import PropTypes from "prop-types";

NotificationListView.propTypes = {
  handleMarkAsRead: PropTypes.func,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["flag", "reminder", "bookingOpen", "outOfStock"])
        .isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      isRead: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default function NotificationListView({
  notifications,
  handleMarkAsRead,
}) {
  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="h-[30vh]">
        {notifications.map((notif, index) => (
          <div key={index} className="py-2 mr-4">
            <NotificationItem
              key={index}
              notification={notif}
              handleMarkAsRead={handleMarkAsRead}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
