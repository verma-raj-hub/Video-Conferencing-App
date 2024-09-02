import Rooms from '../models/Rooms.js';
import User from '../models/User.js';

const roomHandler = (socket) => {

    socket.on('create-room', async ({userId, roomName, newMeetType, newMeetDate, newMeetTime}) => {
        try {
            const newRoom = new Rooms({
                roomName,
                host: userId,
                meetType: newMeetType,
                meetDate: newMeetDate,
                meetTime: newMeetTime,
                participants: [],
                currentParticipants: []
            });
            const room = await newRoom.save();
            socket.emit("room-created", { roomId: room._id, meetType: newMeetType });
        } catch (error) {
            console.error('Error creating room:', error);
            socket.emit("error", { message: "Failed to create room" });
        }
    });

    socket.on('user-code-join', async ({roomId}) => {
        try {
            const room = await Rooms.findOne({ _id: roomId });
            if (room) {
                socket.emit("room-exists", { roomId });
            } else {
                socket.emit("room-not-exist");
            }
        } catch (error) {
            console.error('Error checking room existence:', error);
            socket.emit("error", { message: "Failed to check room existence" });
        }
    });

    socket.on('request-to-join-room', async ({roomId, userId}) => {
        try {
            const room = await Rooms.findOne({ _id: roomId });
            if (room) {
                if (userId === room.host) {
                    socket.emit('join-room', { roomId, userId });
                } else {
                    socket.emit("requesting-host", { userId });
                    socket.broadcast.to(roomId).emit('user-requested-to-join', { participantId: userId, hostId: room.host });
                }
            } else {
                socket.emit("room-not-exist");
            }
        } catch (error) {
            console.error('Error handling join request:', error);
            socket.emit("error", { message: "Failed to handle join request" });
        }
    });

    socket.on('join-room', async ({roomId, userId}) => {
        try {
            await Rooms.updateOne({ _id: roomId }, { $addToSet: { participants: userId, currentParticipants: userId } });
            await socket.join(roomId);
            console.log(`User: ${userId} joined room: ${roomId}`);
            socket.broadcast.to(roomId).emit("user-joined", { userId });
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit("error", { message: "Failed to join room" });
        }
    });

    socket.on("update-username", async ({ updateText, userId }) => {
        try {
            await User.updateOne({ _id: userId }, { $set: { username: updateText } });
            console.log("Updated username:", updateText, userId);
        } catch (error) {
            console.error('Error updating username:', error);
            socket.emit("error", { message: "Failed to update username" });
        }
    });

    socket.on("get-participants", async ({ roomId }) => {
        try {
            const room = await Rooms.findOne({ _id: roomId });
            if (room) {
                const { roomName, currentParticipants } = room;
                const users = await User.find({ _id: { $in: currentParticipants } }, { _id: 1, username: 1 }).exec();
                const usernames = users.reduce((acc, user) => {
                    acc[user._id.toString()] = user.username;
                    return acc;
                }, {});
                socket.emit("participants-list", { usernames, roomName });
            } else {
                socket.emit("room-not-exist");
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
            socket.emit("error", { message: "Failed to fetch participants" });
        }
    });

    socket.on("fetch-my-meets", async ({ userId }) => {
        try {
            const meets = await Rooms.find({ host: userId }, { _id: 1, roomName: 1, meetType: 1, meetDate: 1, meetTime: 1, createdAt: 1 }).exec();
            socket.emit("meets-fetched", { myMeets: meets });
        } catch (error) {
            console.error('Error fetching meets:', error);
            socket.emit("error", { message: "Failed to fetch meets" });
        }
    });

    socket.on("delete-meet", async ({ roomId }) => {
        try {
            await Rooms.deleteOne({ _id: roomId });
            socket.emit("room-deleted");
        } catch (error) {
            console.error('Error deleting meet:', error);
            socket.emit("error", { message: "Failed to delete meet" });
        }
    });

    socket.on("update-meet-details", async ({ roomId, roomName, newMeetDate, newMeetTime }) => {
        try {
            await Rooms.updateOne({ _id: roomId }, { $set: { roomName, meetDate: newMeetDate, meetTime: newMeetTime } });
            socket.emit("meet-details-updated");
        } catch (error) {
            console.error('Error updating meet details:', error);
            socket.emit("error", { message: "Failed to update meet details" });
        }
    });

    socket.on("user-left-room", async ({ userId, roomId }) => {
        try {
            await Rooms.updateOne({ _id: roomId }, { $pull: { currentParticipants: userId } });
            await socket.leave(roomId);
        } catch (error) {
            console.error('Error handling user leaving room:', error);
            socket.emit("error", { message: "Failed to handle user leaving room" });
        }
    });

    socket.on('user-disconnected', async ({ userId, roomId }) => {
        console.log(`User: ${userId} disconnected from room: ${roomId}`);
    });

    // chat
    socket.on("new-chat", async ({ msg, roomId }) => {
        try {
            socket.broadcast.to(roomId).emit("new-chat-arrived", { msg, room: roomId });
            console.log('Chat message received:', msg);
        } catch (error) {
            console.error('Error handling new chat message:', error);
            socket.emit("error", { message: "Failed to handle new chat message" });
        }
    });

};

export default roomHandler;
