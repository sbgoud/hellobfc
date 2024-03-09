
//App.js

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Client } from 'tdlib'; // Assuming you have TDLib set up
import LoginArea from './components/LoginArea';
import FilesDisplay from './components/FilesDisplay';
import './styles/styles.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);
  const [loginState, setLoginState] = useState('initial'); // Initial login state
  const [errorMessage, setErrorMessage] = useState(null); // Add the missing state
  const botToken = '7137528102:AAF1o57ztPpfpkkOqk15C5jwSRLpRGv-McM';
  // ... (TDLib integration to handle login, fetching saved messages)


  const apiId = 27317545; // Your actual Telegram API ID
  const apiHash = 'd1f33a01246e61a342e5b4cece1bf916'; // Your actual Telegram API hash
  
  const tdlibClient = useMemo(() => {
    return new Client({ 
        useTestDc: false, 
        apiId: apiId, 
        apiHash: apiHash 
    });
}, []);  









const getSavedMessagesChatId = useCallback(async () => {
  const chats = await tdlibClient.send({ '@type': 'getChats', offset_order: '9223372036854775807', offset_chat_id: 0, limit: 100 });   
  const savedMessagesChat = chats.chat_ids.find((id) => {
    const chat = tdlibClient.send({ 
        '@type': 'getChat',
        chat_id: id 
      });
    return chat.title === 'Saved Messages'; // Or any other reliable identifier
  });
  return savedMessagesChat || null;
},[tdlibClient]);


const fetchSavedMessages = useCallback(async () => {
  const savedMessagesChatId = await getSavedMessagesChatId();
  if (savedMessagesChatId) {
    const messages = await tdlibClient.send({
      '@type': 'getChatHistory',
      chat_id: savedMessagesChatId,
      limit: 100 // Adjust limit as needed
      
    }
    );
   // console.log(messages);
    // Process fetched 'messages'
    processSavedMessage(messages);
  }
},[getSavedMessagesChatId, tdlibClient]);



const handleTdlibUpdate = useCallback((update) => {
  const handleAuthorizationStateUpdate = (state) => {
    if (state['@type'] === 'authorizationStateReady') {
      fetchSavedMessages();
    }  // ... handle other states (waitingForPhoneNumber, etc.)
  };

  switch (update['@type']) {
    case 'updateAuthorizationState':
      handleAuthorizationStateUpdate(update.authorization_state);
      break;
    case 'updateNewMessage': 
      if (isMessageFromSavedMessages(update.message)) {
        processSavedMessage(update.message);
      }
      break;
    // ... other cases
    default: 
      console.log("Unknown update type:", update['@type']);
  }
}, [fetchSavedMessages]);




useEffect(() => {
  tdlibClient.on('update', handleTdlibUpdate); 
  tdlibClient.on('error', handleTdlibError); 

  return () => { 
    tdlibClient.close(); 
  };

}, [handleTdlibUpdate, tdlibClient]);
  


  
  








  const handleLoginStart = (phoneNumber) => {
    setLoginState('waitingForCode'); // Update state while waiting
    tdlibClient.send({
      '@type': 'setAuthenticationPhoneNumber',
      phone_number: phoneNumber,
    });
  };


  const handleCodeSuccess = (code) => {
    setLoginState('checkingCode');
    tdlibClient.send({
      '@type': 'checkAuthenticationCode',
      code: code,
    })
    .then(() => {
      // TDLib confirmed successful login
      handleLogin(); // Update the login state 
    })
    .catch((error) => {
      // TDLib reported an error 
      setLoginState('error');
      setErrorMessage('Incorrect code or login failed'); // Set error message
    });
  };




 

  const isMessageFromSavedMessages = (message) => {
    // TDLib doesn't provide a direct way to identify 'Saved Messages'
    // We'll use a heuristic approach:
    return message.chat_id === message.sender_id; 
  };

  const processSavedMessage = (message) => {
    // Assuming files are in message.content
    const file = message.content.document || message.content.photo || message.content.video || message.content.audio; // Or other relevant content types

    if (file) {
      const fileData = {
        id: file.id,
        name: file.file_name,
        url: `https://api.telegram.org/file/bot${botToken}/${file.remote.unique_id}` // Construct download URL
      };
      setSavedFiles((prevFiles) => [...prevFiles, fileData]);
    }
  };





  const handleTdlibError = (error) => {
    console.error("TDLib Error:", error); 
    setLoginState('error'); 
  };

  const handleLogin = () => {
    setIsLoggedIn(true); 
    fetchSavedMessages(); // Assuming you fetch messages after login
  };
  

  return (
    <div className="app-wrapper">
      {/* ... Your header, navigation, etc. */}
      <main>
        {/* ... */} 
        <div className="content-area">
          {console.log("app.js called")}
          <h1>Saved Messages</h1>
          {isLoggedIn ? (
            <FilesDisplay files={savedFiles} />
          ) : loginState === 'error' ? (
            <div>An error occurred during login</div>
          ) : (
            <LoginArea 
              loginState={loginState}
              onLoginStart={handleLoginStart} 
              onCodeSuccess={handleCodeSuccess} 
              onLogin={handleLogin} 
              errorMessage={errorMessage}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
