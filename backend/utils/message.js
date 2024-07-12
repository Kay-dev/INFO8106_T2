const { CourierClient } = require("@trycourier/courier");
const cron = require('node-cron');
const EventMessage = require('../models/EventMessage');


const courier = new CourierClient({ authorizationToken: process.env.COURIER_API_KEY });

// search for messages that have not been sent in the last 3 hours
cron.schedule('0 * * * *', async () => {
    EventMessage.find({ status: false })
        .populate('event', 'title startTime')
        .exec(async (err, messages) => {
            if (err) {
                console.error(err);
                return;
            }
            const now = dayjs();
            const threeHoursLater = now.add(3, 'hour');
            for (const message of messages) {
                if (message.event.startTime.isBefore(threeHoursLater) && message.event.startTime.isAfter(now)) {
                    await sendTimedMessage(message.user, message.event.title)
                    message.status = true
                    await message.save()
                }
            }
        })
})

const sendTimedMessage = async (userId, eventName) => {
    try {
        const { requestId } = await courier.send({
            message: {
                to: {
                    user_id: userId,
                },
                template: "My First Notification",
                data: {
                    event_name: eventName,
                },
                routing: {
                    method: "single",
                    channels: ["push"],
                },
            },
        });
        console.log(`Message sent to user ${userId}. Request ID: ${requestId}`);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

exports.sendSubMessage = async (userId, eventName) => {
    try {
        const { requestId } = await courier.send({
            message: {
                to: {
                    user_id: userId,
                },
                content: {
                    title: "Subscribe successful",
                    body: "You have successfully subscribed to the event: " + eventName,
                },
                routing: {
                    method: "single",
                    channels: ["push"],
                },
            },
        });
        console.log(`Message sent to user ${userId}. Request ID: ${requestId}`);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

exports.sendUnsubMessage = async (userId, eventName) => {
    try {
        const { requestId } = await courier.send({
            message: {
                to: {
                    user_id: userId,
                },
                content: {
                    title: "Unsubscribe successful",
                    body: "You have successfully unsubscribed to the event: " + eventName,
                },
                routing: {
                    method: "single",
                    channels: ["push"],
                },
            },
        });
        console.log(`Message sent to user ${userId}. Request ID: ${requestId}`);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}