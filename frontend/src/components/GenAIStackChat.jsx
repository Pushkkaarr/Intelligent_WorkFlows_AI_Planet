import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader } from 'lucide-react';
import { chatAPI } from '../api/endpoints';

export const GenAIStackChat = ({ isOpen, onClose, workflowId }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'GenAI Stack Chat',
      timestamp: new Date(),
      isTitle: true
    },
    {
      role: 'assistant',
      content: 'Start a conversation to test your stack',
      timestamp: new Date(),
      isSubtitle: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    // Handle bold text (**text**)
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Handle em dashes (-- becomes —)
    text = text.replace(/--/g, '—');
    
    // Handle line breaks
    text = text.replace(/\n/g, '<br />');
    
    // Handle numbered lists
    text = text.replace(/^(\d+)\.\s/gm, '<div class="ml-4">$1. ');
    text = text.replace(/<div class="ml-4">(\d+\.\s[^<]*)<br \/>(?=\d+\.)/gm, '<div class="ml-4">$1</div><div class="ml-4">');
    text = text.replace(/<div class="ml-4">([^<]*?)$(?!<div)/gm, '<div class="ml-4">$1</div>');
    
    // Handle bullet points
    text = text.replace(/^[-•]\s/gm, '<div class="ml-4">• ');
    text = text.replace(/<div class="ml-4">([^<]*?)<br \/>(?=[-•])/gm, '<div class="ml-4">$1</div><div class="ml-4">');
    
    return text;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage({
        message: input,
        workflowId: workflowId,
        conversationHistory: messages
          .filter(m => !m.isTitle && !m.isSubtitle)
          .map(m => ({
            role: m.role,
            content: m.content
          }))
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response || response.data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-96 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2">
              <MessageCircle className="text-green-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">GenAI Stack Chat</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 p-1 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
          {messages.map((msg, idx) => {
            if (msg.isTitle) {
              return (
                <div key={idx} className="flex items-center justify-center py-4">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <MessageCircle className="text-green-600" size={32} />
                  </div>
                </div>
              );
            }

            if (msg.isSubtitle) {
              return (
                <div key={idx} className="flex items-center justify-center py-2">
                  <p className="text-gray-500 text-sm">{msg.content}</p>
                </div>
              );
            }

            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    isUser
                      ? 'bg-green-600 text-white rounded-br-none'
                      : msg.isError
                      ? 'bg-red-100 text-red-900 rounded-bl-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(msg.content)
                  }}
                />
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2 shadow-sm">
                <Loader size={16} className="animate-spin text-green-600" />
                <span className="text-sm">Processing your request...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 rounded-b-lg">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message"
              className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition flex items-center justify-center"
              title="Send message"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
