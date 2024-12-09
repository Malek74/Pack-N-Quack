import notificationSchema from '../models/notificationSchema.js';

export const showMyNotifications = async (req, res) => {
    console.log("ANA HENA");
    try {
        const notifications = await notificationSchema.find({ 'user.id': req.user._id });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const markAsRead = async (req, res) => {
    console.log(req.params.id);
    try {
        const notification = await notificationSchema.findOneAndUpdate({ _id: req.params.id }, { isRead: true }, { new: true });
        
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}