// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/signUp';
import ChatWithServer from './components/chatWithServer';
import Menu from './components/Menu';
import Conversation from './components/conversation';
import CreateCon from './components/createCon';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chatwithserver" element={<ChatWithServer />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/createCon" element={<CreateCon />} />
          <Route path="/conversation" element={<Conversation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
