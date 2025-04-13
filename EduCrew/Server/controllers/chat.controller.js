export const getMessage = (req, res) => {
    try {
        const {groupId} = req.params;
        const {userId} = req.userId;
        res.send("🔹 Incoming request body:", );

        res.status(200).json({
            success: true,
            message: "Message get successfully",
        });
        
    }
    catch (error) {
        console.error("❌ Error in getMessage:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const sendMessage = (req, res) => {
    try{
        
        res.status(200).json({
        success: true,  
        message: "Message sent successfully",
    });

    }
    catch (error) {
        console.error("❌ Error in sendMessage:", error.message);
        res.status(500).json({ error: error.message });
    }   
};