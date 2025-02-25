import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendMessage, getMessage } from '../api/api.js';
import '../styles/conversation.css';


const Conversation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, users, chatData } = location.state || {};
  const [messages, setMessages] = useState(chatData?.chat || []);
  const [newMessage, setNewMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [time, setTime] = useState('');
  
  const messageHistoryRef = useRef(messages);
  const handleBackToMenu = (e) => {
    navigate('/menu', { state: { username } });

  }
  // Function to handle message input change
  const handleInputChange = (e) => {
    setNewMessage((prev) => e.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        username: username,
        message: newMessage,
        members: users.map(user => ({ member: user })),
      };

      const result = await sendMessage(messageData);

      console.log(result);

      if (result.success) {
        const newMsg = {
          sender: username,
          time: result.time,
          message: newMessage,
        };

        setMessages(prevMessages => [...prevMessages, newMsg]);
        messageHistoryRef.current = [...messageHistoryRef.current, newMsg];
        sessionStorage.setItem('messageHistory', JSON.stringify([...messages, newMsg]));

        setNewMessage('');
        setTime(result.time);
      } else {
        setResponseMessage('Failed to send message.');
        setTime('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setResponseMessage('Error sending message.');
      setTime('');
    }
  };

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
                setMessages(response.chat);
                sessionStorage.setItem('messageHistory', JSON.stringify(response.chat));
            } else {
                setResponseMessage(response.error || '');
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
        }, 500); 
    }

    return () => clearInterval(intervalId); // Cleanup on unmount
}, [username, users]);

  return (
    <div className="conversation">
      <h1>Conversation with {users.join(', ')}</h1>

      <div className="chat-history">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div className={`message ${msg.sender === username ? 'my-message' : 'other-message'}`} key={index}>
                <strong>{msg.sender}:</strong> <span>{msg.message}</span>
                <small className="message-time">{new Date(msg.time).toLocaleString()}</small>
            </div>
          
          ))
        )}
      </div>

      <div className="send-message">
        <textarea
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSendMessage} 
          disabled={!newMessage.length} 
        >
          Send Message
        </button>
      </div>
      {responseMessage && <p>{responseMessage}</p>}
      
      <div className='return-to-menu'>
        <button className="back-to-menu-button" onClick={handleBackToMenu}>Back to Menu</button>
      </div>
    </div>
    
  );
};

export default Conversation;
