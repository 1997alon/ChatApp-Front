import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMessage, getMessage } from '../api/api'; 
const CreateCon = () => {
    const location = useLocation();
    const { username, users, chatData } = location.state || {};

    const [message, setMessage] = useState(""); 
    const [responseMessage, setResponseMessage] = useState(""); 
    const [time, setTime] = useState(""); 
    const [messageHistory, setMessageHistory] = useState(chatData?.chat || []); 

    const handleSendMessage = async () => {
        if (!message.trim()) return; 

        try {
            const members = users.map(user => ({ member: user }));
            const messageData = {
                username: username,
                message: message,
                members: members
            };
            const result = await sendMessage(messageData);

            if (result.success) {
                const newMessage = { username, message, time: result.time };
                const updatedHistory = [...messageHistory, newMessage];

                setMessageHistory(updatedHistory);
                sessionStorage.setItem("messageHistory", JSON.stringify(updatedHistory)); 
                
                setResponseMessage(`${username} sent the message: "${message}"`);
                setTime(result.time); 
                setMessage("");
            } else {
                setResponseMessage("Failed to send message.");
                setTime("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setResponseMessage("Error sending message.");
            setTime("");
        }
    };

    useEffect(() => {
        const savedHistory = sessionStorage.getItem("messageHistory");
        if (savedHistory) {
            setMessageHistory(JSON.parse(savedHistory)); 
        }
    }, []);

    useEffect(() => {
        let intervalId;

        const fetchMessages = async () => {
            try {
                const messageRequest = {
                    username: username,
                    members: users.map(user => ({ member: user })),
                };

                const response = await getMessage(messageRequest);

                if (response.success && response.chat.length > 0) {
                    setMessageHistory(response.chat);
                    sessionStorage.setItem('messageHistory', JSON.stringify(response.chat));
                } else {
                    setResponseMessage(response.error || 'No messages found.');
                }
            } catch (err) {
                setResponseMessage('Failed to load messages: ' + err.message);
            }
        };

        if (username && users.length > 0) {
            fetchMessages(); 

            intervalId = setInterval(() => {
                if (document.visibilityState === 'visible') { 
                    fetchMessages();
                }
            }, 5000); 
        }

        return () => clearInterval(intervalId); 
    }, [username, users]);

    return (
        <div className="conversation-container">
            <h1>Conversation with {users.join(', ')}</h1>

            <div className="message-history">
                <h3>Message History:</h3>
                {messageHistory.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messageHistory.map((msg, index) => (
                        <div key={index} className={`message ${msg.username === username ? 'sent' : 'received'}`}>
                            <p><strong>{msg.username}</strong>: {msg.message}</p>
                            <p><small>Sent at: {new Date(msg.time).toLocaleString()}</small></p>
                        </div>
                    ))
                )}
            </div>

            <div className="send-message">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button 
                    onClick={handleSendMessage} 
                    disabled={!message.trim()} 
                >
                    Send Message
                </button>
            </div>

            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
    );
};

export default CreateCon;
