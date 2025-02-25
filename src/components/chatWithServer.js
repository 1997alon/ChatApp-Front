import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { chatWithServer } from '../api/api.js';

const ChatWithServer = () => {
    const location = useLocation();
    const { username } = location.state || {}; 

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState('');
    const chatBoxRef = useRef(null); 

    useEffect(() => {
        if (username) {
            setChatHistory(prevChat => [{ sender: 'Server', text: `Welcome ${username}!` }]);
        }
    }, [username]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        setChatHistory(prevChat => [...prevChat, { sender: 'You', text: message }]);
        setError(''); 

        const response = await chatWithServer(message, username);
        console.log('Response data:', response);
        if (response.success) { 
            setChatHistory(prevChat => [...prevChat, { sender: 'Server', text: response.response }]);
        } else {
            setError(response.error);
        }

        setMessage('');
    };

    return (
        <div className="chatWithServer">
            <h1>Chat with {username || 'Server'}</h1>
            <div className="chat-box" ref={chatBoxRef}>
                {chatHistory.map((msg, index) => (
                    <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
                ))}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage} disabled={!message.trim()}>Send</button>
        </div>
    );
};

export default ChatWithServer;
