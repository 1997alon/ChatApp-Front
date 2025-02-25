import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuUser, getConversations } from '../api/api';
import '../styles/menu.css';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || 'Guest';

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

 
  const fetchChats = async () => {
    setLoading(true);
    try {
      const result = await menuUser({ action: "GET CONVERSATIONS", username });
      if (result.success) {
        setChats(result.chats);
      } else {
        alert(result.error || "Failed to fetch chats.");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchChats, 4000); 

    return () => {
      clearInterval(intervalId); 
    };
  }, [username]); 

  const handleNewConversation = async () => {
    if (showUserList) {
      setShowUserList(false);
      return;
    }
  
    setLoading(true);
    setShowUserList(true);
    try {
      const result = await menuUser({ action: "NEW CONVERSATION", username });
      if (result.success) {
        setUsers(result.users.map(userObj => userObj.user));
      } else {
        alert(result.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChats = async () => {
    setShowChats(prev => !prev);
    if (!showChats) {
      setLoading(true);
      try {
        const result = await menuUser({ action: "CHATS", username });
        if (result.success) {
          setChats(result.chats);
        } else {
          alert(result.message || "Failed to fetch chats.");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(user)
        ? prevSelected.filter(u => u !== user)
        : [...prevSelected, user]
    );
  };

  const handleCreateConversation = async () => {
    setLoading(true);
    try {
      const usersToSend = selectedUsers.map(user => ({ user }));
      const result = await menuUser({
        action: "CREATE",
        username,
        users: usersToSend,
      });

      if (result.success) {
        navigate('/conversation', { state: { username, users: selectedUsers, chatData: {} } });
      } else {
        alert(result.message || "Failed to create conversation.");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setLoading(true);
    try {
      const chatData = await menuUser({
        action: "SELECT CHAT",
        username,
        users: chat.chat.map(userObj => ({ user: userObj.user })),
      });

      if (chatData.success) {
        setCurrentChat(chat);
        setChatMessages(chatData.chat);
        const chatUsers = chat.chat.map(userObj => userObj.user);
        navigate('/conversation', { state: { username, users: chatUsers, chatData } });
      } else {
        alert(chatData.message || "Failed to fetch chat.");
      }
    } catch (error) {
      console.error("Error selecting chat:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu">
      <h2>Welcome, {username}!</h2>
      <p className='Menu-theme'>Menu</p>

      <button onClick={handleNewConversation} disabled={loading}>
        {loading ? "Loading..." : showUserList ? "Hide New Conversation" : "New Conversation"}
      </button>

      {showUserList && (
        <div className="menu-select-users">
          <h3>Select users:</h3>
          {users.length === 0 ? (
            <p>No users available.</p>
          ) : (
            <ul className="user-list">
              {users.map(user => (
                <li key={user}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user)}
                      onChange={() => handleUserSelection(user)}
                    />
                    {user}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <button
            className="menu-button-select-users"
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0}
          >
            Create Conversation
          </button>
        </div>
      )}

      <button onClick={handleChats} disabled={loading}>
        {loading ? "Loading..." : showChats ? "Hide Chats" : "View Chats"}
      </button>

      {showChats && (
        <div className="menu-chat-with">
          <h3>Your Chats:</h3>
          {chats.length === 0 ? (
            <p>No chats available.</p>
          ) : (
            <ul className="chat-list">
              {chats.map((chat, index) => (
                <li key={index}>
                  <button className="chat-with" onClick={() => handleSelectChat(chat)}>
                    Chat with: {chat.chat.map(userObj => userObj.user).join(", ")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button className="menu-logout" onClick={() => navigate('/')}>Logout</button>
    </div>
  );
};

export default Menu;
