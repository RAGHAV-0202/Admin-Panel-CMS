import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Notification from "../models/notification.models.js";

const createNotification = asyncHandler(async (req, res) => {
    const { image, backgroundImage, text, coupon, couponCode  , secondaryText } = req.body;
    
    if (!text) {
        throw new apiError(400, "Notification text is required");
    }
    
    const notification = await Notification.create({
        image,
        backgroundImage: backgroundImage || undefined,
        text,
        coupon: coupon || false,
        couponCode: couponCode || undefined,
        secondaryText : secondaryText 
    });
    
    return res.status(201).json(
        new ApiResponse(201, notification, "Notification created successfully")
    );

    
});

const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({});
    
    return res.status(200).json(
        new ApiResponse(200, notifications, "Notifications retrieved successfully")
    );
});


const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
        throw new apiError(404, "Notification not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Notification deleted successfully")
    );
});

const getNotificationById = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
        throw new apiError(404, "Notification not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, notification, "Notification retrieved successfully")
    );
});

const updateNotification = asyncHandler(async (req, res) => {
    const { image, backgroundImage, text, coupon, couponCode } = req.body;
    
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
        throw new apiError(404, "Notification not found");
    }
    
    if (text) notification.text = text;
    if (image !== undefined) notification.image = image;
    if (backgroundImage !== undefined) notification.backgroundImage = backgroundImage;
    if (coupon !== undefined) notification.coupon = coupon;
    if (couponCode !== undefined) notification.couponCode = couponCode;
    
    await notification.save();
    
    return res.status(200).json(
        new ApiResponse(200, notification, "Notification updated successfully")
    );
});

export { 
    createNotification, 
    getNotifications, 
    deleteNotification,
    getNotificationById,
    updateNotification
};