import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async(req, res) => {
try{
    const loggedInUserId = req.user._id; // Get the logged-in user's ID from the request object
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }) // Exclude the logged-in user from the results
        .select('-password -__v') // Exclude password and __v fields from the results
    res.status(200).json(filteredUsers);
}catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }

  
};

export const getMessages = async(req, res) => {
    try{
        const {id:userToChatId} = req.params; // Get the user ID from the request parameters
        const myId = req.user._id; // Get the sender ID from the request object
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        });

        res.status(200).json(messages);
    }catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const sendMessage = async(req, res) => {
    try{
        const {text, image} = req.body; // Get the message text and image from the request body
        const {id:receiverId} = req.params; // Get the receiver ID from the request parameters
        const senderId = req.user._id; // Get the sender ID from the request object

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }

        const newMessage = new Message({
            text,
            image: imageUrl,
            sender: senderId,
            receiver: receiverId,
        });
    
        await newMessage.save();

        // todo: real-time functionality goes here using socket.io
        res.status(201).json(newMessage);
    }catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
