const notification = require("../models/NotificationModel");
const asyncHandler = require("express-async-handler");

const createNotification = asyncHandler(async (req, res) => {
    const { chatId } = req.query;
    if (!chatId) {
        console.log("ChatId param not sent with request");
        return res.sendStatus(400);
    }
    try {
        let prevnotification = await notification.findOne({ chatId: chatId });
        if (prevnotification) {
            prevnotification.count += 1;
            const updatedNotification = await prevnotification.save();
            res.status(200).json(updatedNotification);
        } else {
            const newNotification = await notification.create({
                chatId: chatId, 
                receiverId: req.user._id,
                count: 1,
            });
            res.status(200).json(newNotification);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const getnotifications = asyncHandler(async (req, res) => {
    try {
        let notifications = await notification.find({ receiverId: req.user._id })
            .populate({
                path: 'chatId',
                populate: [
                    {
                        path: 'Users',
                        model: 'userlogins',
                        select: '-password'
                    },
                    {
                        path: 'latestMessage',
                        model: 'Message',
                        populate: {
                            path: 'sender',
                            model: 'userlogins',
                            select: 'username email profile'
                        }
                    },
                    {
                        path: 'groupAdmin',
                        model: 'userlogins',
                        select: '-password'
                    }
                ]
            })
            .sort({ createdAt: -1 });
            notifications = notifications.map(notif => {
                const notifObj = notif.toObject();
                if (notifObj.chatId) {
                    notifObj.chatId.count = notifObj.count;
                    notifObj.chatId.notificationId = notifObj._id;
                    // notifObj.chatId.receiverId = notifObj.receiverId;
                }
                return notifObj.chatId;
            });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const removenotifications = asyncHandler(async (req, res) => {
    const { chatId } = req.query;
    if (!chatId) {
        console.log("chatId param not sent with request");
        return res.sendStatus(400);
    }
    try {
        const removedNotification = await notification.findOneAndDelete({ chatId })
        if (removedNotification) {
            res.status(200).json({ message: "Notification removed successfully" });
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = {createNotification, getnotifications, removenotifications};