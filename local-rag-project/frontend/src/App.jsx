import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [apiKey, setApiKey] = useState('my-secret-dev-key');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadStatus(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/upload-pdf`, formData, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus({ 
        type: 'success', 
        message: `Processed ${response.data.chunks_generated} chunks.` 
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Upload failed. Check API key.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (query) => {
    const userMessage = { role: 'user', content: query };
    const assistantMessage = { role: 'assistant', content: '' };
    
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;
        
        // Update the last message in the set
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: 'assistant', 
            content: assistantText 
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Query error:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'assistant', 
          content: `Error: ${error.message || 'Failed to get answer.'}` 
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans selection:bg-primary-500/30">
      <Sidebar 
        apiKey={apiKey} 
        setApiKey={setApiKey} 
        onUpload={handleUpload} 
        uploadStatus={uploadStatus}
        isUploading={isUploading}
      />
      <ChatArea 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSendMessage}
        currentQuery={currentQuery}
        setCurrentQuery={setCurrentQuery}
      />
    </div>
  );
}

export default App;
